'use client';
import { useState } from 'react';
import Image from 'next/image';

export default function NextImage(props) {
    const { defaultSrc, src, ...others } = props;
    const [source, setSource] = useState(src || defaultSrc);

    return (
        <Image
            {...others}
            src={source}
            onErrorCapture={() => {
                setSource(defaultSrc);
            }} />
    );
}
