'use client';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

function a11yProps(index) {
    return {
        id: `tabpanel-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function TabMenu({ tabs, value, handleChange, TabProps, sx, ...other }) {
    return (
        <Tabs {...other} value={value} onChange={handleChange} sx={{
            "& .MuiTabs-indicator": {
                transitionDelay: '300ms',
                transform: "scaleX(.85) translateY(-5px)",
                borderRadius: 50,
            },
            '& .MuiTabs-flexContainer': {
                py: .25,
            },
            minWidth: "100%",
            zIndex: 2,
            ...sx
        }}>
            {tabs.map((e, i) => {
                return (<Tab key={i}
                    sx={{
                        zIndex: 1000,
                        borderRadius: 50,
                        textTransform: "capitalize",
                        px: 2,
                        py: 0,
                        margin: 0.5,
                        minHeight: 40,
                        ...TabProps?.sx
                    }}
                    label={e} {...TabProps} {...a11yProps(i)} />);
            })}
        </Tabs>
    );
}
