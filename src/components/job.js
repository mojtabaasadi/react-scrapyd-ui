import React, { Component } from "react";
import Base from "./base"
import { HOST } from "../services/settings";
import { urlize } from "../services/api"
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
        let ssurl = "http://" + HOST + "/live?" + urlize(this.state)

        this.sse = new EventSource(ssurl)
        this.sse.onerror = (event)=>{
            if(event.type=="error" && event.eventPhase == EventSource.CLOSED){
                this.sse.close()
            }
            console.log(event)
        }
        this.sse.onmessage = (e)=>{
            this.setState({log:this.state.log+'\n'+e.data})
        }

    }
    // componentDidMount() {
    //     setTimeout(() => {
    //         this.socket.send("")
    //     }, 2000)
    // }

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