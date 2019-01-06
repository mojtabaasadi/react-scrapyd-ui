import React, { Component } from "react";

export class LogEventcComp extends Component {
	constructor(props){
        super(props)
        this.state = {
            fromOpen:false,
            dateOpen:false,
        }
	}


    render() {
        return <p className="log-event" >
        <span className="time" onClick={
            (e)=>{this.setState({dateOpen:!this.state.dateOpen})}
            } >{this.state.dateOpen?this.props.event.date.toLocaleString():this.props.event.date.toLocaleTimeString()}</span>
        <span className="from" onClick={
            (e)=>{this.setState({fromOpen:!this.state.fromOpen})}
            } >&nbsp;{this.state.fromOpen?this.props.event.from:this.props.event.from.split(".")[this.props.event.from.split(".").length-1]}</span>
        <span className="type">&nbsp;{ this.props.event.type }</span>:
        <span className="text">&nbsp;{ this.props.event.text }</span>
        </p>
    }
}
export class DataLogEvent extends Component {
	constructor(props){
        super(props)
        this.state = {isOpen:false}
	}


    render() {
        let is_array = Array.isArray(this.props.event.data)
        let Object_keys = Object.keys(this.props.event.data)

        return <pre  className="log-data" >
        <span className="clickable" onClick={(e)=>{
            this.setState({isOpen:!this.state.isOpen})
            }}>{this.state.isOpen?'⯆':'⯈'}&nbsp;DATA</span>
        <div style={{display:this.state.isOpen?'block':"none"}}>
        {
            is_array?this.props.event.data.map((data,i)=>{
                return <p key={i}>{data}</p>
            }):Object_keys.map((key,i)=>{
                return <p key={i}> {key} : {this.props.event.data[key]} </p>
            })
        }
        </div>
        </pre>
  	}
}

