'use strict';

const celebrate = require('celebrate');

class Constraints {

  /** Will validate the request object with the specified schemas
   * @param {Object} schemaMap - map of req inputs => JOI schema to validate
   * valid keys for schemaMap:  headers, body, query, params
   * @param {Object} options - Joi options to be directly passed into validation
   * @returns {Function} a middleware function to execute
   */
  static validateInputs(schemaMap, options) {
    const opts = Object.assign({}, options);
    return celebrate(schemaMap, opts);
  }

  /** Facade wrapper for validateInputs
   * @param {Object} schemaObj - JOI schema to validate input against
   * @param {Object} options - [optional] options to pass to Joi directly
   */
  static validateHeaders(schemaObj, options) {
    return Constraints.validateInputs({ headers: schemaObj }, options);
  }

  /** Facade wrapper for validateInputs
   * @param {Object} schemaObj - JOI schema to validate input against
   * @param {Object} options - [optional] options to pass to Joi directly
   */
  static validateBody(schemaObj, options) {
    return Constraints.validateInputs({ body: schemaObj }, options);
  }

  /** Facade wrapper for validateInputs
   * @param {Object} schemaObj - JOI schema to validate input against
   * @param {Object} options - [optional] options to pass to Joi directly
   */
  static validateParams(schemaObj, options) {
    return Constraints.validateInputs({ params: schemaObj }, options);
  }

  /** Facade wrapper for validateInputs
   * @param {Object} schemaObj - JOI schema to validate input against
   * @param {Object} options - [optional] options to pass to Joi directly
   */
  static validateQuery(schemaObj, options) {
    return Constraints.validateInputs({ query: schemaObj }, options);
  }
}

module.exports = Constraints;
