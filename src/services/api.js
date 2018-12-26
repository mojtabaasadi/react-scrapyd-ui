import { Promise } from "q";
import {HOST} from "./settings";

export default class HHH{
    
}
export  const daemonStatus = () => {
    return new Promise((resolve, reject) => {
        let req = fetch(HOST+ '/daemonstatus.json').then(res => {
            console.log('daemonStatus success')
            return res.json()
        }).then(data => {
            return resolve(data)
        }).catch((err) => {
            console.log('daemonStatus fail')
            return reject(err)
        })
    })
}
export const listprojects = () => {
    return new Promise((resolve, reject) => {
        let req = fetch(HOST+ '/listprojects.json').then(res => {
            console.log('listprojects success')
            return res.json()
        }).then(data => {
            return resolve(data)
        }).catch((err) => {
            console.log('listprojects fail')
            return reject(err)
        })
    })
}
export const listversions = (project) => {
    return new Promise((resolve, reject) => {
        let req = fetch(HOST+ '/listversions.json?project='+project).then(res => {
            console.log('listversions success')
            return res.json()
        }).then(data => {
            return resolve(data)
        }).catch((err) => {
            console.log('listversions fail')
            return reject(err)
        })
    })
}
export const listspiders = (project) => {
    return new Promise((resolve, reject) => {
        let req = fetch(HOST+ '/listspiders.json?project='+project).then(res => {
            console.log('listspiders success')
            return res.json()
        }).then(data => {
            return resolve(data)
        }).catch((err) => {
            console.log('listspiders fail')
            return reject(err)
        })
    })
}