export default function send(request) {
	var xhr = new XMLHttpRequest();
	xhr.open(request.method, request.url, request.async || true);

	if (request.json === true) {
		xhr.setRequestHeader("Content-type", "application/json");
	}
	for (var header in request.headers) {
		xhr.setRequestHeader(header, request.headers[header]);
	}

	function callback(result) {
		var bare_headers = xhr.getAllResponseHeaders().split("\r\n");
		var cur_headers = {}, splitter;
		for (var x in bare_headers) {
			splitter = bare_headers[x].indexOf(":");
			if (splitter === -1) { continue; }
			cur_headers[bare_headers[x].substring(0, splitter).trim().toLowerCase()] = bare_headers[x].substring(splitter + 1).trim();
		}
		window.postMessage({
			response: {
				status: xhr.status,
				responseText: xhr.response,
				headers: cur_headers
			},
			timestamp: "xkit_" + request.timestamp,
			success: result
		}, window.location.protocol + "//" + window.location.host);
	}

	xhr.onerror = function() { callback(false); };
	xhr.onload = function() { callback(true); };

	if (typeof request.data !== "undefined") {
		xhr.send(request.data);
	} else {
		xhr.send();
	}
}
