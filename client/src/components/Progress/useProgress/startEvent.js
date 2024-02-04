'use client';
export default (id, detail) => new CustomEvent("makingProgress" + id, { detail: { status: true, ...detail } });