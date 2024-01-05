'use client'
import { Box } from '@mui/material';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import FadeWrapper from '@/components/FadeWrapper'
import { useState } from 'react';

export function useTabMenu(){
    const [value, setValue] = useState(0);
    const handleChange = (e, newValue) => {
        setValue(newValue);
    };
    return [value, handleChange]
}

export function TabMenu({ tabs, value, handleChange, sx, ...other }) {
    return (
        <Box sx={{ minWidth: "100%", borderBottom: 1, borderColor: "divider", marginBottom: 2, ...sx }}>
            <Tabs {...other} value={value} onChange={handleChange} aria-label="basic tabs example">
                {tabs.map((e, i) => {
                    return (<Tab key={i}
                        sx={{
                        }}
                        label={e} {...a11yProps(i)} />)
                })}
            </Tabs>
        </Box>
    )
}

export function TabPanel({ children, value, index, ...other }) {

    return (
        <FadeWrapper
            key={value}
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <>
                    {children}
                </>
            )}
        </FadeWrapper>
    );
}
TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `tabpanel-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}