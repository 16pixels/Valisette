// Vuex state, except of mutations, should always be accessed by getters. Including actions.

// Getter should:
// start from is when returns Boolean, or get otherwise
// answer to question what am I returning?
// contain module name to ensure that getter is unique through whole vuex. But I doesn’t have to start with that name - first of all it should have natural name.
// So for example we have module category and in state availableFilters. So what am I returning? -> available Filters. And this filters are category filters . Its not a Boolean, it’s array or map so we’re starting with get -> getAvailableCategoryFilters

// Good examples:
// for state user -> isUserLoggedIn(), getUser()
// for state availableFilters -> getAvailableCategoryFilters()
// for state currentProductId -> getCurrentProduct() (because it gets product object from map), getCurrentProductId()

// Bad examples:
// totals()
// product()
// current()
// list()

export default {
  getActiveLang(state) {
    return state.activeLang;
  },
  getDefaultLang(state) {
    return state.defaultLang;
  }
}