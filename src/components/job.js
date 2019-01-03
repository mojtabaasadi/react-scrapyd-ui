import React, { Component } from "react";
import Base from "./base"
import { HOST } from "../services/settings";
import { urlize } from "../services/api"

class Job extends Component {
    constructor(props) {
        super(props)
        this.state = {
            project: props.match.params.project,
            spider: props.match.params.spider,
            job: props.match.params.job,

        }
        let socket = "ws://" + HOST + "/live?" + urlize(this.state)
        this.socket = new WebSocket("ws://" + HOST + "/live?" + urlize(this.state))
        this.state.log = ""
        this.socket.onmessage = (data) => {
            console.log(data.data)
            this.setState({ log: this.state.log + data.data })
            let elem = document.getElementById("log")
            elem.scrollTo(0, elem.scrollHeight)
        }
    }
    componentDidMount() {
        setTimeout(() => {
            this.socket.send("")
        }, 2000)
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
                <div className="container" id="log" style={{ height: "calc(100vh - 100px)", background: "black", overflowY: "scroll" }}>
                    <pre style={{ color: "white" }}>{this.state.log}</pre>
                </div >
            </div >
        )
    }
}


export default Job;