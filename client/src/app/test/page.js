'use client'
import { APIProvider, AdvancedMarker, Map, MapCameraChangedEvent, MapCameraProps } from "@vis.gl/react-google-maps";
import React from "react";
import { PlaceAutocompleteClassic } from "./auto";

const INITIAL_CAMERA = {
    center: { lat: 22.32, lng: 114.115 },
    zoom: 10
};

export default function E() {
    const [cameraProps, setCameraProps] =
        React.useState(INITIAL_CAMERA);
    const handleCameraChange = React.useCallback((ev) =>
        setCameraProps(ev.detail)
    );
    const [selected, setSelected] = React.useState(null);
    const onPlaceSelect = (e) => {
        console.log(e);
        console.log({
            lat: e.geometry.location.lat(),
            lng: e.geometry.location.lng()
        });
        setCameraProps({
            ...cameraProps,
            center: {
                lat: e.geometry.location.lat(),
                lng: e.geometry.location.lng()
            },
        });
        setSelected({
            lat: e.geometry.location.lat(),
            lng: e.geometry.location.lng()
        });
    }


    return (
        <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
            <div>
                <PlaceAutocompleteClassic onPlaceSelect={onPlaceSelect} />
            </div>
            <div style={{ height: '100%', width: '100%' }}>
                <Map
                    {...cameraProps} onCameraChanged={handleCameraChange}
                    mapId={'91ed6c354650846c'}
                >
                    {selected && <AdvancedMarker position={selected}>

                    </AdvancedMarker>}
                </Map>
            </div>
        </APIProvider>
    )
}