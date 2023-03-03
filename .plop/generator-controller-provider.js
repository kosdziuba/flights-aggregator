const rootPath = `${__dirname}/..`;
const srcPath = `${rootPath}/src`;

const typePath = {
  controller: `${srcPath}/controllers`,
  provider: `${srcPath}/providers`,
  service: `${srcPath}/services`,
};

const typeName = {
  controller: 'controller',
  provider: 'service',
  service: 'service',
};

module.exports = (plop) => {
  plop.setGenerator('cp', {
    description:
      'Generates controller, provider or service according to the project structure',
    prompts: [
      {
        type: 'list',
        name: 'type',
        message: 'Controller, provider or service',
        choices: Object.keys(typePath),
      },
      {
        type: 'input',
        name: 'name',
        message:
          'Enter name of the item (e.g "flights" or "car manufacturers")',
      },
    ],
    actions: ({ type }) => {
      return [
        {
          type: 'add',
          path: `${typePath[type]}/{{snakeCase name}}/index.ts`,
          templateFile: '.plop/templates/{{type}}/{{type}}.index.hbs',
        },
        {
          type: 'add',
          path: `${typePath[type]}/{{snakeCase name}}/${typeName[type]}.ts`,
          templateFile: '.plop/templates/{{type}}/{{type}}.hbs',
        },
        {
          type: 'add',
          path: `${typePath[type]}/{{snakeCase name}}/types.ts`,
          templateFile: '.plop/templates/{{type}}/{{type}}.types.hbs',
        },
        {
          type: 'add',
          path: `${typePath[type]}/{{snakeCase name}}/${typeName[type]}.spec.ts`,
          templateFile: '.plop/templates/{{type}}/{{type}}.spec.hbs',
        },
      ];
    },
  });
};
