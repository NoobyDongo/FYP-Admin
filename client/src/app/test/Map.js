import { useLoadScript } from "@react-google-maps/api"
import React from "react"

export default function HAHA() {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
        libraries: ["places"],
    });

    return <div>Loading...</div>
}

function Map() {
    const center = React.useMemo(() => ({ lat: 0, lng: 0 }), [])
    const [selected, setSelected] = React.useState(null)

    return (
        <>
            <GoogleMap
                mapContainerClassName='map-container'
                zoom={8}
                center={center}
            >
                <Marker
                    position={selected}
                />
                {selected ? (
                    <InfoWindow
                        position={selected}
                        onCloseClick={() => {
                            setSelected(null)
                        }}
                    >
                        <div>
                            <h2>Marker</h2>
                        </div>
                    </InfoWindow>
                ) : null}
            </GoogleMap>
        </>
    )
}