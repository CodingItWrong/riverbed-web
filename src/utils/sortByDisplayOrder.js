import sortBy from 'lodash/sortBy';

export default function sortByDisplayOrder(elements) {
  return sortBy(elements, ['attributes.display-order']);
}
