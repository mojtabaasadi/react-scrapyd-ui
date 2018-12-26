import React, { Component } from "react";
import NavBar from "./navbar"
import { Route, Redirect } from 'react-router'

class Base extends Component {
	constructor(props){
        super(props)
		this.state = {host:"localhost:6800",refresh:false}
	}


    render() {
        return (<NavBar  ></NavBar>)
  	}
}


export default Base;