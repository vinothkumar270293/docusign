function toTitleCase(str) {
  if (str == null) return '';
  return str
    .trim()
    .split('_')
    .join(' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

module.exports = {
  toTitleCase,
};
