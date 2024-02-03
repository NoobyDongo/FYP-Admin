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

export default function TabMenu({ tabs, value, handleChange, sx, ...other }) {
    return (
        <Box sx={{ minWidth: "100%", borderBottom: 1, borderColor: "divider", ...sx }}>
            <Tabs {...other} value={value} onChange={handleChange} sx={(theme) => ({
                "& .MuiTabs-indicator":{
                    backgroundColor: theme.palette.background.default,
                    border: 1,
                    borderColor: 'divider',
                    height: .75,
                    borderRadius: 50,
                    top:"50%",
                    left:"50%",
                    zIndex: -1,
                    transform: "translateY(-50%)",
                },
                '& .MuiTabs-flexContainer' : {
                    py: .25,
                },
                zIndex: 2,
            })}>
                {tabs.map((e, i) => {
                    return (<Tab key={i}
                        sx={{
                            zIndex: 1000,
                            borderRadius: 50,
                            textTransform:"capitalize",
                            px: 2,
                            py: 0,
                            margin: 0.5,
                            minHeight: 40,
                        }}
                        label={e} {...a11yProps(i)} />);
                })}
            </Tabs>
        </Box>
    );
}
