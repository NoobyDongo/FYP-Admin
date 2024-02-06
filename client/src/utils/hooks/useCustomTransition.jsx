'use client';
import React from 'react';

export default function useCustomTransition(method) {
    const [loading, startLoading] = React.useTransition();
    const setValue = React.useCallback((value) => {
        startLoading(() => {
            method(value);
        });
    }, [method]);

    return [loading, setValue];
}
