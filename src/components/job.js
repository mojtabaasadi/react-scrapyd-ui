import React, { Component } from "react";
import Base from "./base"
import { logger } from "../services/api"
import Logger,{LogEvent} from "../services/logger"

class Job extends Component {
    constructor(props) {
        super(props)
        this.state = {
            project: props.match.params.project,
            spider: props.match.params.spider,
            job: props.match.params.job,
            log: new Object()
        }
        this.fetchLog()
    }
    
    fetchLog(){
        logger(this.state.project,this.state.spider,this.state.job).then((res)=>{
            this.setState({log:new Logger(res)})
        })
    }

    renderEvent(event,inde){
        if (event instanceof LogEvent){
            return <p className="log-event" key={inde}>
            <span className="time">{event.date.toLocaleString()}</span>
            <span className="from">&nbsp;{event.from}</span>
            <span className="type">&nbsp;{event.type}:</span>
            <span className="text">&nbsp;{event.text}</span>
            </p>
        }else{
            let is_array =  Array.isArray(event.data)
            let Object_keys = Object.keys(event.data)
            return <pre  className="log-data" key={inde}>
            <span className="clickable" onClick={(e)=>{
                event.isOpen = !event.isOpen
                this.setState({log:this.state.log})
                }}>{event.isOpen?'⯆':'⯈'}&nbsp;DATA</span>
            <div style={{display:event.isOpen?'block':"none"}}>
            {
                is_array?event.data.map((data,i)=>{
                    return <p key={i}>{data}</p>
                }):Object_keys.map((key,i)=>{
                    return <p key={i}> {key} : {event.data[key]} </p>
                })
            }
            </div>
            </pre>
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
                <div className="container job_status" id="log" style={{ height: "calc(100vh - 100px)", overflowY: "scroll" }}>
                <pre >
                    {this.state.log.iter?this.state.log.iter.map((event,inde)=>{
                        return  this.renderEvent(event,inde)
                        
                    }):""}
                </pre>
                </div >
            </div >
        )
    }
}


export default Job;