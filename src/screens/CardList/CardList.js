import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
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
import Button from '../../components/Button';
import Card from '../../components/Card';
import Field from '../../components/Field';
import LoadingIndicator from '../../components/LoadingIndicator';
import ScreenBackground from '../../components/ScreenBackground';
import Text from '../../components/Text';
import {useCards} from '../../data/cards';
import {useColumns} from '../../data/columns';
import {useElements} from '../../data/elements';
import ELEMENT_TYPES from '../../elementTypes';
import FIELD_DATA_TYPES from '../../fieldDataTypes';
import checkCondition from '../../utils/checkCondition';
import sortElements from '../../utils/sortElements';
import CardDetail from './CardDetail';
import EditElementForm from './EditElementForm';

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

  const {data: elements = []} = useQuery(['elements'], () =>
    elementClient.all().then(resp => resp.data),
  );

  const refreshElements = () => queryClient.invalidateQueries(['elements']);

  const {mutate: addElement} = useMutation({
    mutationFn: attributes => elementClient.create({attributes}),
    onSuccess: newElement => {
      setSelectedElementId(newElement.data.id);
      refreshElements();
    },
  });

  const addField = () =>
    addElement({
      'element-type': ELEMENT_TYPES.field,
      'data-type': FIELD_DATA_TYPES.text,
    });

  const addButton = () => addElement({'element-type': ELEMENT_TYPES.button});

  const {mutate: updateElement} = useMutation({
    mutationFn: elementAttributes => {
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

  const {mutate: deleteElement} = useMutation({
    mutationFn: () => elementClient.delete({id: selectedElementId}),
    onSuccess: () => {
      refreshElements();
      hideEditForm();
    },
  });

  function hideEditForm() {
    setSelectedElementId(null);
  }

  return (
    <View style={styles.fullHeight}>
      <Button onPress={addField}>Add Field</Button>
      <Button onPress={addButton}>Add Button</Button>
      <FlatList
        data={elements}
        keyExtractor={element => element.id}
        renderItem={({item: element}) => {
          if (selectedElementId === element.id) {
            return (
              <EditElementForm
                element={element}
                onSave={updateElement}
                onDelete={deleteElement}
                onCancel={hideEditForm}
              />
            );
          } else {
            return (
              <Button onPress={() => setSelectedElementId(element.id)}>
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

  function hideDetail() {
    setSelectedCardId(null);
    setFieldValues(null);
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
                    return (
                      <CardDetail
                        card={card}
                        onUpdate={updateCard}
                        onDelete={deleteCard}
                        onCancel={hideDetail}
                      />
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
                        testID={`card-${card.id}`}
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
