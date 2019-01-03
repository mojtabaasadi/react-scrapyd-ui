export default class ServerLogEvent extends EventSource{
    constructor(props){
        super(props)
        console.log(props)
    }
    onmessage(e){
        console.log(e)
    }
    
    onerror(event){
        if(event.eventPhase == EventSource.CLOSED){
            this.close()
        }
        console.log(event)
    }
    onopen(e){
        console.log(e)
    }
}