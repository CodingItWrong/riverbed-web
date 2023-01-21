import sortBy from 'lodash.sortby';

export default function sortElements(elements) {
  return sortBy(elements, ['attributes.display-order']);
}
