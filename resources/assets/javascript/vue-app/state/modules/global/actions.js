// It’s a heart of logic for module. 
// Every state change from outside of module should be invoked as an action. 

// Actions are meant to:
// fetch something from server(or cache) - in this case they have to be asynchronous (return promise)
// mutate state of current module
// dispatch actions from same module (to avoid repeating logic)
// dispatch actions from another modules (only if it’s absolutely required)
// Their names should most possibly be unique and in simple way says what specific action is doing. Almost every action should return promise

// Good examples:
// fetchProduct - gets product by id from server or cache, sets it in products map and returns it by getter
// findProducts - fetches products by specific query, sets them in products map and returns them as array
// setCurrentProduct - param could be id, it could dispatch fetchProduct, mutate it to productsMap and mutate its id to currentProductId. Also if productId is null then it removes currentProduct.
// addCartItem
// toggleMicrocart

// Bad examples:
// list
// products
// reset


const actions = {
}

export default actions;