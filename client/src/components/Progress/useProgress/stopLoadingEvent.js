'use client';
import stopEvent from "./stopEvent";
export default (id, detail) => window.dispatchEvent(stopEvent(id, detail));