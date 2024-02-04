'use client'
import React from 'react'
import TabMenu from './TabMenu';
import TabPanel from './TabPanel';

export default ({ tabs: inTabs, MenuProps, TabProps, pageSwitchAction }) => {
    const [value, setValue] = React.useState(Math.max(inTabs.findIndex(tab => tab.default === true), 0))
    const [pending, startTrans] = React.useTransition()

    React.useEffect(() => {
        setValue(0)
    }, [inTabs.length])

    const handleChange = React.useCallback((event, newValue) => {
        if (newValue === value)
            return
        startTrans(() => {
            if(pageSwitchAction){
                pageSwitchAction(newValue, () => setValue(newValue))
            }else{
                setValue(newValue)
            }
        })
    }, [value, pageSwitchAction])

    const tabs = React.useMemo(() => (
        inTabs.map((e, i) => <TabPanel key={i} index={i} pending={pending} value={value} {...TabProps}>{e.content}</TabPanel>)
    ), [value, inTabs, pending])

    const menu = React.useMemo(() => (
        <TabMenu
            tabs={inTabs.map((item) => item.name)}
            value={value}
            handleChange={handleChange}
            {...MenuProps}
        />
    ), [value, inTabs, handleChange])

    return { menu, tabs }
}
