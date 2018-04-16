module.exports = {
  'extends': 'airbnb-base',
  'globals': {
    'window': 1,
    'document': 1,
    'pixels': 1
  },
  'rules': {
    'no-console': 1,
    'prefer-destructuring': ['error', {
      'array': 0,
      'object': 0
    }, {
      'enforceForRenamedProperties': 0
    }]
  }
};
