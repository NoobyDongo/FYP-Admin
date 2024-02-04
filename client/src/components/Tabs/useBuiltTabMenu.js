'use client'
import React from 'react'
import TabMenu from './TabMenu';
import TabPanel from './TabPanel';

export default ({ tabs: inTabs, MenuProps, TabProps }) => {
    const [value, setValue] = React.useState(Math.max(inTabs.findIndex(tab => tab.default === true), 0))

    React.useEffect(() => {
        setValue(0)
    }, [inTabs.length])

    const handleChange = (event, newValue) => {
        setValue(newValue)
    }

    const tabs = React.useMemo(() => (
        inTabs.map((e, i) => <TabPanel key={i} index={i} value={value} {...TabProps}>{e.content}</TabPanel>)
    ), [value, inTabs, TabProps])

    const menu = React.useMemo(() => (
        <TabMenu
            tabs={inTabs.map((item) => item.name)}
            value={value}
            handleChange={handleChange}
            {...MenuProps}
        />
    ), [value, inTabs, MenuProps, handleChange])

    return { menu, tabs }
}

/*
export default function useRoutingTabMenu({options, defaultValue = 0, sx, MenuProps}) {
const router = useRouter()
const [value, setValue] = React.useState(defaultValue)

const handleChange = (event, newValue) => {
    setValue(newValue)
    router.push(options[newValue].link)
}

const menu = (
    <TabMenu
        tabs={options.map((item) => item.name)}
        value={value}
        handleChange={handleChange}
        sx={sx}
        {...MenuProps}
    />
)

return {menu}
}
*/

/*
export default function useTabMenu(totalTabs) {
    const [value, setValue] = React.useState(getTab(totalTabs));
    
    const goto = (fn) => verifyToken(router, () => setValue(getTab(totalTabs)))
    
    useEffect(() => {
        window.addEventListener('hashchange', goto);
        return () => {
            window.addEventListener('hashchange', goto);
        };
    }, [router.events]);

    const handleChange = (event, newValue) => {
        setValue(newValue)
    };

    return [value, handleChange]
}
*/