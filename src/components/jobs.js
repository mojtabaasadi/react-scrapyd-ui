import React, { Component } from "react";
import Base from "./base"
import { listjobs, jobDetail } from "../services/api"
import {  Row, Col, Card, CardBody } from 'reactstrap';
import {logStatuses} from "../services/helpers"

let col_style ={
    "padding": "10px 0 10px 16px",
    "fontSize":"0.7rem"
}
const stat_style = {
    background: 'rgb(31, 51, 19)',
    color: 'whitesmoke',
    padding: '0 25px',
}
class Jobs extends Component {
    constructor(props) {
        super(props)
        this.state = {
            project: props.match.params.project, jobs: []
        }
        listjobs(this.state.project).then((jobs) => {
            jobs.finished.map((job) => {
                jobDetail(this.state.project, job.spider, job.id).then((det) => {
                    job.detail = det
                    job.details = Object.keys(det)
                    this.setState({ jobs: jobs })
                })
            })
            this.setState({ jobs: jobs })
        })
    }


    render() {

        return (
            <div>

                <Base />
                <div className="container">
                    <h6>Pending:</h6>
                    <Card  className={"jobs"}>
                                <CardBody>
                                <Row>
                                    <Col xs="3"></Col>
                                    <Col xs="2"></Col>
                                    <Col xs="3"></Col>
                                    <Col xs="2"></Col>
                                    <Col xs="2"></Col>
                                </Row>
                                {this.state.jobs.pending && this.state.jobs.pending.length ?
                                    this.state.jobs.pending.map((job) => {
                                            return <Row key={job.id}>
                                                <Col xs="3" style={col_style}>{job.project}</Col>
                                                <Col xs="2" style={col_style}>{job.spider}</Col>
                                                <Col xs="3" style={col_style}>{job.detail?job.detail['item_scraped_count']+" items":""}</Col>
                                                <Col xs="2" style={col_style}>{job.detail?job.detail['downloader/request_count']+" requests":""}</Col>
                                                <Col xs="2" style={col_style}>{job.detail?job.detail['finish_reasont']:""}
                                                <a href={'/'+this.state.project+"/"+job.spider+"/"+job.id}>logs</a>
                                                </Col>
                                            </Row>
                                        })
                                        : 'nothing pending'}
                            </CardBody>
                        </Card>
                    <h6>Running:</h6>
                    <Card  className={"jobs"}>
                                <CardBody>
                                <Row>
                                    <Col xs="3"></Col>
                                    <Col xs="2"></Col>
                                    <Col xs="3"></Col>
                                    <Col xs="2"></Col>
                                    <Col xs="2"></Col>
                                </Row>
                                {this.state.jobs.running && this.state.jobs.running.length ?
                                    this.state.jobs.running.map((job) => {
                                        return <Row key={job.id}>
                                                <Col xs="3" style={col_style}>{new Date(job.start_time).toLocaleString()}</Col>
                                                <Col xs="2" style={col_style}>{job.spider}</Col>
                                                <Col xs="3" style={col_style}>{job.detail?job.detail['item_scraped_count']+" items":""}</Col>
                                                <Col xs="2" style={col_style}>{job.detail?job.detail['downloader/request_count']+" requests":""}</Col>
                                                <Col xs="2" style={col_style}>{job.detail?job.detail['finish_reasont']:""}
                                                <a href={'/'+this.state.project+"/"+job.spider+"/"+job.id}>logs</a>
                                                </Col>
                                            </Row>
                                        })
                                        : 'nothing running'}
                            </CardBody>
                        </Card>
                    <h6>Finished:</h6>
                    <Card  className={"jobs"}>
                                <CardBody>
                                <Row>
                                    <Col xs="3"></Col>
                                    <Col xs="2"></Col>
                                    <Col xs="3"></Col>
                                    <Col xs="2"></Col>
                                    <Col xs="2"></Col>
                                </Row>
                                {this.state.jobs.finished && this.state.jobs.finished.length ? this.state.jobs.finished.map((job) => {
                                    let onClick = ()=>{
                                        job.showDetail=job.detail &&!job.showDetail
                                    this.setState({jobs:this.state.jobs})}
                                    return <Row key={job.id}  style={{cursor:"pointer"}}>
                                                <Col onClick={onClick} xs="3" style={col_style}>{new Date(job.start_time).toLocaleString()}</Col>
                                                <Col onClick={onClick} xs="2" style={col_style}>{job.spider}</Col>
                                                <Col onClick={onClick} xs="3" style={col_style}>{job.detail&&'item_scraped_count' in job.detail?job.detail['item_scraped_count']+" items":""}</Col>
                                                <Col onClick={onClick} xs="2" style={col_style}>{job.detail?job.detail['downloader/request_count']+" requests":""}</Col>
                                                <Col  xs="2" style={col_style}>{job.detail?job.detail['finish_reason']:""}
                                                <a href={'/'+this.state.project+"/"+job.spider+"/"+job.id+"?finished=true"}>&nbsp;logs</a>
                                                </Col>
                                                <Col xs="12" className={"job_status"} >
                                                {job.showDetail?job.details.map((key)=>{
                                                    return <p key={key} style={{fontSize:"x-small",margin:0}}>
                                                        {logStatuses(key)}:<span style={{float:"right"}}>
                                                        {job.detail[key]}</span>
                                                        </p>
                                                }):<a href={"/"+this.state.project+"/schedule"}></a>   }
                                                </Col>
                                            </Row>
                                        })
                                        : ''}
                            </CardBody>
                        </Card>

                </div >
            </div >
        )
    }
}


export default Jobs;