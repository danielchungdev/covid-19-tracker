import React from 'react'
import "./Map.css"
import {Map as LeafletMap, TileLayer} from "react-leaflet";
import {showDataMap} from "./util";


function Map({countries, center, zoom, casesType="cases"}) {
    return (
        <div className="map">
            <LeafletMap center={center} zoom={zoom}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreet</a> contributors'    
                />
                {showDataMap(countries, casesType)}
            </LeafletMap>
        </div>
    )
}

export default Map
