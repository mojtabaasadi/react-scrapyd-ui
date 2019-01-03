import React from 'react';
import {HOST,local_storage_host_key} from "../services/settings"
import { Button,InputGroup,Input, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
export default class HostModal extends React.Component{
    
    constructor(props){
        super(props)
        this.state = {host:HOST}
    }

    update(){
        const regex = /^(((([a-zA-Z]|[a-zA-Z][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z]|[A-Za-z][A-Za-z0-9\-]*[A-Za-z0-9])(:\d{0,4}|)|)|(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])(:\d{0,4}|))$/gm;
        if(regex.test(this.state.host)){
            window.localStorage.setItem(local_storage_host_key,this.state.host)
            window.location = "/"
        }
    }
    render(){
        return (
            <Modal isOpen={this.props.isOpen} toggle={()=>this.props.toggle()} className={this.props.className}>
            <ModalHeader toggle={this.props.toggle}>{this.props.title}</ModalHeader>
            <ModalBody>
              <InputGroup>
              <Input onChange={(e)=>{this.setState({host:e.target.value})}} value={this.state.host}></Input>
              </InputGroup>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={this.update.bind(this)}>Update</Button>
              <Button color="secondary" onClick={this.props.toggle}>Cancel</Button>
            </ModalFooter>
          </Modal>
        )
    }
} 