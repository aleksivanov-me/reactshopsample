import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./styles.css";
import filterData from "./data"

function App() {
	const [state, setState] = useState({
		data: filterData,
		price: "",
		capacity: "",
		eclass: "",
		tags: "",
		sortby: ""
	})
	
	let data = state.data
	
	const [searchValue, setSearchValue] = useState("")

	function handleChange({ target: { name, value } }: any) {
		setState(prev => ({ ...prev, [name]: value }))
	}
	
	const datatags = [...new Set(data.flatMap(({tags}) => tags))].sort()
	const datacaps = [...new Set(data.flatMap(({capacity}) => capacity))].sort()
	const dataeclass = [...new Set(data.flatMap(({eclass}) => eclass))].sort()
	
	if(state.capacity && state.capacity !== "all") {
		data = data.filter(d => d.capacity === state.capacity)
	}
	
	if(state.eclass && state.eclass !== "all") {
		data = data.filter(d => d.eclass === state.eclass)
	}
	
	if(state.tags && state.tags !== "all") {
		data = data.filter(d => d.tags.some(r=> state.tags.indexOf(r) >= 0))
	}
	
	if(searchValue)
	{
		data = data.filter(value => value.name.toLowerCase().includes(searchValue.toLowerCase()))
	}
	
	if(state.sortby)
	{
		if(state.sortby == "all")
		{
			data = data.sort((a, b) => parseFloat(a.id) - parseFloat(b.id))
		}
		else if(state.sortby == "price")
		{
			data = data.sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
		}
		else if(state.sortby == "capacity")
		{
			data = data.sort((a, b) => parseFloat(b.capacity) - parseFloat(a.capacity))
		}
	}
	
	const count = data.length
	
	const today = new Date().toLocaleDateString()
	const newday = new Date(Date.now() + 7*24*60*60*1000).toLocaleDateString()
	
	return (
		<div className="App">
			
			<div className="row center margintop20 marginbottom20 bold">
				<h1>Wybierz urzadzenie</h1>
			</div>
			
			<div className="row center gray">
				<div className="contentwidth paddingtop30 center">
					<input type="text" className="smallinput" onChange={(e) => setSearchValue(e.target.value)} value={searchValue} placeholder="Search..."/>
				</div>
				
				<div className="contentwidth paddingtop30 smpaddingtop5">
					<div className="sp25 padding5">
						<p className="paddingtop10 paddingbottom10 bold left"><label>Sortuj po:</label></p>
						<select
							id="sortby"
							name="sortby"
							value={state.sortby}
							onChange={handleChange}
							className="left"
						>
							<option value="all">Popularnosc</option>
							<option value="price">Cena</option>
							<option value="capacity">Pojemność</option>
						</select>
					</div>
					
					<div className="sp25 padding5">
						<p className="paddingtop10 paddingbottom10 bold left"><label>Funkcje:</label></p>
						<select
							id="tags"
							name="tags"
							value={state.tags}
							onChange={handleChange}
							className="left"
						>
							<option value="all">Pokaż wszystkie</option>
							{datatags.map((d, i) => (
								<option key={i} value={d}>{d}</option>
							))}
						</select>
					</div>
					
					<div className="sp25 padding5">
						<p className="paddingtop10 paddingbottom10 bold left"><label>Klassa energetyczna:</label></p>
						<select
							id="eclass"
							name="eclass"
							value={state.eclass}
							onChange={handleChange}
							className="left"
						>
							<option value="all">Pokaż wszystkie</option>
							{dataeclass.map((d, i) => (
								<option key={i} value={d}>{d}</option>
							))}
						</select>
					</div>
					
					<div className="sp25 padding5">
						<p className="paddingtop10 paddingbottom10 bold left"><label>Pojemność:</label></p>
						<select
							id="capacity"
							name="capacity"
							value={state.capacity}
							onChange={handleChange}
							className="left"
						>
							<option value="all">Pokaż wszystkie</option>
							{datacaps.map((d, i) => (
								<option key={i} value={d}>{d}kg</option>
							))}
						</select>
					</div>
					
					<p className="left padding5">Liczba wynikow: {count}</p>
					
				</div>
				
				<div className="contentwidth paddingtop5 paddingbottom30 smpaddingtop5">
					{data.map((d, i) => (
						<div key={i} className="sp33 cardblock">
							<div key={i} className="cardblockbody left">
								<img src={d.picture} />
								<h3 className="bold left cardblocktitle">{d.name}</h3>
								<p className="smallp left">Pojemność (kg): <span> {d.capacity}</span></p>
								<p className="smallp left">Wymiary (GxSxW): <span> {d.size}</span></p>
								<p className="smallp left">Funkcje: <span> {d.tags.join(", ")}</span></p>
								
								<p className="smallp left margintop20">Klasa energetyczna: <span className="eclass">{d.eclass}</span></p>
								
								<p className="smallp left margintop20">Cena obowiazuje: {today} - {newday}</p>
								<p className="left margintop5 cardblockprice"><span>{d.price}</span><span className="sup">00</span><span className="sub">zł</span></p>
								
								<p className="left margintop5 ratprice">{(Number(d.price) / 60).toFixed(2)} zł x 60 rat</p>
								
								{i == 2 ? <p className="center margintop20"><button className="btn btn-primary btn-selected">WYBRANE</button></p> : <p className="center margintop20"><button className="btn btn-primary">WYBIERZ</button></p>}
								
							</div>
						</div>
					))}
				</div>
				
				{data.length == 0 ? <p className="center marginbottom30">No results found... Please, try clear parameters and again.</p> : ''}
				
				<p className="center marginbottom30"><a href="">Pokaż więcej &#9662;</a></p>
				
			</div>
			
			<div className="row center margintop20 marginbottom20 bold"></div>
			
		</div>
	);
}

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)
root.render(
	<App />
);