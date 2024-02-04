'use client';
import React from 'react';
import { ws } from '@/config';
import { io } from 'socket.io-client';

export default function useWsConnection() {

    const [connected, setConnected] = React.useState(false);

    const onConnect = () => {
        setConnected(true);
    };
    const onDisconnect = () => {
        setConnected(false);
    };

    React.useEffect(() => {
        const socket = io(ws)

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.close();
            socket.disconnect();
        };
    }, []);

    return connected;
}
