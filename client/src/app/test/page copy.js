'use client'
import { Autocomplete, Box, Grid, List, ListItem, Popover, TextField, Typography } from "@mui/material"
import LocationOnIcon from '@mui/icons-material/LocationOn';
import parse from 'autosuggest-highlight/parse';
import { GoogleMap, InfoWindow, Marker, useLoadScript } from "@react-google-maps/api"
import React from "react"
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete"

const libraries = ['places']

export default function Home() {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
        libraries
    })

    if (!isLoaded) return <div>Loading...</div>
    return <Map />
}


const PlacesAutocomplete = ({ setSelected }) => {
    const {
        ready,
        value,
        setValue,
        suggestions: { status, data },
        clearSuggestions,
    } = usePlacesAutocomplete();

    //console.log(value);

    const handleSelect = async (address) => {
        setSelected(address);
        setValue(address, false);
        clearSuggestions();

        const results = await getGeocode({ address });
        const { lat, lng } = await getLatLng(results[0]);
        console.log(lat, lng);
        setSelected({ lat, lng });
    };

    return (
        <>
            <Autocomplete
                sx={{ width: 300 }}
                disabled={!ready}
                options={data}
                loading={status === 'OK'}
                filterOptions={(x) => x}
                isOptionEqualToValue={(option, value) => option.description === value.description}
                getOptionLabel={(option) =>
                    typeof option === 'string' ? option : option.description
                }
                value={value}
                onChange={(event, newValue) => {
                    console.log(newValue);
                    handleSelect(newValue?.description);
                }}
                onInputChange={(event, newInputValue) => {
                    setValue(newInputValue);
                }}
                renderInput={(params) => <TextField {...params} sx={theme => ({ backgroundColor: theme.palette.background.default })} placeholder="Add a location" fullWidth />}
                renderOption={(props, option) => {
                    //console.log(option);
                    const matches =
                      option.structured_formatting.main_text_matched_substrings || [];
            
                    const parts = parse(
                      option.structured_formatting.main_text,
                      matches.map((match) => [match.offset, match.offset + match.length]),
                    );
                    return (
                        <li {...props}>
                            <Grid container alignItems="center">
                                <Grid item sx={{ display: 'flex', width: 44 }}>
                                    <LocationOnIcon sx={{ color: 'text.secondary' }} />
                                </Grid>
                                <Grid item sx={{ width: 'calc(100% - 44px)', wordWrap: 'break-word' }}>
                                    {parts.map((part, index) => (
                                        <Box
                                            key={index}
                                            component="span"
                                            sx={{ fontWeight: part.highlight ? 'bold' : 'regular' }}
                                        >
                                            {part.text}
                                        </Box>
                                    ))}
                                    <Typography variant="body2" color="text.secondary">
                                        {option.structured_formatting.secondary_text}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </li>
                    );
                }}
            />
        </>
    );
};

function Map() {
    const center = React.useMemo(() => ({ lat: 22.32, lng: 114.115 }), [])
    const [selected, setSelected] = React.useState(null);

    return (
        <>
            <div className="places-container">
                <PlacesAutocomplete setSelected={setSelected} />
            </div>

            <GoogleMap
                zoom={10}
                center={center}
                mapContainerClassName="map-container"
            >
                {selected && <Marker position={selected} />}
            </GoogleMap>
        </>
    );
}