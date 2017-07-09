'use strict';

const celebrate = require('celebrate');

class Constraints {

  // Will validate the request object with the specified schemas
  // @param {Object} schemaMap - map of req inputs => JOI schema to validate
  //  valid keys for schemaMap:  headers, body, query, params
  // @returns {Function} a middleware function to execute
  static validateInputs(schemaMap) {
    return celebrate(schemaMap);
  }

  // Facade wrapper for validateInputs
  // @param {Object} schemaObj - JOI schema to validate input against
  static validateHeaders(schemaObj) {
    return Constraints.validateInputs({
      headers: schemaObj,
    });
  }

  // Facade wrapper for validateInputs
  // @param {Object} schemaObj - JOI schema to validate input against
  static validateBody(schemaObj) {
    return Constraints.validateInputs({
      body: schemaObj,
    });
  }

  // Facade wrapper for validateInputs
  // @param {Object} schemaObj - JOI schema to validate input against
  static validateParams(schemaObj) {
    return Constraints.validateInputs({
      params: schemaObj,
    });
  }

  // Facade wrapper for validateInputs
  // @param {Object} schemaObj - JOI schema to validate input against
  static validateQuery(schemaObj) {
    return Constraints.validateInputs({
      query: schemaObj,
    });
  }
}

module.exports = Constraints;
