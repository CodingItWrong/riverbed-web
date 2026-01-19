# JSON:API "includes" Investigation Report

## Summary

This report investigates whether the riverbed-web repository relies on JSON:API "includes" to query nested data and confirms the capabilities of the open-source library used to access the backend.

## Key Findings

### 1. JSON:API Library Used

**Library:** `@codingitwrong/jsonapi-client`  
**Version:** 0.0.11  
**Source:** https://github.com/CodingItWrong/jsonapi-client

### 2. Library Capability: YES, Supports "includes"

The `@codingitwrong/jsonapi-client` library **DOES support** the JSON:API `include` parameter through the `options` property. According to the library's source code:

#### Method Signatures
All query methods accept an optional `options` parameter:
- `all({options = {}} = {})`
- `find({id, options} = {})`
- `where({filter, options} = {})`
- `related({parent, relationship, options})`

#### How it Works
The `getOptionsQuery` function in the library converts any key-value pairs in the `options` object directly into query string parameters:

```javascript
const getOptionsQuery = (optionsObject = {}) =>
  Object.keys(optionsObject)
    .filter(k => typeof optionsObject[k] !== 'undefined')
    .map(k => `${k}=${encodeURIComponent(optionsObject[k])}`)
    .join('&');
```

#### Example Usage from Library Documentation
```javascript
resourceClient.all({
  options: {
    include: 'comments',
    sort: '-createdAt',
    'page[number]': 1,
  },
});
// Results in: GET /widgets?include=comments&sort=-createdAt&page[number]=1
```

### 3. Current Usage in Codebase: NO "includes" Used

**Finding:** The riverbed-web codebase **DOES NOT** currently use the JSON:API `include` parameter anywhere.

#### Current Data Fetching Pattern

The codebase uses a **separate API calls approach** for fetching related data:

1. **Boards** are fetched independently:
   ```javascript
   // src/data/boards.js
   boardClient.all().then(resp => resp.data)
   ```

2. **Related resources** (cards, columns, elements) are fetched via separate `.related()` calls without includes:
   ```javascript
   // src/data/cards.js
   cardClient.related({parent: board}).then(resp => resp.data)
   
   // src/data/columns.js
   columnClient.related({parent: board}).then(resp => resp.data)
   
   // src/data/elements.js
   elementClient.related({parent: board}).then(resp => resp.data)
   ```

3. **Individual resources** are fetched by ID without includes:
   ```javascript
   // src/data/cards.js
   cardClient.find({id: cardId}).then(resp => resp.data)
   ```

#### No Options Parameter Passed

Analysis of all data files (`boards.js`, `cards.js`, `columns.js`, `elements.js`, `user.js`) shows that **NONE** of the API calls pass an `options` parameter with `include` specified.

### 4. Architecture Implications

The current architecture:
- Makes **multiple sequential HTTP requests** to fetch related data
- Relies on **React Query caching** to manage relationships via separate cache keys like `['cards', boardId]`, `['columns', boardId]`, etc.
- Does **NOT** leverage JSON:API's compound documents feature (includes)

To use includes, the code would need to be modified to:
```javascript
// Example: Fetch a board with its related cards and columns in one request
boardClient.find({
  id: boardId,
  options: {
    include: 'cards,columns,elements'
  }
})
```

And then process the `included` array from the JSON:API response.

## Conclusion

1. ✅ **Library Support:** The `@codingitwrong/jsonapi-client` library fully supports JSON:API includes via the `options` parameter
2. ❌ **Current Usage:** The riverbed-web codebase does NOT currently use includes - it fetches related data through multiple separate API calls
3. 📋 **Opportunity:** The codebase could potentially be optimized to use includes to reduce the number of HTTP requests

## References

- Library Documentation: https://www.npmjs.com/package/@codingitwrong/jsonapi-client
- Source Code: https://github.com/CodingItWrong/jsonapi-client/blob/main/src/ResourceClient.js
- JSON:API Specification: https://jsonapi.org/format/#fetching-includes
