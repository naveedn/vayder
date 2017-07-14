# VAYDER
A library that allows you to validate inputs on express routes via middlewares. It leverages the power of [Joi][1] and [Celebrate][2] with an easy, fluent interface for the middlewares to make it effortless to build a robust validation layer on your [Express][4] server.

## How to Use
### 1) Create a JOI schema

```
// schema.js

const Joi = require('joi');

module.exports = Joi.object().keys({
  foo: Joi.string().required(),
  bar: Joi.number().min(10).max(20),
});
```

### 2) Add it to your Express route

```
// app.js

const express = require('express');
const vayder = require('vayder');

const blahSchema = require('./schema.js');
const app = express();


app.post('/blah',
  vayder.validateBody(blahSchema),
  (req, res) => { res.send('Hello World!');}
);

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});
```

## API:
| method | description | inputs |
| ------ | ----------- | ----- |
| validateBody | will validate the body of the request against the provided Joi Schema | Joi Schema, Joi Schema Options [optional] |
| validateParams | will validate the URL parameters passed into the request against the provided Joi Schema | Joi Schema, Joi Schema Options [optional] |
| validateQuery | will validate the request query string against the provided Joi Schema | Joi Schema, Joi Schema Options [optional] |
| validateHeaders | will validate the request Headers against the provided Joi Schema | Joi schema, Joi Schema Options [optional]  |


## Handling Errors
As per Joi docs, any validation failure that is caught by Joi will be thown as an error with the `.isJoi` property attached to it. It is recommended to have an error handling middleware at the bottom of your app.js to handle this:

```
app.use('*', (err, req, res, next) => {
    if(err.isJoi) {
      // do stuff
    }

    return next(err);
});
```


## Advanced

#### Multiple Validations
You can do multiple validations in a very clear and concise syntax:

```
app.get('/',
  vayder.validateHeaders(AuthenticationSchema),
  vayder.validateQuery(paginationSchema),
  vayder.validateParams(userIdSchema),
  someController.doStuff);
```

#### Passing in Joi Options
Every method allows you to pass in an optional config of all the [Joi options][3] you want to run on the schema. For example:

```
app.post('/blah',
  vayder.validateBody(blahSchema, {abortEarly: false}),
  (req, res) => { res.send('Hello World!');}
);
```

#### Organizing Schemas
A useful way to organize / manage the schema imports is by creating a directory tree called `models/validations` in your project.

```
webapp
├── app.js
├── controllers
├── datasource
├── middlewares
├── models
│   └── validations
│       ├── accessToken.js
│       ├── accountSignUp.js
│       ├── index.js
│       ├── credentials.js
│       └── pagination.js
│
├── routes.js
├── serializers
├── services
└── utilities
```

Then, in the `models/validations/index.js` file, you can manage a single entry point to all the validations:

```
// index.js

module.exports = {
  accessToken: require('./accessToken'),
  accountSignUp: require('./accountSignUp'),
  credentials: require('./credentials'),
  pagination: require('./pagination'),
}
```

This makes for a cleaner interface when validating routes:

```
// routes.js
const vayder = require('vayder');
const schemas = require('./models/validations');

app.get('/',
  vayder.validateHeaders(schemas.accessToken),
  vayder.validateQuery(schemas.pagination),
  someController.doStuff
);

```


[1]: https://github.com/hapijs/joi
[2]: https://github.com/continuationlabs/celebrate
[3]: https://github.com/hapijs/joi/blob/master/API.md#validatevalue-schema-options-callback
[4]: https://expressjs.com/
