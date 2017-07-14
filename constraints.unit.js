'use strict';

const chai = require('chai');
const dirtyChai = require('dirty-chai');
const expect = chai.expect;
const httpMocks = require('node-mocks-http');
const constraints = require('./constraints');
const Joi = require('joi');

chai.use(dirtyChai);

describe('Constraints Middleware', () => {
  const headerSchema = Joi.object().keys({
    Origin: Joi.string().uri(),
    'X-Forwarded-For': [Joi.string().ip(), Joi.string().uri()],
  });

  const bodySchema = Joi.object().keys({
    param1: Joi.array().max(5),
    param2: Joi.number().positive().required(),
  });

  const paramsSchema = Joi.object().keys({
    a: {
      b: Joi.string(),
      c: Joi.number(),
    },
    d: {
      e: Joi.any(),
    },
  });

  const querySchema = Joi.object().keys({
    foo: Joi.boolean(),
  });

  // we use POST method so validate on body param
  const req = httpMocks.createRequest({
    method: 'POST',
  });
  const res = httpMocks.createResponse();
  let validatemw;

  it('should verify that the return type is of Function', () => {
    expect(constraints.validateInputs).to.be.a('function');
  });

  it('should validate the headers', (done) => {
    req.headers = {
      Origin: 'http://www.example.com',
      'X-Forwarded-For': '127.0.0.1',
    };

    validatemw = constraints.validateHeaders(headerSchema);
    validatemw(req, res, (err) => {
      if (err) {
        throw new Error('Expected not to receive an error');
      }

      done();
    });
  });

  it('should validate the params', (done) => {
    req.params = {
      a: {
        b: 'blah blah',
        c: 1234234,
      },
      d: {
        e: true,
      },
    };

    validatemw = constraints.validateParams(paramsSchema);
    validatemw(req, res, (err) => {
      if (err) {
        throw new Error('Expected not to receive an error');
      }

      done();
    });
  });

  it('should validate the query', (done) => {
    req.query = {
      foo: false,
    };

    validatemw = constraints.validateQuery(querySchema);
    validatemw(req, res, (err) => {
      if (err) {
        throw new Error('Expected not to receive an error');
      }

      done();
    });
  });

  it('should validate the body', (done) => {
    req.body = {
      param1: ['red', 'happy', 'hatcher', 'bird'],
      param2: 23094203489,
    };

    validatemw = constraints.validateBody(bodySchema);
    validatemw(req, res, (err) => {
      if (err) {
        throw new Error('Expected not to receive an error');
      }

      done();
    });
  });

  it('should validate the inputs', (done) => {
    req.body = {
      param1: ['red', 'happy', 'hatcher', 'bird'],
      param2: 23094203489,
    };

    req.query = {
      foo: false,
    };

    req.params = {
      a: {
        b: 'blah blah',
        c: 1234234,
      },
      d: {
        e: true,
      },
    };

    req.headers = {
      Origin: 'http://www.example.com',
      'X-Forwarded-For': '127.0.0.1',
    };

    validatemw = constraints.validateInputs({
      headers: headerSchema,
      body: bodySchema,
      params: paramsSchema,
      query: querySchema,
    });

    validatemw(req, res, (err) => {
      if (err) {
        throw new Error('Expected not to receive an error');
      }

      done();
    });
  });

  it('should return error for invalid headers', (done) => {
    req.headers = {
      Origin: 'NOT A VALID URI OR IP ADDRESS',
      'X-Forwarded-For': 'your mother',
    };

    validatemw = constraints.validateHeaders(headerSchema);

    validatemw(req, res, (err) => {
      if (err && err.isJoi) {
        done();
      } else if (!err) {
        throw new Error('Expected to receive validation error');
      } else {
        throw new Error('Recieved error - but not validation error');
      }
    });
  });

  it('should return error for invalid params', (done) => {
    req.params = {
      a: {
        b: null,
        c: 1234234,
      },
    };

    validatemw = constraints.validateParams(paramsSchema);

    validatemw(req, res, (err) => {
      if (err && err.isJoi) {
        done();
      } else if (!err) {
        throw new Error('Expected to receive validation error');
      } else {
        throw new Error('Recieved error - but not validation error');
      }
    });
  });

  it('should return error for invalid query', (done) => {
    req.query = {
      foo: 23423,
    };

    validatemw = constraints.validateQuery(querySchema);

    validatemw(req, res, (err) => {
      if (err && err.isJoi) {
        done();
      } else if (!err) {
        throw new Error('Expected to receive validation error');
      } else {
        throw new Error('Recieved error - but not validation error');
      }
    });
  });

  it('should return error for invalid body', (done) => {
    req.body = {
      param1: ['sad', 'blue', 'howard', 'snake', 'limit', 'overflow', 'a', 'b'],
      param2: 23094203489,
    };

    validatemw = constraints.validateBody(bodySchema);

    validatemw(req, res, (err) => {
      if (err && err.isJoi) {
        done();
      } else if (!err) {
        throw new Error('Expected to receive validation error');
      } else {
        throw new Error('Recieved error - but not validation error');
      }
    });
  });

  it('should fail if any one of the schemas is not validated correctly', (done) => {
    req.body = {
      param1: ['red', 'happy', 'hatcher', 'bird'],
      param2: 23094203489,
    };

    req.query = {
      foo: 'this is supposed to be a BOOLEAN',
    };

    req.params = {
      a: {
        b: 'blah blah',
        c: 1234234,
      },
      d: {
        e: true,
      },
    };

    req.headers = {
      Origin: 'http://www.example.com',
      'X-Forwarded-For': '127.0.0.1',
    };

    validatemw = constraints.validateInputs({
      headers: headerSchema,
      body: bodySchema,
      params: paramsSchema,
      query: querySchema,
    });

    validatemw(req, res, (err) => {
      if (err && err.isJoi) {
        done();
      } else if (!err) {
        throw new Error('Expected to receive validation error');
      } else {
        throw new Error('Recieved error - but not validation error');
      }
    });
  });

  it('should allow for options to be passed into the function', (done) => {
    req.params = {
      a: {
        b: 'blah blah',
        c: 1234234,
      },
      d: {
        e: true,
      },
      unknownParameterBeingPassedIn: 'woohooooo',
    };

    const options = {
      stripUnknown: true,
    };

    validatemw = constraints.validateParams(paramsSchema, options);

    validatemw(req, res, (err) => {
      if (err && err.isJoi) {
        done(err);
      } else {
        expect(req.params.unknownParameterBeingPassedIn).to.not.exist();
        done();
      }
    });
  });
});
