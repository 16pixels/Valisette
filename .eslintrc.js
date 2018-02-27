module.exports = {
  'extends': 'airbnb-base',
  'globals': {
    'window': true,
    'document': true,
    'pixels': true
  },
  'rules': {
    'no-console': false,
    'prefer-destructuring': ['error', {
      'array': false,
      'object': false
    }, {
      'enforceForRenamedProperties': false
    }]
  }
};
