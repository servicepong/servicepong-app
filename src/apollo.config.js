module.exports = {
  client: {
    addTypename: true,
    includes: ['apollo/**/*.ts'],
    name: 'frontend',
    service: {
      localSchemaFile: 'schema.graphql',
      name: 'servicepong-app',
    },
  },
};
