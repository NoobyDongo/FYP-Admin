'use client';
const updateCartEvent = (id, quantity) => {
    //console.log('updateCartEvent', id, quantity)
    return new CustomEvent(`updateCart${id}`, { detail: quantity })
};
export default updateCartEvent;