import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLoadScript, GoogleMap, Marker, InfoWindow, Size} from '@react-google-maps/api';
import logo from '../../images/logo.png'

import './Map.css';

export default function Map() {
    const [mapData, setMapData] = useState(null);
    const [markOpen, setMarkOpen] = useState(false);
    const [marker, setMarker] = useState("");

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: "AIzaSyA5nwhdd5jHqldO4NvNTpWZKhBKOsWlv6U"
      });

    const fetchmapdata = async () => {
        try {
            const response = await axios.get("http://18.223.24.199:3000/api/markers");
            //const response = await axios.get("http://localhost:3000/api/markers");
            if(response.data.success) {
                const d = response.data.data;
                setMapData(d);
            }
        }
        catch(err) {
            console.log(err);
        }
    }

    useEffect(() => {
        fetchmapdata();
      },[]);

      return isLoaded && (<GoogleMap
        mapContainerClassName = "map"
        center = {{lat: 39.1712722, lng: -86.5730454}}
        zoom={8}
        >
            {mapData != null && (mapData.map((data, k) => {
                return (<div key={k}><Marker
                position={data.location}
                onClick={() => {
                    setMarker({k});
                    setMarkOpen(true);
                }}>
                {markOpen && marker.k === k && (
                    <InfoWindow
                    position={data.location}
                    onClockClick={() => {
                        setMarkOpen = false;
                    }}>
                    <div>
                        <h3>{data.franchise}</h3>
                        <p>Company: {data.company}</p>
                        <p>Address: {data.address.streetAddress}<br/>{data.address.city}, {data.address.state} {data.address.postalCode}</p>
                        <a href = {data.dirlink} target="_blank">Directions</a>
                    </div>
                    </InfoWindow>
                )}
                </Marker></div>)
            }
            ))}
        </GoogleMap>);

}