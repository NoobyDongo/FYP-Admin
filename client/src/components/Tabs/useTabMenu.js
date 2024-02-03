'use client';
import { useState } from 'react';

export default function useTabMenu() {
    const [value, setValue] = useState(0);
    const handleChange = (e, newValue) => {
        setValue(newValue);
    };
    return [value, handleChange];
}
