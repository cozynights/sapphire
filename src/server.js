var http = require("http");
var express = require("express");
var app = express();
var server = http.Server(app);
var io = require("socket.io");
var socket = io(server);
var connected_count = 0;

socket.on("connection", function(c) {
	connected_count++;
	console.log("Client connected. Active sockets: " + connected_count);

	c.on("disconnect", function() {
		connected_count--;
		console.log("Client disconnected. Active sockets: " + connected_count);
	});

	c.on("video-cursor-changed", function(data) {
		c.emit("change-video-position", {  });
	});

	c.on("should-play-video", function(data) {
		console.log("should-play-the-vidya");
		c.broadcast.emit("play-video", { time: data.time }); 

	});

	c.on("should-load-video", function(data) {
		http.get("http://www.youtube.com/oembed?url=" + data.link + "&format=json",
				r => {
					var data = [];
					r.on("data", chunk => data.push(chunk));

					r.on("end", () => {
						if (r.statusCode == 200) {
							data = JSON.parse(data);
							console.log(data);
							socket.emit("load-video", { 
								video_id: data.html.substring(68, 79), 
								time:     0,
								quality:  "default"
							});
							console.log("Emitted from socket");
						}
						else {
							console.error("Failed to retrieve video data, the api returned a status code of '" + r.statusCode + "'");
						}
					});
				})
				.end();

		//todo(Matt): Store queued videos and then broadcast to any clients that join the room
		// get the video ID from the returned data
		// possibly use the html to just inject it in

	});

	c.on("should-queue-video", function(data) {
		c.broadcast.emit("queue-video", { 
			video_id: data.video_id, 
			time:     data.time,
			quality:  data.quality
		});
	});

	c.on("should-pause-video", function(data) {
		c.broadcast.emit("pause-video", { time: data.time });
	});
});


app.use(express.static("public/"));

server.listen(8000, function() {
	console.log('listening on *:8000');
});

server.on("error", function(error) {
	console.log(error);
});