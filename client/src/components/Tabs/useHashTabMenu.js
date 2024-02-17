'use client'
import React from 'react'
import verifyToken from './verifyToken';
import TabMenu from './TabMenu';
import TabPanel from './TabPanel';
import customHashChangeEvent from '@/utils/events/customHashChangeEvent';
import { useRouter } from 'next/navigation';

function getTab(tabIndicators, previousValue) {
    let hashValue = Number(tabIndicators.findIndex(e => e.name === window.location.hash.substring(1)))
    hashValue = hashValue < 0 ? previousValue : hashValue
    return Math.max(Math.min(hashValue, tabIndicators.length - 1), 0);
}

export default function useHashTabMenu({ tabs: inTabs, tabIndicators = [], sx, MenuProps, TabProps }) {
    const [value, setValue] = React.useState(getTab(tabIndicators, 0));
    const [storedEvent, setStoredEvent] = React.useState(null)
    const router = useRouter()

    const goto = React.useCallback((e) => {
        verifyToken(router, () => {
            //:-((
            if (e.detail.forced || e.detail.path == window.location.pathname) {
                if (e.detail.hash !== '')
                    window.location.hash = e.detail.hash
                setValue(prev => getTab(tabIndicators, prev))
            } else {
                setStoredEvent(() => {
                    window.dispatchEvent(customHashChangeEvent({ hash: e.detail.hash, path: e.detail.path, forced: true }));
                })
            }
        })
    }, [tabIndicators])

    React.useEffect(() => {
        window.addEventListener('customhashchange', goto);
        return () => {
            if (storedEvent) {
                storedEvent()
            }
            window.removeEventListener('customhashchange', goto);
        };
    }, []);

    const handleChange = React.useCallback((event, newValue) => {
        let hash = tabIndicators[newValue].name
        if (hash) {
            window.dispatchEvent(customHashChangeEvent({ hash, path: window.location.pathname, forced: true }));
        }
    }, [])

    const tabs = React.useMemo(() => inTabs ? (
        inTabs.map((e, i) => <TabPanel key={i} index={i} value={value} {...TabProps}>{e.content}</TabPanel>)
    ) : null, [value, inTabs])

    const menu = React.useMemo(() => (
        <TabMenu
            tabs={inTabs ? inTabs.map((item) => item.name) : tabIndicators.map((item) => item.displayname)}
            value={value}
            handleChange={handleChange}
            sx={sx}
            {...MenuProps}
        />
    ), [value, inTabs, handleChange])

    return { menu, tabs, value }
}