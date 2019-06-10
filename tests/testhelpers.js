/**
 * Test helpers
 */

const helperType = (wrapper, text, selector) => {
  const node = wrapper.find(selector);
  node.element.value = text;
  node.trigger('input');
};

const helperClick = (wrapper, selector) => {
  wrapper.find(selector).trigger('click');
};

export { helperType, helperClick };