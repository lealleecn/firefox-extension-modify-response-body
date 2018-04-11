let injectjs = "<script>let invoiceMessageHandler=function(event){let receivedData=event.data;if(receivedData&&event.data.init&&event.data.start&&event.data.sourceData){window.receivedData=receivedData;eval(`(${receivedData.init})()`);eval(`(${receivedData.start})(receivedData.sourceData)`)}};window.addEventListener('message',invoiceMessageHandler,true);</script>";

let replaceStr = 'location.href = "about:blank";';

let listener = function (details) {
  let filter = browser.webRequest.filterResponseData(details.requestId);
  let decoder = new TextDecoder("utf-8");
  let encoder = new TextEncoder();

  filter.ondata = event => {
    let str = decoder.decode(event.data, {stream: true});
    if (str.indexOf(replaceStr) > -1){
      str = str.replace(new RegExp(replaceStr, 'g'), '');
      str = str + injectjs;
    }
    filter.write(encoder.encode(str));
    filter.disconnect();
  }

  return {};
}

browser.webRequest.onBeforeRequest.addListener(
  listener,
  { urls: ["https://inv-veri.chinatax.gov.cn/*"], types: ["main_frame", "sub_frame"]},
  ["blocking"]
);

let removeXFrameOptions = (e) => {
    e.responseHeaders = e.responseHeaders.filter(header => header.name !== 'X-Frame-Options');
    return {responseHeaders: e.responseHeaders};
}

browser.webRequest.onHeadersReceived.addListener(
    removeXFrameOptions,
    { urls: ["https://inv-veri.chinatax.gov.cn/*"], types: ["main_frame", "sub_frame"]},
    ["blocking", "responseHeaders"]
);