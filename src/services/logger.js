const eventRegex = /(?:\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} .*|^(:?\[(:?'|").*(?:[\s\S]*?)(:?'|")\]|\{.*(?:[\s\S]*?)\}))/gm;
const logRegex = /\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} .*/gm;
const dataRegex = /^(:?\[(:?'|").*(?:[\s\S]*?)(:?'|")\]|\{.*(?:[\s\S]*?)\})$/gm
const datetimeRegex = /datetime.datetime\(((:?\d{1,6}(:?, |)){7})\)/gm;

function makeHash(string) {
    var hash = 0, i, chr;
    if (string.length === 0) return hash;
    for (i = 0; i < string.length; i++) {
        chr = string.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash);
}
function parseDatetime(date_string) {
    let dtregex = new RegExp(datetimeRegex)
    let m;

    while ((m = dtregex.exec(date_string)) !== null) {
        date_string = date_string.slice(0, dtregex.lastIndex - m[0].length) +
            ('"' + m[1] + '"') +
            date_string.slice(dtregex.lastIndex, date_string.length)
        if (m.index === dtregex.lastIndex) {
            dtregex.lastIndex++;
        }
    }
    return date_string
}

export class LogEvent {
    regex = /(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}) \[(.*)\] (\w*):/gm;
    date = new Date()
    from = ""
    text = ""
    type = ""

    constructor(eventText) {
        this._eventText = eventText
        this.parse()
    }

    parse() {
        let matches = this.regex.exec(this._eventText)
        this.date = new Date(matches[1])
        this.from = matches[2]
        this.type = matches[3]
        this.text = this._eventText.replace(matches[0], '')
    }

}

export class DataEvent {
    isOpen = false
    constructor(string) {
        this._raw = string.split("'").join('"').replace(/\n/gm, '').replace(/"\s+"/gm, '')
        if (datetimeRegex.test(this._raw)) {
            this._raw = parseDatetime(this._raw)
        }
        this.data = JSON.parse(this._raw)

    }

}

export default class Logger {
    logEvents = []
    dataEvents = new Object()
    _iter = []

    constructor(logText) {
        this._log = logText
        this.parseLog()
        
    }

    get iter() {
        return this._iter.map((event) => {
            if (event.type === "data") {
                let ind = event.index.split("-")
                return this.dataEvents[ind[0]][parseInt(ind[1])]
            } else {
                return this.logEvents[event.index]
            }
        })
    }
    get isFinished(){
        return this.logEvents[this.logEvents.length-1].text.search(" Spider closed ") > -1
    }
    parseLog() {
        const str = this._log;
        let m;

        while ((m = eventRegex.exec(str)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (m.index === eventRegex.lastIndex) {
                eventRegex.lastIndex++;
            }
            let match = m[0]

            // The result can be accessed through the `m`-variable.
            // m.forEach((match, groupIndex) => {
            let event_type = dataRegex.test(match) && !logRegex.test(match) ? "data" : "log"
            let ind = 0
            if (event_type === "data") {
                ind = this.matchDataEvent(new DataEvent(match))
            }
            else {
                this.logEvents.push(new LogEvent(match))
                ind = this.logEvents.length - 1
            }
            this._iter.push({ type: event_type, index: ind })
        }
    }

    matchDataEvent(dataEvent) {
        let hash;
        if (Array.isArray(dataEvent.data)) {
            hash = makeHash(dataEvent.data.join("")).toString()
            this.bindDataEvent(hash, dataEvent)
        } else {
            hash = makeHash(Object.keys(dataEvent.data).join("")).toString()
            this.bindDataEvent(hash, dataEvent)
        }
        return hash + "-" + (this.dataEvents[hash].length - 1).toString()
    }

    bindDataEvent(hash, dataEvent) {
        if (this.dataEvents.hasOwnProperty(hash)) {
            this.dataEvents[hash].push(dataEvent)
        } else {
            this.dataEvents[hash] = [dataEvent]
        }
    }
}