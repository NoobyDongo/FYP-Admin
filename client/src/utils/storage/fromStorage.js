'use client';
export default function fromStorage(attr) {
    return JSON.parse(localStorage.getItem(attr));
}
