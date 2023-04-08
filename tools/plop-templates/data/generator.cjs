/**
 * Adds a generator for data packages.
 */
module.exports = {
  description:
    "Create a package that contains queries and mutations for a database table",
  prompts: [
    {
      type: "input",
      name: "name",
      message: "What is the table's name?",
    },
  ],
  actions: [
    {
      type: "add",
      path: "packages/data/{{dashCase name}}/index.ts",
      templateFile: `${__dirname}/template/index.ts.hbs`,
    },
    {
      type: "add",
      path: "packages/data/{{dashCase name}}/src/{{properCase name}}Data.ts",
      templateFile: `${__dirname}/template/data.ts.hbs`,
    },
    {
      type: "add",
      path: "packages/data/{{dashCase name}}/package.json",
      templateFile: `${__dirname}/template/package.json.hbs`,
    },
    {
      type: "add",
      path: "packages/data/{{dashCase name}}/tsconfig.json",
      templateFile: `${__dirname}/template/tsconfig.json.hbs`,
    },
  ],
};
