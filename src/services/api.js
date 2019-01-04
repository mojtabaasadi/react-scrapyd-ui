import { Promise } from "q";
import { HOST } from "./settings";
import * as toastr from "toastr"
import "toastr/build/toastr.css"
export default class HHH {

}

export function pickprotocol(host){
    return host === "" ? host :  window.location.protocol + "//" + host
}
export function urlize(obj){
    var str = "";
    for (var key in obj) {
        if (str != "") {
            str += "&";
        }
        if(typeof(obj[key])!== undefined){
            str += key + "=" + encodeURIComponent(obj[key]);
        }
    }
    return str
}

export function mergeJobs(running, pending, finished) {
    return running.concat(pending).concat(finished)

}
function handelMessage(data) {
    if (data.status && data.status.search("error") > -1) {
        toastr["error"](data.message)
    }
}
export const daemonStatus = () => {
    return new Promise((resolve, reject) => {
        let req = fetch(pickprotocol(HOST) + '/daemonstatus.json').then(res => {
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
        let req = fetch(pickprotocol(HOST) + '/listprojects.json').then(res => {
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
        let req = fetch(pickprotocol(HOST) + '/listversions.json?project=' + project).then(res => {
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
        let req = fetch(pickprotocol(HOST) + '/listspiders.json?project=' + project).then(res => {
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

export const listjobs = (project) => {
    return new Promise((resolve, reject) => {
        let req = fetch(pickprotocol(HOST) + '/listjobs.json?project=' + project).then(res => {
            return res.json()
        }).then(data => {
            handelMessage(data)
            return resolve(data)
        }).catch((err) => {
            toastr['error']('listjobs fail')
            return reject(err)
        })
    })
}
export const jobDetail = (project,spider,job) => {
    return new Promise((resolve, reject) => {
        let req = fetch(pickprotocol(HOST) + '/jobstatus.json?' + urlize(
        {"project":project,
        spider:spider,
        job:job})
        ).then(res => {
            return res.json()
        }).then(data => {
            handelMessage(data)
            return resolve(data)
        }).catch((err) => {
            toastr['error']('jobDetail fail')
            return reject(err)
        })
    })
}

export const schedule = (form) => {
    console.log(form)
    let body = new FormData()
    for (let key in form) {
        if (form[key] !== null && typeof(form[key])) {
            body.append(key, form[key])
        }
    }
    return new Promise((resolve, reject) => {
        let req = fetch(pickprotocol(HOST) + '/schedule.json', {
            method: "POST",
            body: body
        }).then(res => {
            return res.json()
        }).then(data => {
            handelMessage(data)
            return resolve(data)
        }).catch((err) => {
            toastr['error']('schedule fail')
            return reject(err)
        })
    })
}

export const deleteVersion = (project, version) => {
    let body = new FormData()
    body.append("project", project)
    body.append("version", version)
    return new Promise((resolve, reject) => {
        let request = new XMLHttpRequest();
        request.open('POST', pickprotocol(HOST) + "/delversion.json");
        request.onload = function () {
            handelMessage(JSON.parse(request.responseText))
            if (request.status >= 200 && request.status < 300) {
                resolve(JSON.parse(request.responseText));
            }
            else {
                reject(JSON.parse(request.responseText));
            }
        }
        request.send(body);
    })
}