import { Box } from '@mui/material';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import FadeWrapper from '@/components/FadeWrapper'

export function TabMenu(props) {

    var key = 0
    const { tabs, value, handleChange, sx, ...other } = props;

    return (
        <Box sx={{ minWidth: "100%", borderBottom: 1, borderColor: "divider", ...sx, marginBottom: 4 }}>
            <Tabs {...other} value={value} onChange={handleChange} aria-label="basic tabs example">
                {tabs.map((e) => {
                    return (<Tab key={key}
                        sx={{
                        }}
                        label={e} {...a11yProps(key++)} />)
                })}
            </Tabs>
        </Box>
    )
}

export function TabPanel(props) {
    const { children, value, index, ...other } = props;

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
                <Box>
                    {children}
                </Box>
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
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}
/*
function example() {

    const [value, setValue] = useState(0);
    const handleChange = (e, newValue) => {
        setValue(newValue);
    };

    return (

        <Box paddingTop={4}>
            <TabMenu
                value={value}
                handleChange={handleChange}
                tabs={["1", "2", "3", "4", "5"]}
            />
            <Box sx={{ flex: "1" }}>
                <TabPanel value={value} index={0}>
                    1
                </TabPanel>
                <TabPanel value={value} index={1}>
                    2
                </TabPanel>
            </Box>
        </Box>
    )
}
*/