import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Home from "./components/home"
import AddVersion from "./components/addversion"
import Schedule from "./components/schedule"
import Jobs from "./components/jobs"
import Job from "./components/job"
import "./App.css"

class App extends Component {
	
  	render() {
    	return (<Router>
			<div>
				<Route exact  path="/" component={Home}/>
				<Route path="/addversion" component={AddVersion}/>
				<Route path="/schedule/:project" component={Schedule}/>
				<Route path="/:project/jobs" component={Jobs}/>
				<Route path="/:project/:spider/:job" component={Job}/>
			</div>
			</Router>)
  	}
}


export default App;