module.exports = {
  preset: 'ts-jest', // Usa ts-jest para suporte ao TypeScript
  testEnvironment: 'node', // Define o ambiente de teste como Node.js
  testPathIgnorePatterns: ['/node_modules/'], // Ignora a pasta node_modules
  transform: {
    '^.+\\.ts$': 'ts-jest', // Transforma arquivos TypeScript
  },
  // Adicione quaisquer outras configurações que você precise
};
