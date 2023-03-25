/**
 * Adds a generator for components.
 */
module.exports = {
  description:
    "Create a standalone component that can be reused across the whole app",
  prompts: [
    {
      type: "input",
      name: "name",
      message: "What is the component's name?",
    },
  ],
  actions: [
    {
      type: "add",
      path: "packages/components/{{dashCase name}}/index.tsx",
      templateFile: `${__dirname}/template/index.ts.hbs`,
    },
    {
      type: "add",
      path: "packages/components/{{dashCase name}}/src/{{dashCase name}}.tsx",
      templateFile: `${__dirname}/template/component.tsx.hbs`,
    },
    {
      type: "add",
      path: "packages/components/{{dashCase name}}/package.json",
      templateFile: `${__dirname}/template/package.json.hbs`,
    },
  ],
};
