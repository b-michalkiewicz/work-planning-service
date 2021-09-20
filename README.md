## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

# API

### Create worker

**_Endpoint:_**

```bash
Method: POST
Type: RAW
URL: http://localhost:3000/workers/
```

**_Body:_**

```js
{
    "firstName": "Joe",
    "lastName": "Dde",
    "workingShifts": [{"kind": "morning", "date": {"year": 2020, "month": 1, "day": 1}},{"kind": "morning", "date": {"year": 2020, "month": 1, "day": 11}}]
}
```

### Get worker

**_Endpoint:_**

```bash
Method: GET
Type:
URL: http://localhost:3000/workers/{{workerId}}
```

### Update worker

**_Endpoint:_**

```bash
Method: PATCH
Type: RAW
URL: http://localhost:3000/workers/{{workerId}}
```

**_Body:_**

```js
{
    "firstName": "John",
    "lastName": "Smith"
}
```

### Delete worker

**_Endpoint:_**

```bash
Method: DELETE
Type:
URL: http://localhost:3000/workers/{{workerId}}
```

### Create shift

**_Endpoint:_**

```bash
Method: POST
Type: RAW
URL: http://localhost:3000/workers/{{workerId}}/shifts
```

**_Body:_**

```js
{
    "kind": "morning", "date": {"year": 2020, "month": 1, "day": 13}
}
```

### Update shift

**_Endpoint:_**

```bash
Method: PATCH
Type: RAW
URL: http://localhost:3000/workers/{{workerId}}/shifts
```

**_Body:_**

```js
{
    "kind": "day", "date": {"year": 2020, "month": 1, "day": 23}
}
```

### Delete shift

**_Endpoint:_**

```bash
Method: DELETE
Type: RAW
URL: http://localhost:3000/workers/{{workerId}}/shifts
```

**_Body:_**

```js
{
    "year": 2020, "month": 1, "day": 1
}
```
