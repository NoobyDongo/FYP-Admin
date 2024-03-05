'use client';
const removeFromCartEvent = (item) => new CustomEvent("removeFromCart", { detail: item });
export default removeFromCartEvent;