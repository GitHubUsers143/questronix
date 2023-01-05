const esModules = [
  '@react-native',
  'react-native',
  'react-navigation-tabs',
  'react-native-splash-screen',
  'react-native-screens',
  'react-native-reanimated',
  'react-native-responsive-screen',
  'react-native-elements',
  'react-native-size-matters',
  'react-native-ratings',
].join('|');

module.exports = {
  preset: 'react-native',
  automock: false,
  setupFiles: ['./mock.tsx'],
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  transformIgnorePatterns: [`node_modules/(?!(${esModules})/)`],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
