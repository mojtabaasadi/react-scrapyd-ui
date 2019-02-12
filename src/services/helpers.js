
export function logStatuses(key) {
    let obj = {
        status:"Status",
        "downloader/request_bytes":"Request Bytes",
        "downloader/request_count":"Requests Count",
        "downloader/request_method_count/GET":"Get Requests ",
        "downloader/request_method_count/POST":"Post Request",
        "downloader/response_bytes":"Response Bytes",
        "downloader/response_count":"Response Count",
        "downloader/response_status_count/200":"200 Status Code Responses",
        "downloader/response_status_count/302":"302 Status Code Responses",
        "dupefilter/filtered":"Duplicates",
        "finish_reason":"Finish Reason",
        "finish_time":"Finish Time",
        "item_scraped_count":"Item Scraped Count",
        "log_count/DEBUG":"Debug Logs",
        "log_count/INFO":"Info Logs",
        "request_depth_max":"Request Depth Max",
        "response_received_count":"Response Received Count",
        "scheduler/dequeued":"Dequeued",
        "scheduler/dequeued/memory":"Dequeued Memory",
        "scheduler/enqueued":"Scheduler Enqueued",
        "scheduler/enqueued/memory":"Scheduler Enqueued Memory",
        "start_time":"Start Time",
        "memusage/max" :"Memory Usage(peak)",
        "memusage/startup" :"Memory Usage(startup)",
    }
    return obj[key] !== undefined ? obj[key] : key
}