console.log('FAKE HTTP CLIENT');

export default function fakeHttpClient({token} = {}) {
  return new FakeHttpClient();
}

function jsonApiData(data) {
  return {data: {data}};
}

class FakeHttpClient {
  async get(path) {
    switch (path) {
      case 'boards?':
        return jsonApiData([board]);
      case `boards/${board.id}?`:
        return jsonApiData(board);
      case `boards/${board.id}/elements?`:
        return jsonApiData(elements);
      case `boards/${board.id}/columns?`:
        return jsonApiData(columns);
      case `boards/${board.id}/cards?`:
        return jsonApiData(cards);
      default:
        const message = `GET request not faked: ${path}`;
        console.error(message);
        throw new Error(message);
    }
  }

  async post(path, body, {headers} = {}) {
    switch (path) {
      case 'oauth/token':
        return {
          data: {access_token: 'fake_access_token'},
        };
      default:
        const message = `POST request not faked: ${path}`;
        console.error(message);
        throw new Error(message);
    }
  }

  async patch(path, body, {headers} = {}) {
    switch (path) {
      default:
        const message = `PATCH request not faked: ${path}`;
        console.error(message);
        throw new Error(message);
    }
  }

  async delete(path, body, {headers} = {}) {
    switch (path) {
      default:
        const message = `DELETE request not faked: ${path}`;
        console.error(message);
        throw new Error(message);
    }
  }
}

let idIncrementor = 0;
function getId() {
  idIncrementor += 1;
  return String(idIncrementor);
}

const board = {
  type: 'boards',
  id: getId(),
  attributes: {name: 'Fake Board'},
};

const messageField = {
  type: 'elements',
  id: getId(),
  attributes: {
    'element-type': 'field',
    'data-type': 'text',
    name: 'Message',
    'show-in-summary': true,
    options: {},
  },
};

const elements = [messageField];

const columns = [
  {
    type: 'columns',
    id: getId(),
    attributes: {name: 'All Cards'},
  },
];

const cards = [
  {
    type: 'cards',
    id: getId(),
    attributes: {
      'field-values': {
        [messageField.id]: 'Hello, Fake!',
      },
    },
  },
];
