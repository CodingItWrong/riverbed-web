import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {useState} from 'react';
import {ScrollView, StyleSheet, View, useWindowDimensions} from 'react-native';
import {KeyboardAwareFlatList} from 'react-native-keyboard-aware-scroll-view';
import Button from '../../components/Button';
import LoadingIndicator from '../../components/LoadingIndicator';
import Text from '../../components/Text';
import {useCards} from '../../data/cards';
import {useColumns} from '../../data/columns';
import {useElements} from '../../data/elements';
import checkCondition from '../../utils/checkCondition';
import CardDetail from './CardDetail';
import CardSummary from './CardSummary';

export default function CardList() {
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
                    return (
                      <CardSummary
                        card={card}
                        onPress={() => showDetail(card.id)}
                      />
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
});
