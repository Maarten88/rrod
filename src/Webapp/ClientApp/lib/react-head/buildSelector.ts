const buildSelector = obj =>
  Object.keys(obj)
    .map(k => `[${k}="${obj[k]}"]`)
    .join('');

export default buildSelector;
