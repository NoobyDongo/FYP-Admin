'use client';
import startEvent from "./startEvent";
export default (id, detail) => window.dispatchEvent(startEvent(id, detail));