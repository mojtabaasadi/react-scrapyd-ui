import React, { Component } from "react";
import Base from "./base"
import { listversions, listspiders, listjobs,schedule } from "../services/api"
import { Form, Row, Col, FormGroup, Button, Input, InputGroup, Label } from 'reactstrap';

class Schedule extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: {
                project: props.match.params.project,
                spider: null,
                jobid: null,
                _version: null,
                setting: null
            }, _setting: [{ key: "", value: "" }], spiders: [], versions: [], jobs: [], is_valid: false
        }
        listspiders(this.state.data.project).then(({ spiders }) => {
            this.setState({ spiders: spiders })
            if (spiders.length == 1) {
                this.updateData("spider", spiders[0])
            }
        })
        listversions(this.state.data.project).then(({ versions }) => {
            this.setState({ versions: versions })
            if (versions.length == 1) {
                this.updateData("_version", versions[0])
            }
        })
        listjobs(this.state.data.project).then(({ running, pending, finished }) => {
            let jobs = [].concat(running).concat(pending).concat(finished)
            this.setState({ jobs: jobs })
            if (jobs.length == 1) {
                this.updateData("jobid", jobs[0])
            }
        })
    }
    updateData(key, value) {
        let newData = this.state.data
        newData[key] = value
        this.setState({ data: newData })
    }
    updateSetting(index, key, value) {
        let newSettings = this.state._setting
        newSettings[index][key] = value
        this.setState({ _setting: newSettings })
        this.mergeSettings(newSettings)
    }
    mergeSettings(settings) {
        this.updateData("setting", settings.reduce((a, b) => { return a + (b.key + "=" + b.value + ",") }, ""))
    }
    render() {

        return (
            <div>

                <Base />
                <div className="container">
                    <Form>
                        <h2>Schedule new crawl in {this.state.data.project}</h2>
                        <Label >spider:</Label>
                        <InputGroup>
                            <Input type="select" onChange={(e) => { this.updateData("spider", e.target.value) }} >
                                {this.state.spiders.map(
                                    (spider) => { return (<option key={spider} value={spider}>{spider}</option>) }
                                )}
                            </Input>
                        </InputGroup>
                        <Label >version:</Label>
                        <InputGroup>
                            <Input type="select" onChange={(e) => {
                                this.updateData("_version", e.target.value)
                            }} >
                                {this.state.versions.map(
                                    (version) => { return (<option key={version} value={version}>@{version}</option>) }
                                )}
                            </Input>
                        </InputGroup>
                        <Label >job:</Label>
                        <InputGroup>
                            <Input type="select" onChange={(e) => { this.updateData("jobid", e.target.value) }} >
                                {this.state.jobs.map(
                                    (job) => { return (<option key={job.id} value={job.id}>{job.id}</option>) }
                                )}
                            </Input>
                        </InputGroup>
                        <Label>Settings</Label><Button onClick={(e) => {
                            let newSetting = this.state._setting.concat([{ key: "", value: "" }])
                            this.setState({ _setting: newSetting })
                            this.mergeSettings(newSetting)
                        }} color="link" style={{ fontWeight: 800, fontSize: 20 }}>+</Button>
                        <Row form style={{ display: '-webkit-box', width: '100%' }}>
                            <Col md={6} style={{ width: "45%" }}>
                                <Label >key</Label>
                            </Col>
                            <Col md={4} style={{ width: "45%" }}>
                                <Label for="exampleState">value</Label>
                            </Col>
                            <Col md={2} style={{ width: "10%" }}>
                            </Col>
                        </Row>
                        {this.state._setting.map((setting, index) => {
                            return <Row form key={index.toString()} style={{ display: '-webkit-box', width: '100%' }}>
                                <Col md={6} style={{ width: "45%" }}>
                                    <FormGroup>
                                        <Input type="text" onChange={(e) => { this.updateSetting(index, 'key', e.target.value) }} >
                                        </Input>
                                    </FormGroup>
                                </Col>
                                <Col md={4} style={{ width: "45%" }}>
                                    <FormGroup>
                                        <Input type="text" onChange={(e) => { this.updateSetting(index, 'value', e.target.value) }} >
                                        </Input>
                                    </FormGroup>
                                </Col>
                                <Col md={2} style={{ width: "10%" }}>
                                    <FormGroup>
                                        <Button color="danger" onClick={
                                            () => {
                                                let newSettings = this.state._setting.slice(0, index).concat(this.state._setting.slice(index + 1))
                                                this.setState({ _setting: newSettings })
                                                this.mergeSettings(newSettings)
                                            }} size="xs" >-</Button>
                                    </FormGroup>
                                </Col>
                            </Row>
                        })}
                        <Row form>
                            <Button onClick={()=>{
                                schedule(this.state.data).then((res)=>{
                                    console.log(res)
                                    window.location = "/"+this.state.data.project+"/"+this.state.data.spider+"/"+res.jobid
                                })
                            }} color="primary" >Create Job</Button>
                        </Row>
                    </Form>
                </div>
            </div>
        )
    }
}


export default Schedule;