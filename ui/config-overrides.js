const { aliasJest, configPaths, alias } = require('react-app-rewire-alias');

const aliasMap = configPaths('./tsconfig.paths.json');

module.exports = alias({
    ...configPaths('./tsconfig.paths.json'),
});

module.exports.jest = aliasJest(aliasMap);
