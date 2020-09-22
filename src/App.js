import React, {useState, useEffect} from 'react';
import {FormControl, Select, MenuItem, Menu, CardContent, Card} from "@material-ui/core"
import InfoBox from "./InfoBox";
import Map from "./Map";
import Table from "./Table";
import {sortData} from "./util";
import './App.css';
import LineGraph from './LineGraph';
import numeral from "numeral";
import "leaflet/dist/leaflet.css";

function App() {

	const [countries, setCountries] = useState([]);
	const [country, setCountry] = useState('worldwide');
	const [countryInfo, setCountryInfo] = useState({});
	const [tableData, setTableData] = useState([]);
	const [countryName, setCountryName] = useState('Worldwide');
	const [mapCenter, setMapCenter] = useState({lat: 34.80746, lng: -40.4796});
	const [mapZoom, setMapZoom] = useState(3);
	const [mapCountries, setMapCountries] = useState([]);
	const [casesType, setCasesType] = useState("cases");

	console.log(mapCountries);

	useEffect(()=>{
		fetch("https://disease.sh/v3/covid-19/all")
		.then(response=>response.json())
		.then(data=>{
			setCountryInfo(data);
		})
	},[])

	useEffect(()=>{
		const getCountriesData = async ()=> {
			await fetch("https://disease.sh/v3/covid-19/countries")
			.then((response) => response.json())
			.then((data) => {
				setMapCountries(data);
				const countries = data.map((country)=>(
					{
						name: country.country,
						value: country.countryInfo.iso2
					}
				));
				setTableData(sortData(data,casesType));
				setCountries(countries)
			});
		};

		getCountriesData();
	}, [])

	const onCountryChanged = async (event) => {
		const countryCode = event.target.value;

		const url = countryCode === 'worldwide' ? "https://disease.sh/v3/covid-19/all" : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

		await fetch(url)
		.then(response => response.json())
		.then(data=>{
			console.log(data.country);

			if (countryCode === "worldwide"){
				setMapCenter({lat: 34.80746, lng: -40.4796});
				setMapZoom(3);
			}
			else {
				setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
				setMapZoom(5);
			}

			setCountryName(data.country);
			setCountry(countryCode);
			setCountryInfo(data);
		});
	}

	console.log(countryInfo);

	//https://disease.sh/v3/covid-19/all
	//https://disease.sh/v3/covid-19/countries/[COUNTRY_CODE]

	return (
		<div className="app">
			<div className="app__left">
				<div className="app__header">
					<h1>COVID-19 TRACKER</h1>
					<h1>{countryName}</h1>
					<FormControl className="app__dropdown">
						<Select variant="outlined" value={country} onChange = {onCountryChanged}>
							<MenuItem value="worldwide">Worldwide</MenuItem>
							{
								countries.map(country => (
									<MenuItem value={country.value}>{country.name}</MenuItem>
								))
							}
						</Select>
					</FormControl>
				</div>

				<div className="app__stats">
					<InfoBox onClick={e => setCasesType("cases")} title="Cases" cases={numeral(countryInfo.todayCases).format("+0,0")} total={numeral(countryInfo.cases).format("0,0")}/>
					<InfoBox onClick={e => setCasesType("recovered")} title="Recovered" cases={numeral(countryInfo.todayRecovered).format("+0,0")} total={numeral(countryInfo.recovered).format("0,0")}/>
					<InfoBox onClick={e => setCasesType("deaths")} title="Deaths" cases={numeral(countryInfo.todayDeaths).format("+0,0")} total={numeral(countryInfo.deaths).format("0,0")}/>
				</div>

				<Map
					countries={mapCountries}
					center={mapCenter}
					zoom = {mapZoom}
					casesType={casesType}
				/>
			</div>

			<Card className="app__right">
				<CardContent>
					<h3>Live Cases Worldwide</h3>
					{/* Table */}
					<Table countries={tableData} casesType={casesType} />
					<h3>Cases Per Day</h3>
					{/* Graph */}
					<LineGraph casesType={casesType}/>
				</CardContent>
			</Card>
		</div>
	);
}

export default App;
