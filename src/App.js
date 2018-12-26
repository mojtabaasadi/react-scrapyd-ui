import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Home from "./components/home"
import AddVersion from "./components/addversion"
class App extends Component {
	
  	render() {
    	return (<Router>
			<div>
			<Route exact  path="/" component={Home}/>
			<Route path="/addversion" component={AddVersion}/>
			</div>
			</Router>)
  	}
}


export default App;