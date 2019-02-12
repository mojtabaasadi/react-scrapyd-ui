import React, { Component } from "react";
import Base from "./base"
import { daemonStatus, listprojects,listjobs, listversions, listspiders,deleteVersion
,mergeJobs } from "../services/api"
import { ListGroup, ListGroupItem,Button } from 'reactstrap';
import {Link} from "react-router-dom"

class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {  status: {} }
    }
    componentWillMount() {
        this.daemonStatus()
    }

    daemonStatus() {
        daemonStatus(this.state.host).then((status) => {
            this.setState({ status: status })
            listprojects(this.state.host).then(({ projects }) => {
                status.projects = projects.map((p, i) => { return { name: p, spiders: [] } })
                for (let project of status.projects) {
                    listversions(project.name).then(({ versions }) => {
                        project.versions = versions
                        this.setState({ status: status })
                    })
                    listspiders(project.name).then(({ spiders }) => {
                        project.spiders = spiders
                        this.setState({ status: status })
                    })
                    listjobs(project.name).then(({running,pending,finished})=>{
                        let jobs = mergeJobs(running,pending,finished)
                        project.jobs = jobs.length
                        this.setState({ status: status })
                    })
                }
            })
        })
    }
    righteee(text) {
        return <div style={{ float: "right" }} >{text}</div>
    }

    remove(project,version){
        deleteVersion(project,version).then((res)=>{
            if(res.status==="ok"){
                this.daemonStatus()
            }
        })
    }
    

    render() {
        let projects = []
        if (this.state.status.projects) {
            projects = this.state.status.projects
        }
        return (
            <div>
                <Base />
                <div className="container" style={{ marginTop: "10px" }}>
                    <ListGroup>
                        <ListGroupItem active >{this.state.status.node_name}</ListGroupItem>
                        <ListGroupItem disabled> finished :{this.righteee(this.state.status.finished)}</ListGroupItem>
                        <ListGroupItem disabled> running :{this.righteee(this.state.status.running)}</ListGroupItem>
                        <ListGroupItem disabled > pending :{this.righteee(this.state.status.pending)}</ListGroupItem>
                    </ListGroup>

                    <ListGroup color="defualt" style={{ marginTop: "10px" }}>
                        <ListGroupItem active >projects{this.righteee(
                            <Link to="/ui/addversion" style={{color:"white",fontSize:"20px",fontWeight:"bold"}}>+</Link>
                            )}</ListGroupItem>
                        {projects.map((project) => {
                            return (
                                <ListGroupItem key={project.name} >
                                    <div className="row">
                                        <div className="col-sm-4">
                                            {project.name} (<a href={"/ui/"+project.name+"/jobs"}>{project.jobs} jobs</a>)
                                        </div>
                                        <div className="col-sm-4">
                                            {project.spiders?project.spiders.length+"spiders":''} 
                                        </div>
                                        <div className="col-sm-4">
                                            {project.versions?"@" + project.versions[project.versions.length-1]:""}
                                         <a href={'/ui/schedule/'+project.name}>
                                        <Button color="primary" size="xs" style={{float:"right",padding: '1px 6px',fontWeight:"bold",margin:5}}>
                                          @</Button></a>
                                        <Button color="danger" onClick={()=>this.remove(project.name,project.versions[0])}  size="xs" style={{float:"right",padding: '1px 6px',fontWeight:"bold",margin:5}}>-</Button>
                                        </div>
                                    </div>
                                </ListGroupItem>
                            )
                        })}
                    </ListGroup>
                </div>
            </div>
        )
    }
}


export default Home;