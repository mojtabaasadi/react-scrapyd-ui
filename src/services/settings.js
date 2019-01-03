export const local_storage_host_key = "SCRAPYD_HOST"
let local_s_host = window.localStorage.getItem(local_storage_host_key)
export const HOST = local_s_host!== null?  local_s_host : (window.location.href.search("3000")>-1?"localhost:6800":"") 