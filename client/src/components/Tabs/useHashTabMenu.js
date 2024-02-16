'use client'
import React from 'react'
import verifyToken from './verifyToken';
import TabMenu from './TabMenu';
import TabPanel from './TabPanel';
import customHashChangeEvent from '@/utils/events/customHashChangeEvent';
import { useRouter } from 'next/navigation';

function getTab(tabIndicators, previousValue) {
    let hashValue = Number(tabIndicators.findIndex(e => e.name === window.location.hash.substring(1)))
    //console.log("2 hash hashValue", hashValue)
    hashValue = hashValue < 0 ? previousValue : hashValue
    console.log("3 hash hashValue", hashValue, 'previousValue', previousValue, tabIndicators, 'final',  Math.max(Math.min(hashValue, tabIndicators.length - 1), 0))

    return Math.max(Math.min(hashValue, tabIndicators.length - 1), 0);
}

export default function useHashTabMenu({ tabs: inTabs, tabIndicators = [], sx, MenuProps, TabProps }) {
    const [value, setValue] = React.useState(getTab(tabIndicators, 0));
    const [storedEvent, setStoredEvent] = React.useState(null)
    const router = useRouter()

    const goto = React.useCallback((e) => {
        verifyToken(router, () => {
            //console.log("1 hash changedchangedchangedchangedchanged", window.location.hash)
            //console.log("hash changed", e.detail)
            //console.log("3 hash hashValue",e.detail.path, e.detail.forced || e.detail.path == window.location.pathname)

            //:-((
            if (e.detail.forced || e.detail.path == window.location.pathname) {
                if (e.detail.hash !== '')
                    window.location.hash = e.detail.hash
                //console.log("setting hash value")
                setValue(prev => getTab(tabIndicators, prev))
            } else {
                setStoredEvent(() => {
                    window.dispatchEvent(customHashChangeEvent({ hash: e.detail.hash, path: e.detail.path, forced: true }));
                })
            }
            //console.log("2 hash changedchangedchangedchangedchanged", window.location.hash)
        })
    }, [tabIndicators])

    React.useEffect(() => {
        window.addEventListener('customhashchange', goto);
        return () => {
            if (storedEvent) {
                //console.log("executed stored event")
                storedEvent()
            }
            window.removeEventListener('customhashchange', goto);
        };
    }, []);

    const handleChange = React.useCallback((event, newValue) => {
        let hash = tabIndicators[newValue].name
        //console.log("hash changed", hash, tabIndicators)
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