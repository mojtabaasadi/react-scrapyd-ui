import React, { Component } from "react";
import Base from "./base"
import { HOST } from "../services/settings"
import { FilePond, File, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import { InputGroup, Input, Label } from 'reactstrap';
import { listprojects ,pickprotocol } from "../services/api"

class AddVerion extends Component {
    constructor(props) {
        super(props)
        this.state = {loading:false, is_valid: false, data: { project: "", version: "", egg: null }, files: [] }
        this.errors = { egg: "" }
        this.pond = {}
        
        listprojects().then(({ projects }) => {
            this.projects = projects
        })
    }
    upload(fieldName, file, metadata, load, error, progress, abort) {
        const formData = new FormData();
        formData.append(fieldName.split(".")[0], file, file.name);
        if (!('version' in this.state.data) || this.state.data.version === "") {
            formData.append("version", Date.now());
        } else {
            formData.append("version", this.state.data.version);
        }
        
        if (!('project' in this.state.data) || this.state.data.project === "") {
            formData.append("project", file.name);
        } else {
            formData.append("project", this.state.data.project);
        }

        const request = new XMLHttpRequest();
        request.open('POST',pickprotocol(HOST) +"/addversion.json");

        // Should call the progress method to update the progress to 100% before calling load
        // Setting computable to false switches the loading indicator to infinite mode
        request.upload.onprogress = (e) => {
            progress(e.lengthComputable, e.loaded, e.total);
        };

        request.onload = function() {
            if (request.status >= 200 && request.status < 300) {
                if( JSON.parse(request.responseText).status=="ok"){
                    window.location = "/"
                }
                load(request.responseText);
            }
            else {

                error('oh no');
            }
        };

        request.send(formData);
        this.setState({loading:true})
        // Should expose an abort method so the request can be cancelled
        return {
            abort: () => {
                // This function is entered if the user has tapped the cancel button
                request.abort();

                // Let FilePond know the request has been cancelled
                abort();
            }
        };
    }
    update(key, value) {
        this.state.data[key] = value
        if (this.state.data.egg != null) {
            this.state.data.egg.setMetadata(key, value)
        }
        if (key === "project" && this.projects.includes(value)) {
            this.setState({ error: { project: "project already exists" } })
        }
        this.setState({is_valid:this.state.data.egg != null && this.state.data.project.length > 0 && this.state.data.version.length > 0})
    }
    render() {
        let style = { color: "red", display: "grid" }
        return (
            <div>
                <Base />
                <div className="container">
                    <h2>Add Version</h2>
                    <Label >Project:</Label>
                    <span style={style}>{this.errors.project}</span>
                    <InputGroup>
                        <Input placeholder="projectname" onChange={event => this.update("project", event.target.value)} />
                    </InputGroup>
                    <Label >Version:</Label>
                    <span style={style}>{this.errors.version}</span>
                    <InputGroup>
                        <Input placeholder="version" onChange={event => this.update("version", event.target.value)} />
                    </InputGroup>
                    <Label >Egg file:</Label>
                    <span style={style}>{this.errors.egg}</span>
                    <FilePond
                        server={{url:pickprotocol(HOST) + "/addversion.json",
                        process:this.upload.bind(this),
                        }}
                        ref={ref => this.pond = ref}
                        allowMultiple={false}
                        onaddfile={
                            (error, file) => {
                                if (file.fileExtension !== "egg") {
                                    this.pond.removeFiles()
                                    this.errors.egg = "File should be .egg"
                                } else {
                                    this.errors.egg = ""
                                }
                            }
                        }
                        instantUpload={false}
                        files={this.state.files}
                        name="egg" >
                        {this.state.files.map(file => (
                            <File key={file} src={file} origin="local" />
                        ))}

                    </FilePond>
                </div>
                <div className="loading" style={{display:this.state.loading?"block":"none"}}></div>
            </div>
        )
    }
}


export default AddVerion;