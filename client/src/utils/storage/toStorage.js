'use client';
export default function toStorage(attr, obj) {
    localStorage.setItem(attr, JSON.stringify(obj));
}
