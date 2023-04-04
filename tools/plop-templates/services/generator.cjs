/**
 * Adds a generator for services.
 */
module.exports = {
  description: "Create a service that can perform rendering independent logic.",
  prompts: [
    {
      type: "input",
      name: "name",
      message: "What is the service's namespace? (Example: auth):",
    },
  ],
  actions: [
    {
      type: "add",
      path: "packages/services/{{dashCase name}}/index.ts",
      templateFile: `${__dirname}/template/index.ts.hbs`,
    },
    {
      type: "add",
      path: "packages/services/{{dashCase name}}/src/{{dashCase name}}-service.ts",
      templateFile: `${__dirname}/template/service.ts.hbs`,
    },
    {
      type: "add",
      path: "packages/services/{{dashCase name}}/package.json",
      templateFile: `${__dirname}/template/package.json.hbs`,
    },
  ],
};
