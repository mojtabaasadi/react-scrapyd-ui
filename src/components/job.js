import React, { Component } from "react";
import Base from "./base"
import { HOST } from "../services/settings";
import { urlize,pickprotocol } from "../services/api"
import ServerLogEvent from "../services/sse"

class Job extends Component {
    constructor(props) {
        super(props)
        this.state = {
            project: props.match.params.project,
            spider: props.match.params.spider,
            job: props.match.params.job,
            log : ""

        }
        if(window.location.href.search("finished=true")>-1){
            fetch(pickprotocol(HOST)+"/logs/"+this.state.project+"/"+this.state.spider+"/"+this.state.job+".log").then((e)=>{
                return e.text()
                // this.setState({log:e.body})
            }).then((text)=>{
                this.setState({log:text})
            })
        }else{

            this.log = ""
            let ssurl = "http://" + HOST + "/livelog?" + urlize(this.state)
            
            this.sse = new EventSource(ssurl)
            this.sse.onmessage = this.parseMessage.bind(this)
            this.sse.onerror = this.parseError.bind(this)
        }
        }
        
        parseError(event){
        if(event.eventPhase == EventSource.CLOSED){
            this.sse.close()
        }
    }
    parseMessage(event){
        this.log += "\n" + event.data
        let logElem = document.querySelector("#log")
        if(this.log.length>=1000 || this.sse.CLOSED ){
            this.setState({log:this.state.log+this.log})
            this.log = ""
            if( logElem !== undefined){
                logElem.scrollTo(0,logElem.scrollHeight)
            }
        }
    }
    render() {

        return (
            <div>
                <Base />
                <div className="container">
                    <h6>
                        {this.state.job} logs in {this.state.project}
                    </h6>
                </div>
                <div className="container" id="log" style={{ height: "calc(100vh - 100px)", background: "#272822", overflowY: "scroll" }}>
                    <pre style={{ color: "white" }}>{this.state.log}</pre>
                </div >
            </div >
        )
    }
}


export default Job;