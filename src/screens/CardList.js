import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import sortBy from 'lodash.sortby';
import {useState} from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import {KeyboardAwareFlatList} from 'react-native-keyboard-aware-scroll-view';
import {SafeAreaView} from 'react-native-safe-area-context';
import COMMANDS from '../commands';
import Button from '../components/Button';
import ButtonElement from '../components/ButtonElement';
import Card from '../components/Card';
import Dropdown from '../components/Dropdown';
import Field from '../components/Field';
import LabeledCheckbox from '../components/LabeledCheckbox';
import LoadingIndicator from '../components/LoadingIndicator';
import ScreenBackground from '../components/ScreenBackground';
import Text from '../components/Text';
import TextField from '../components/TextField';
import {useCards} from '../data/cards';
import {useColumns} from '../data/columns';
import {useElements} from '../data/elements';
import ELEMENT_TYPES from '../elementTypes';
import FIELD_DATA_TYPES from '../fieldDataTypes';
import QUERIES from '../queries';
import dateUtils from '../utils/dateUtils';
import VALUES from '../values';

export default function AppContainer() {
  const [editingElements, setEditingElements] = useState(false);

  return (
    <ScreenBackground>
      <SafeAreaView style={styles.fullHeight}>
        {editingElements ? (
          <Button onPress={() => setEditingElements(false)}>
            Done Editing Elements
          </Button>
        ) : (
          <Button onPress={() => setEditingElements(true)}>
            Edit Elements
          </Button>
        )}
        {editingElements ? <ElementList /> : <CardList />}
      </SafeAreaView>
    </ScreenBackground>
  );
}

function ElementList() {
  const queryClient = useQueryClient();
  const elementClient = useElements();
  const [selectedElementId, setSelectedElementId] = useState(null);
  const [elementAttributes, setElementAttributes] = useState(null);

  const {data: elements = []} = useQuery(['elements'], () =>
    elementClient.all().then(resp => resp.data),
  );

  const refreshElements = () => queryClient.invalidateQueries(['elements']);

  const {mutate: addField} = useMutation({
    mutationFn: () =>
      elementClient.create({
        attributes: {
          'element-type': ELEMENT_TYPES.field,
          'data-type': FIELD_DATA_TYPES.text,
        },
      }),
    onSuccess: newElement => {
      setSelectedElementId(newElement.data.id);
      setElementAttributes(newElement.data.attributes);
      refreshElements();
    },
  });

  const {mutate: updateField} = useMutation({
    mutationFn: () => {
      const updatedElement = {
        type: 'elements',
        id: selectedElementId,
        attributes: elementAttributes,
      };
      return elementClient.update(updatedElement);
    },
    onSuccess: () => {
      hideEditForm();
      refreshElements();
    },
  });

  const {mutate: deleteField} = useMutation({
    mutationFn: () => elementClient.delete({id: selectedElementId}),
    onSuccess: () => {
      refreshElements();
      hideEditForm();
    },
  });

  function editElement(element) {
    setSelectedElementId(element.id);
    setElementAttributes(element.attributes);
  }

  function hideEditForm() {
    setSelectedElementId(null);
    setElementAttributes(null);
  }

  function updateAttribute(name, value) {
    setElementAttributes(oldAttributes => ({...oldAttributes, [name]: value}));
  }

  const dataTypeOptions = [
    {label: 'Text', value: FIELD_DATA_TYPES.text},
    {label: 'Date', value: FIELD_DATA_TYPES.date},
  ];

  return (
    <View style={styles.fullHeight}>
      <Button onPress={addField}>Add Field</Button>
      <FlatList
        data={elements}
        keyExtractor={element => element.id}
        renderItem={({item: element}) => {
          if (selectedElementId === element.id) {
            return (
              <View>
                <TextField
                  label="Field Name"
                  value={elementAttributes.name ?? ''}
                  onChangeText={value => updateAttribute('name', value)}
                  testID="text-input-field-name"
                />
                <Dropdown
                  fieldLabel="Data Type"
                  emptyLabel="(choose)"
                  value={dataTypeOptions.find(
                    o => o.value === elementAttributes['data-type'],
                  )}
                  onValueChange={option =>
                    updateAttribute('data-type', option.value)
                  }
                  options={dataTypeOptions}
                  keyExtractor={option => option.value}
                  labelExtractor={option => option.label}
                  testID="dropdown-data-type"
                />
                <LabeledCheckbox
                  label="Show in Summary"
                  checked={elementAttributes['show-in-summary']}
                  onChangeChecked={newChecked =>
                    updateAttribute('show-in-summary', newChecked)
                  }
                  testID="checkbox-show-in-summary"
                />
                <Button onPress={hideEditForm}>Cancel</Button>
                <Button onPress={deleteField}>Delete Field</Button>
                <Button onPress={updateField}>Save Field</Button>
              </View>
            );
          } else {
            return (
              <Button onPress={() => editElement(element)}>
                {element.attributes.name}
              </Button>
            );
          }
        }}
      />
    </View>
  );
}

function CardList() {
  const queryClient = useQueryClient();
  const elementClient = useElements();
  const columnClient = useColumns();
  const cardClient = useCards();
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [fieldValues, setFieldValues] = useState(null);

  const {data: elements = []} = useQuery(['elements'], () =>
    elementClient.all().then(resp => resp.data),
  );
  const {data: columns = []} = useQuery(['columns'], () =>
    columnClient.all().then(resp => resp.data),
  );
  const {data: cards = []} = useQuery(['cards'], () =>
    cardClient.all().then(resp => resp.data),
  );

  const refreshCards = () => queryClient.invalidateQueries(['cards']);

  const {mutate: addCard} = useMutation({
    mutationFn: () => cardClient.create({attributes: {}}),
    onSuccess: ({data: newCard}) => {
      setSelectedCardId(newCard.id);
      // TODO: remove duplication in having to remember to set field values
      setFieldValues(newCard.attributes['field-values']);
      refreshCards();
    },
  });

  const {mutate: updateCard} = useMutation({
    mutationFn: fieldValueOverrides => {
      const updatedCard = {
        type: 'cards',
        id: selectedCardId,
        attributes: {'field-values': {...fieldValues, ...fieldValueOverrides}},
      };
      return cardClient.update(updatedCard);
    },
    onSuccess: () => {
      refreshCards();
      hideDetail();
    },
  });

  const {mutate: deleteCard} = useMutation({
    mutationFn: () => cardClient.delete({id: selectedCardId}),
    onSuccess: () => {
      refreshCards();
      hideDetail();
    },
  });

  function showDetail(cardId) {
    setSelectedCardId(cardId);
    setFieldValues(
      cards.find(card => card.id === cardId).attributes['field-values'],
    );
  }

  function setFieldValue(fieldId, value) {
    setFieldValues(oldValues => ({...oldValues, [fieldId]: value}));
  }

  function setFieldValueAndSave(fieldId, value) {
    updateCard({[fieldId]: value});
  }

  function hideDetail() {
    setSelectedCardId(null);
    setFieldValues(null);
  }

  function handlePerformAction({card, action}) {
    const {command, field, value} = action;

    switch (command) {
      case COMMANDS.SET_VALUE:
        let concreteValue;
        switch (value) {
          case VALUES.EMPTY:
            concreteValue = null;
            break;
          case VALUES.NOW:
            concreteValue = dateUtils.objectToServerString(new Date());
            break;
          default:
            console.error(`unknown value: ${value}`);
            return;
        }
        setFieldValueAndSave(field, concreteValue);
        break;
      default:
        console.error(`unknown command: ${command}`);
    }
  }

  const {width: viewportWidth} = useWindowDimensions();
  const largeBreakpoint = 600;
  const responsiveColumnStyle = {
    width: viewportWidth > largeBreakpoint ? 400 : viewportWidth,
    padding: 8,
  };
  const responsiveButtonContainerStyle = {
    alignItems: viewportWidth > largeBreakpoint ? 'flex-start' : 'stretch',
  };

  if (!cards || !elements || !columns) {
    return <LoadingIndicator />;
  }

  return (
    <View style={styles.fullHeight}>
      <View style={[styles.buttonContainer, responsiveButtonContainerStyle]}>
        <Button onPress={addCard}>Add Card</Button>
      </View>
      <ScrollView horizontal style={styles.fullHeight}>
        {columns.map(column => {
          const {name, 'card-inclusion-condition': cardInclusionCondition} =
            column.attributes;

          const columnCards = cards.filter(card =>
            checkCondition({card, condition: cardInclusionCondition}),
          );

          return (
            <View
              key={column.id}
              testID={`column-${column.id}`}
              style={[responsiveColumnStyle, styles.fullHeight]}
            >
              <Text variant="titleLarge">{name}</Text>
              <KeyboardAwareFlatList
                extraScrollHeight={EXPERIMENTAL_EXTRA_SCROLL_HEIGHT}
                data={columnCards}
                keyExtractor={card => card.id}
                renderItem={({item: card}) => {
                  if (selectedCardId === card.id) {
                    const elementsToShow = sortElements(
                      elements.filter(element =>
                        checkCondition({
                          card,
                          condition: element.attributes['show-condition'],
                        }),
                      ),
                    );

                    return (
                      <Card key={card.id} style={styles.card}>
                        {elementsToShow.map((element, elementIndex) => {
                          switch (element.attributes['element-type']) {
                            case ELEMENT_TYPES.field:
                              return (
                                <Field
                                  key={element.id}
                                  field={element}
                                  value={fieldValues[element.id]}
                                  setValue={value =>
                                    setFieldValue(element.id, value)
                                  }
                                  readOnly={element.attributes['read-only']}
                                  style={
                                    elementIndex > 0 && styles.detailElement
                                  }
                                />
                              );
                            case ELEMENT_TYPES.button:
                              return (
                                <ButtonElement
                                  key={element.id}
                                  element={element}
                                  onPerformAction={() =>
                                    handlePerformAction({
                                      card,
                                      action: element.attributes.action,
                                    })
                                  }
                                  style={
                                    elementIndex > 0 && styles.detailElement
                                  }
                                />
                              );
                            default:
                              return (
                                <Text>
                                  unknown element type:{' '}
                                  {element.attributes['element-type']}
                                </Text>
                              );
                          }
                        })}
                        <Button
                          onPress={hideDetail}
                          style={styles.detailElement}
                        >
                          Cancel
                        </Button>
                        <Button
                          onPress={deleteCard}
                          style={styles.detailElement}
                        >
                          Delete
                        </Button>
                        <Button
                          primary
                          onPress={() => updateCard()}
                          style={styles.detailElement}
                        >
                          Save
                        </Button>
                      </Card>
                    );
                  } else {
                    const fieldsToShow = sortElements(
                      elements.filter(
                        field => field.attributes['show-in-summary'],
                      ),
                    );

                    return (
                      <Card
                        key={card.id}
                        style={styles.card}
                        onPress={() => showDetail(card.id)}
                      >
                        {fieldsToShow.map(field => (
                          <Field
                            key={field.id}
                            field={field}
                            value={card.attributes['field-values'][field.id]}
                            readOnly
                          />
                        ))}
                      </Card>
                    );
                  }
                }}
              />
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

function checkCondition({card, condition}) {
  if (!condition) {
    return true;
  }

  const value = card.attributes['field-values'][condition.field];
  switch (condition.query) {
    case QUERIES.IS_EMPTY:
      return !value;
    case QUERIES.IS_NOT_EMPTY:
      return !!value;
    default:
      console.error(`unrecognized query for condition: ${condition.query}`);
  }
}

function sortElements(elements) {
  return sortBy(elements, ['attributes.display-order']);
}

// Just guessed a value and it worked. Might be due to Add/title rows
const EXPERIMENTAL_EXTRA_SCROLL_HEIGHT = 100;

const styles = StyleSheet.create({
  fullHeight: {
    flex: 1,
  },
  buttonContainer: {
    margin: 8,
  },
  column: {
    marginHorizontal: 8,
    marginBottom: 8,
  },
  card: {
    margin: 4,
    marginTop: 8,
  },
  detailElement: {
    marginTop: 8,
  },
});
