'use client';
import closedTransitionMixin from "@/utils/styles/closedTransitionMixin";
import openedTransitionMixin from "@/utils/styles/openedTransitionMixin";
import { drawerOpenedWidth, drawerClosedWidth } from './drawer/customDrawerConfig';

export const openedMixin = (theme) => ({
    ...openedTransitionMixin(theme, "width"),
    width: drawerOpenedWidth,
    overflowX: 'hidden',
});
export const closedMixin = (theme) => ({
    ...closedTransitionMixin(theme, "width"),
    overflowX: 'hidden',
    ...closedWidthMixin(theme)
});
export const closedWidthMixin = (theme) => ({
    width: drawerClosedWidth,
});
