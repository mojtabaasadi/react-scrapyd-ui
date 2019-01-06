import React, { Component } from "react";
import Base from "./base"
import {Input} from "reactstrap";
import { logger } from "../services/api"
import Logger,{LogEvent,DataEvent} from "../services/logger"
import {DataLogEvent,LogEventcComp} from "./log"

class Job extends Component {
    constructor(props) {
        super(props)
        this.logTypes = ["DEBUG","INFO","ERROR","WARNING","DATA"]
        this.state = {
            project: props.match.params.project,
            spider: props.match.params.spider,
            job: props.match.params.job,
            log: new Object(),
            logTypes:["INFO","DATA"]
        }
        this.fetchLog()
    }
    
    fetchLog(){
        logger(this.state.project,this.state.spider,this.state.job).then((res)=>{
            this.setState({log:new Logger(res)})
            if(!this.state.log.isFinished){
                setTimeout(this.fetchLog.bind(this),4000)
            }
        })
    }

    renderEvent(event,inde){
        if (event instanceof LogEvent && this.state.logTypes.includes(event.type)){
            return <LogEventcComp key={inde} event={event}></LogEventcComp>
        }else if(event instanceof DataEvent && this.state.logTypes.includes('DATA')){
            return <DataLogEvent key={inde} event={event} ></DataLogEvent>
        }
    }
    createDownload(element,events,name){
        element.setAttribute('href', 'data:application/json;charset=utf-8,' +
        encodeURIComponent(JSON.stringify(events.map((e)=>{return e.data}),null,4)))
        element.setAttribute("download", name+".json");
    }
    items(){
        if(this.state.log.dataEvents){
            let keys  = Object.keys(this.state.log.dataEvents).filter((key)=>{
                return this.state.log.dataEvents[key].length > 1
            })
            if(keys.length>0){
                return <div style={{fontSize:'0.8rem'}}>
                    items : { keys.map((key)=>{
                        return <a key={key} className="clickable" onClick={(e)=>this.createDownload(e.target,this.state.log.dataEvents[key],key)}>{key}.json</a>
                    })}
                </div>
            }
        }
    }
    render() {
        return (
            <div>
                <Base />
                <div className="container">
                    <h6 style={{margin:0}}>
                        job logs in {this.state.project} - <span style={{fontSize:"0.6rem"}}>{this.state.job}</span>
                    </h6>
                    {this.items()}
                    <div style={{fontSize:'0.8rem'}}>

                    Show logs :{
                        this.logTypes.map((type,index)=>{
                            return <span key={index}>
                            {type}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<Input type="checkbox"
                            onChange={(e)=>{
                                if(e.target.checked && !this.state.logTypes.includes(type)){
                                    this.setState({logTypes:this.state.logTypes.concat([type])})
                                }
                                else if(!e.target.checked && this.state.logTypes.includes(type)){
                                    let pos = this.state.logTypes.indexOf(type)
                                    let neww = this.state.logTypes.slice(0,pos).concat(this.state.logTypes.slice(pos+1,))
                                    this.setState({logTypes:neww})
                                }
                            }} defaultChecked={this.state.logTypes.includes(type)} />
                            </span>
                        })
                    } 
                    </div>
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