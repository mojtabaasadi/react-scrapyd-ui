export default class ServerLogEvent extends EventSource{
    constructor(props,listener){
        super(props)
        this.onerror = (event)=>{
            if(event.eventPhase == EventSource.CLOSED){
                this.close()
            }
            console.log(event)
        }
        // this.onmessage = (e)=>{
        //     console.log(e)
        // }
        // this.onopen = (e)=>{
        //     console.log(e)
        // }
        this.addEventListener("message",listener)
    }
}