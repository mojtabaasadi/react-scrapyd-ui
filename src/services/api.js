import { Promise } from "q";
import { HOST } from "./settings";
import * as toastr from "toastr"
import "toastr/build/toastr.css"
export default class HHH {

}
function handelMessage(data){
    if(data.status &&  data.status.search("error")>-1){
        toastr["error"](data.message)
    }
}
export const daemonStatus = () => {
    return new Promise((resolve, reject) => {
        let req = fetch(HOST + '/daemonstatus.json').then(res => {
            return res.json()
        }).then(data => {
            handelMessage(data)
            return resolve(data)
        }).catch((err) => {
            toastr['error']('daemonStatus fail')
            return reject(err)
        })
    })
}
export const listprojects = () => {
    return new Promise((resolve, reject) => {
        let req = fetch(HOST + '/listprojects.json').then(res => {
            return res.json()
        }).then(data => {
            handelMessage(data)
            return resolve(data)
        }).catch((err) => {
            toastr['error']('listprojects fail')
            return reject(err)
        })
    })
}
export const listversions = (project) => {
    return new Promise((resolve, reject) => {
        let req = fetch(HOST + '/listversions.json?project=' + project).then(res => {
            return res.json()
        }).then(data => {
            handelMessage(data)
            return resolve(data)
        }).catch((err) => {
            toastr['error']('listversions fail')
            return reject(err)
        })
    })
}
export const listspiders = (project) => {
    return new Promise((resolve, reject) => {
        let req = fetch(HOST + '/listspiders.json?project=' + project).then(res => {
            return res.json()
        }).then(data => {
            handelMessage(data)
            return resolve(data)
        }).catch((err) => {
            toastr['error']('listspiders fail')
            return reject(err)
        })
    })
}

export const deleteVersion = (project, version) => {
    let body = new FormData()
    body.append("project",project)
    body.append("version",version)
    return new Promise((resolve, reject) => {
        let req = fetch( HOST + '/delversion.json',{
            method: "POST",
            body: body,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            }
        }).then(res => {
            return res.json()
        }).then(data => {
            handelMessage(data)
            return resolve(data)
        }).catch((err) => {
            toastr['error']('listspiders fail')
            return reject(err)
        })
    })
}