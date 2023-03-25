const addComponentGenerator = require("./tools/plop-templates/components/generator.cjs");
const addServiceGenerator = require("./tools/plop-templates/services/generator.cjs");

/**
 * Main configuration for Plop, which allows us to create generators for
 * common repeating boilerplate, like adding new components or services.
 */
module.exports = function (plop) {
  plop.setGenerator("component", addComponentGenerator);
  plop.setGenerator("service", addServiceGenerator);
};
