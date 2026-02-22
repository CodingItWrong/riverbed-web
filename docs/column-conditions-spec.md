# Column Conditions Specification

This document describes the column conditions system used to filter which cards appear in a given board column. It is intended to guide server-side implementation of the same filtering logic.

## Overview

A column can define a list of **conditions** that act as card inclusion filters. A card is shown in the column only if it satisfies **all** conditions (i.e., conditions are ANDed). If the conditions list is null, empty, or absent, all cards are included.

Conditions are stored in the column's `card-inclusion-conditions` attribute.

---

## Data Structure

### Condition Object

```json
{
  "field": "<field-element-id>",
  "query": "<query-key>",
  "options": {
    "value": "<configured-value>"
  }
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `field` | string | Yes | The ID of the field element to evaluate |
| `query` | string | Yes | The query operator key (see [Queries](#queries)) |
| `options` | object | Conditional | Extra parameters. Required by some queries (see below) |
| `options.value` | string | Conditional | The concrete value to compare against, used by value-based queries |

### Column Attribute

```json
{
  "card-inclusion-conditions": [
    { "field": "42", "query": "IS_NOT_EMPTY" },
    { "field": "17", "query": "EQUALS_VALUE", "options": { "value": "approved" } }
  ]
}
```

### Evaluation Rules

- If `card-inclusion-conditions` is `null` or absent, all cards pass.
- If a condition is missing `field` or `query`, that condition is skipped (treated as passing).
- Conditions are evaluated using the card's field values, accessed by field ID from `card.attributes['field-values']`.

---

## Field Data Types

| Key | Description | Example Value |
|---|---|---|
| `text` | Free-form text string | `"hello world"` |
| `number` | Numeric string | `"42"` |
| `date` | ISO date string, lexicographically sortable | `"2024-03-15"` |
| `datetime` | ISO 8601 datetime string, lexicographically sortable | `"2024-03-15T12:00:00.000Z"` |
| `choice` | ID of selected choice option | `"choice-id-abc"` |
| `geolocation` | Object with `lat` and `lng` strings | `{ "lat": "37.77", "lng": "-122.41" }` |

---

## Queries

### Reference Table

| Key | Label | Requires `options.value` | Applicable Data Types |
|---|---|---|---|
| `CONTAINS` | contains | Yes | text, number, choice |
| `DOES_NOT_CONTAIN` | does not contain | Yes (via CONTAINS) | text, number, choice |
| `DOES_NOT_EQUAL_VALUE` | does not equal | Yes | all |
| `EQUALS_VALUE` | equals | Yes | all |
| `IS_CURRENT_MONTH` | current month | No | date, datetime |
| `IS_EMPTY` | empty | No | all |
| `IS_EMPTY_OR_EQUALS` | empty or equals | Yes | all |
| `IS_FUTURE` | future | No | date, datetime |
| `IS_NOT_CURRENT_MONTH` | not current month | No | date, datetime |
| `IS_NOT_EMPTY` | not empty | No | all |
| `IS_NOT_FUTURE` | not future | No | date, datetime |
| `IS_NOT_PAST` | not past | No | date, datetime |
| `IS_PAST` | past | No | date, datetime |
| `IS_PREVIOUS_MONTH` | previous month | No | date, datetime |

---

### Query Behaviors

#### `IS_EMPTY`
Returns `true` if the field value is falsy: `null`, `undefined`, or `""`.

| Value | Result |
|---|---|
| `null` | `true` |
| `undefined` | `true` |
| `""` | `true` |
| `"hello"` | `false` |
| `"0"` | `false` |

#### `IS_NOT_EMPTY`
Inverse of `IS_EMPTY`.

---

#### `EQUALS_VALUE`
Returns `true` if the field value strictly equals (`===`) `options.value`.

- Comparison is case-sensitive and exact.
- `null`, `undefined`, and `""` never match a non-empty configured value.

| Field Value | `options.value` | Result |
|---|---|---|
| `"approved"` | `"approved"` | `true` |
| `"Approved"` | `"approved"` | `false` |
| `""` | `"approved"` | `false` |
| `null` | `"approved"` | `false` |

#### `DOES_NOT_EQUAL_VALUE`
Inverse of `EQUALS_VALUE`. Requires `options.value`.

---

#### `CONTAINS`
Returns `true` if the field value contains `options.value` as a **case-insensitive** substring.

- If `options.value` is `""` (empty string), always returns `true`.
- If the field value is `null` or `undefined` and `options.value` is non-empty, returns `false`.

| Field Value | `options.value` | Result |
|---|---|---|
| `"capybara"` | `"yba"` | `true` |
| `"Capybara"` | `"YBA"` | `true` |
| `"cat"` | `"yba"` | `false` |
| `null` | `"yba"` | `false` |
| `"anything"` | `""` | `true` |
| `null` | `""` | `true` |

#### `DOES_NOT_CONTAIN`
Inverse of `CONTAINS`. Requires `options.value`.

---

#### `IS_EMPTY_OR_EQUALS`
Returns `true` if the field value is empty (see `IS_EMPTY`) **or** equals `options.value` (see `EQUALS_VALUE`).

| Field Value | `options.value` | Result |
|---|---|---|
| `""` | `"a"` | `true` |
| `null` | `"a"` | `true` |
| `"a"` | `"a"` | `true` |
| `"b"` | `"a"` | `false` |
| `"A"` | `"a"` | `false` |

---

#### `IS_CURRENT_MONTH`
Returns `true` if the field value falls within the current calendar month.

- Only applies to `date` and `datetime` field types.
- Returns `false` for all other field types, including unknown types.
- Returns `false` for invalid or missing values.
- "Current month" is determined relative to the server's evaluation time.

**Date format:** `"YYYY-MM-DD"` (e.g., `"2024-03-15"`)
**Datetime format:** ISO 8601 (e.g., `"2024-03-15T12:00:00.000Z"`)

#### `IS_NOT_CURRENT_MONTH`
Inverse of `IS_CURRENT_MONTH`. Also only applies to temporal types; returns `false` for non-temporal types.

---

#### `IS_PREVIOUS_MONTH`
Returns `true` if the field value falls within the calendar month immediately preceding the current month.

- Applies to `date` and `datetime` field types.
- Returns `false` for invalid or missing values.

---

#### `IS_FUTURE`
Returns `true` if the field value is strictly after the current moment.

- Only applies to `date` and `datetime` field types. Returns `false` for all other types.
- Returns `false` for invalid or missing values.
- For `date` fields: "now" is the current date as `"YYYY-MM-DD"`; today's date is **not** future.
- For `datetime` fields: "now" is the current instant; an exact match is **not** future.

| Field Value (date) | Now | Result |
|---|---|---|
| `"2024-03-05"` | `2024-03-04` | `true` |
| `"2024-03-04"` | `2024-03-04` | `false` |
| `"2024-03-03"` | `2024-03-04` | `false` |
| `null` | any | `false` |

#### `IS_NOT_FUTURE`
Inverse of `IS_FUTURE`. Only applies to temporal types; returns `false` for non-temporal types.

---

#### `IS_PAST`
Returns `true` if the field value is strictly before the current moment.

- Only applies to `date` and `datetime` field types. Returns `false` for all other types.
- Returns `false` for invalid or missing values.
- For `date` fields: today's date is **not** past.
- For `datetime` fields: an exact match to the current instant is **not** past.

| Field Value (date) | Now | Result |
|---|---|---|
| `"2024-03-03"` | `2024-03-04` | `true` |
| `"2024-03-04"` | `2024-03-04` | `false` |
| `"2024-03-05"` | `2024-03-04` | `false` |
| `null` | any | `false` |

#### `IS_NOT_PAST`
Inverse of `IS_PAST`. Only applies to temporal types; returns `false` for non-temporal types.

---

## Evaluation Algorithm

```
function cardPassesConditions(card, conditions, fields):
  if conditions is null or empty:
    return true

  for each condition in conditions:
    if condition.field is missing or condition.query is missing:
      continue  # skip incomplete conditions

    fieldId = condition.field
    fieldDataType = fields[fieldId].dataType
    fieldValue = card.fieldValues[fieldId]
    queryFn = QUERIES[condition.query]

    if queryFn is not found:
      log error
      continue

    if queryFn(fieldValue, fieldDataType, condition.options) is false:
      return false

  return true
```

---

## Notes on Temporal Comparison

For `IS_FUTURE`, `IS_NOT_FUTURE`, `IS_PAST`, and `IS_NOT_PAST`:

- Values are compared **as strings lexicographically**, which works because both `date` (`YYYY-MM-DD`) and `datetime` (ISO 8601 UTC) formats sort correctly as strings.
- "Now" for `date` types is the current UTC date formatted as `YYYY-MM-DD`.
- "Now" for `datetime` types is the current UTC instant formatted as ISO 8601 (e.g., `2024-03-15T14:30:00.000Z`).
- The comparison is **strict**: today is neither past nor future for `date` fields; the current instant is neither past nor future for `datetime` fields.
