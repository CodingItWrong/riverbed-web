import sortBy from 'lodash/sortby';

export default function sortByDisplayOrder(elements) {
  return sortBy(elements, ['attributes.display-order']);
}
