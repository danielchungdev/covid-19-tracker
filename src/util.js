import React from "react";
import numeral from "numeral";
import {Circle, Popup} from "react-leaflet";

const casesTypeColors = {
    cases: {
        hex: "#CC1034",
        multiplier: 800,
        st: "Infected"
    },
    recovered: {
        hex: "#7DD71D",
        multiplier: 1200,
        st: "Recovered"
    },
    deaths: {
        hex: "#FB4443",
        multiplier: 2000,
        st: "Deaths"
    },
};

export const sortData = (data, casesType='cases') =>{
    const sortedData = [...data];
    sortedData.sort((a, b)=>{
        if (a[casesType] > b[casesType]){
            return -1;
        }
        else {
            return 1;
        }
    })
    return sortedData;
}

export const showDataMap = (data, casesType='cases') => (
    data.map(country=>(
        <Circle
            center={[country.countryInfo.lat, country.countryInfo.long]}
            fillOpacity={0.3}
            color={casesTypeColors[casesType].hex}
            fillColor={casesTypeColors[casesType].hex}
            radius={Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier}
        >
            <Popup>
                <div>{country.country}</div>
                <h3>{casesTypeColors[casesType].st}</h3>
                <h4>{numeral(country[casesType]).format("0,0")}</h4>
            </Popup>
        </Circle>
    ))
);