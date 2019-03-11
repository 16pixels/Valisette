// Only mutations can change state of module.
// They should be synchronous (never returns promise), 
// not contain any logic (be extremely fast) except one needed to keep state as it should be (for example sets default value for state). 
// Mutations should be invoked only by actions from the same module. 
// In most cases it should be only a single action which invokes specific mutation.

// Types of mutation:
// SET_ - it’s the most common type of mutation. It can set an object (or whole array), set default value of object (or maybe clean array),
// ADD_ - it can add new element to state property which is an array or add new element to Map
// REMOVE_ - an opposite to ADD. It can remove map element or array element by index (or by finding object which is not recommended way on big arrays, then mutation could be slow)

const mutations = {
}
export default mutations;