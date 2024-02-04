'use client';
import styled from '@mui/material/styles/styled';
import Box from '@mui/material/Box';
import openCloseTransitionMixin from "@/utils/styles/openCloseTransitionMixin";
import { drawerOpenedWidth, drawerClosedWidth } from './drawer/customDrawerConfig';

export const Body = styled(Box, { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
    flexShrink: 1,
    display: "flex",
    flexDirection: "column",
    overflowX: "hidden",
    ...openCloseTransitionMixin({
        theme, open, transition: "width", onOpen: {
            paddingLeft: `calc(100% - ${drawerOpenedWidth}px - 100%)`,
            width: `calc(100vw - ${drawerOpenedWidth}px)`
        }, onClose: {
            paddingLeft: `calc(100% - ${drawerClosedWidth}px - 100%)`,
            width: `calc(100vw - ${drawerClosedWidth}px)`
        }
    })
}));
