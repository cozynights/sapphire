let http    = require("http");
let express = require("express");
let io      = require("socket.io");

let app    = express();
let server = http.Server(app);
let socket = io(server);

app.use(express.static("public/"));
server.listen(8000, () => console.log("listening on *:8000"));

let current_video = {
	url:          "",
	current_time: 0,
	total_time:   0,
	is_playing:   false
};

function video_change(url) {
	// @todo: Get video info from YouTube
	
	// http.get("http://www.youtube.com/oembed?url=${data.link}&format=json",
	// 	response => {
	// 		let data = [];
	// 		response.on("data", chunk => data.push(chunk));

	// 		response.on("end", () => {
	// 			if (r.statusCode == 200) {
	// 				data = JSON.parse(data);
	// 				console.log(data);

	// 				let new_video = {

	// 				};

	// 				video_queue.push(new_video);
	// 			}
	// 			else {
	// 				console.error("Failed to queue video, could not retrieve video info from YouTube");
	// 			}
	// 		});
	// 	})
	// 	.end();

	current_video.url          = url;
	current_video.current_time = 0;
	current_video.total_time   = 0;

	video_play();
}

function video_play() {
	if (current_video.is_playing) {
		console.error("Failed to play video, a video is already playing");
		return;
	}

	current_video.is_playing = true;
}

function video_pause() {
	if (!current_video.is_playing) {
		console.error("Failed to pause video, a video is not playing");
		return;
	}

	current_video.is_playing = false;
}

function video_seek(time) {
	current_video.time = data.time;

	if (!current_video.is_playing) {
		current_video.is_playing = true;
	}
}

let users = [];

function find_user(id) {
	let user = null;
	for (let u of users) {
		if (u.id != client.id) continue;

		user = u;
		break;
	}

	return user;
}

socket.on("connection", client => {
	console.log("Client connected");
	
	client.emit("initialize", {
		current_video: {
			url:  current_video.url,
			time: current_video.time,
			is_playing: false
		},
		users: users
	});

	let user = {
		id: client.id,
		name: "${client.id}"
	};

	socket.emit("add-user", { user: user });
	users.push(user);

	client.on("disconnect", () => {
		console.log("Client disconnected");

		let user = find_user(client.id);
		if (!user) {
			console.error("Failed to remove user on disconnect, a user with id '${client.id}' was not found");
			return;
		}

		let index = users.indexOf(user);
		users.splice(index, 1);

		socket.emit("remove-user", { id: user.id });
	});

	client.on("set-name", data => {
		let user = find_user(client.id);
		if (!user) {
			console.error("Failed to set user's name, a user with id '${client.id}' was not found");
			return;
		}

		user.name = data.name;
	});
	
	client.on("video-change", data => video_change(data.url));
	client.on("video-play",   data => video_play());
	client.on("video-pause",  data => video_pause());
	client.on("video-seek",   data => video_seek(data.time));
});