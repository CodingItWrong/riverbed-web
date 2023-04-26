console.log('FAKE HTTP CLIENT');

export default function fakeHttpClient({token} = {}) {
  return new FakeHttpClient();
}

function jsonApiData(data) {
  return {data: {data}};
}

const boards = [];
const cards = [];
const columns = [];

class FakeHttpClient {
  async get(path) {
    let match;
    if (path === 'boards?') {
      return jsonApiData(boards);
    } else if ((match = path.match(/^boards\/(\d+)\?$/))) {
      const id = match[1];
      return jsonApiData(boards.find(b => b.id === id));
    } else if (path.match(/^boards\/(\d+)\/cards\?$/)) {
      return jsonApiData([]);
    } else if ((match = path.match(/^boards\/(\d+)\/columns\?$/))) {
      return jsonApiData(columns);
    } else if (path.match(/^boards\/(\d+)\/elements\?$/)) {
      return jsonApiData([]);
    } else if ((match = path.match(/^columns\/(\d+)\?$/))) {
      const id = match[1];
      return jsonApiData(columns.find(b => b.id === id));
    } else {
      const message = `GET request not faked: ${path}`;
      console.error(message);
      throw new Error(message);
    }
  }

  async post(path, _body, {headers: _headers} = {}) {
    switch (path) {
      case 'oauth/token':
        return {
          data: {access_token: 'fake_access_token'},
        };

      case 'boards?':
        const newBoard = {
          type: 'boards',
          id: getId(),
          attributes: {
            name: null,
            icon: null,
            'color-theme': null,
            'favorited-at': null,
            options: {},
          },
        };
        boards.push(newBoard);
        return jsonApiData(newBoard);

      case 'cards?':
        const newCard = {
          type: 'cards',
          id: getId(),
          attributes: {
            'field-values': {},
          },
        };
        cards.push(newCard);
        return jsonApiData(newCard);

      case 'columns?':
        const newColumn = {
          type: 'columns',
          id: getId(),
          attributes: {
            name: null,
            'display-order': null,
            'card-grouping': {},
            'card-inclusion-conditions': [],
            'card-sort-order': {},
            summary: {},
          },
        };
        columns.push(newColumn);
        return jsonApiData(newColumn);

      default:
        const message = `POST request not faked: ${path}`;
        console.error(message);
        throw new Error(message);
    }
  }

  async patch(path, body, {headers: _headers} = {}) {
    if (path.match(/^boards\/(\d+)\?$/)) {
      const {id, attributes} = body.data;
      const board = boards.find(b => b.id === id);
      board.attributes = attributes;
      return jsonApiData(board);
    } else if (path.match(/^columns\/(\d+)\?$/)) {
      const {id, attributes} = body.data;
      const column = columns.find(b => b.id === id);
      column.attributes = attributes;
      return jsonApiData(column);
    } else {
      const message = `PATCH request not faked: ${path}`;
      console.error(message);
      throw new Error(message);
    }
  }

  async delete(path, body, {headers: _headers} = {}) {
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
