(function(sapphire) {
    var socket = io();
    
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    console.log("Created and added script..");

    var player;
    function onYouTubeIframeAPIReady() {
        console.log("Youtube iframe API is ready..");
        player = new YT.Player('player', {
            height: '390',
            width: '640',
            videoId: 'fOy1esPEc08', // greafer
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange,
                'onPlaybackRateChange': onPlaybackRateChange,
                'onError': onError
            }
        }); 
    }

    function onPlayerReady(event) {
        display_video_name();
        //eventually move to a changevideo (and rename to ~ set title..)
        console.log("Player is ready..");
        player.seekTo(0);
        player.mute();
    }

    function onPlayerStateChange(event) {
        // console.log("State has changed, event:");
        var state_string = "";
        switch (event.data) {
            case -1: state_string = "Unstarted"; break;
            case 0: state_string = "Ended"; break;
            case 1: state_string = "Playing"; break;
            case 2: state_string = "Paused"; break;
            case 3: state_string = "Buffering"; break;
            case 5: state_string = "Video cued"; break;
            default: state_string = "Default case reached in event.data switch..";
        }

        $(".state").text(state_string);

        if (event.data == YT.PlayerState.PLAYING) {
            var time = player.getDuration();
            // socket.emit("should-play-video", { time: time });

            // check time to see if it's within 500 milliseconds
        }

        if (event.data == YT.PlayerState.BUFFERING) {
            // all clients wait for everyone to finish buffering
        }

        if (event.data == YT.PlayerState.PAUSED) { 
            //state changes to paused when scrubbing through a video or jumping forward...
            var time = player.getCurrentTime();
            socket.emit("should-pause-video", { time: time });
        }

        if (event.data == YT.PlayerState.ENDED) {
            //play next video, wait for all clients to buffer the video in order to start playing it
        }

        if (event.data == YT.PlayerState.CUED) {
            // not really sure what to do here..
        }

        if (event.data == YT.PlayerState.UNSTARTED) {
            // or here..
        }
    }

    socket.on("play-video", function(data) {
        console.log("Client has been told to play the video at " + data.time);
        console.log("play-video called, seeking to " + data.time + " seconds..");
        player.seekTo(data.time);
    });

    function stopVideo() {
        console.log("Stopping video...");
        player.stopVideo();
    }

    function pauseVideo() {
        console.log("Pausing video..");
        player.pauseVideo();
    }

    function on_video_cursor_change() {
        socket.emit("video-cursor-changed", {  });
    }

    socket.on("change-video-position", function(data) {
        console.log(data);
        player.seekTo(60);
        player.playVideo();
    });

    //handle playback rate (video speed) at some time in the future
    function onPlaybackRateChange() {

    }

    function onError(error) { 
        console.error(error);

        // 2 – The request contains an invalid parameter value. For example, this error occurs if you specify a video ID that does not have 11 characters, or if the video ID contains invalid characters, such as exclamation points or asterisks.
        // 5 – The requested content cannot be played in an HTML5 player or another error related to the HTML5 player has occurred.
        // 100 – The video requested was not found. This error occurs when a video has been removed (for any reason) or has been marked as private.
        // 101 – The owner of the requested video does not allow it to be played in embedded players.
        // 150 – This error is the same as 101. It's just a 101 error in disguise!        
    }

    function change_video_position() {

    }

    function display_video_name() {
        var video_data = player.getVideoData();
        document.getElementsByClassName("song-title").textContent = video_data.title;
        $(".song-title").text(video_data.title);
    }

    socket.on("load-video", function(data) {
        display_video_name();
        console.log("Client loading video with id: " + data.video_id);
        player.loadVideoById(data.video_id, data.time, data.quality);

        $("<span>Client loaded " + video_id + "... </span>").appendTo($("#queue-display"));
    });

    socket.on("queue-video", function(data) {
        console.log("Client queueing video with id: " + data.video_id);
        player.cueVideoById(data.video_id, data.time, data.quality);

        $("<span>Client queued " + video_id + "... </span>").appendTo($("#queue-display"));
    });

    socket.on("pause-video", function(data) {
        console.log("Client received handshake from socket to pause video and seek to " + data.time);
        player.seekTo(data.time);
        player.pauseVideo();
    });

    $("#play").click(function() {
        console.log("Client clicked play video, url is read as " + $("#youtube-search").val());
        socket.emit("should-load-video", {
            link: $("#youtube-search").val()
        });
    });

    $("#queue").click(function() {
        socket.emit("should-queue-video", {
            link: $("#youtube-search").val()
        });
    });

    //todo(Matt);

    // window.onload = function(e) {
    //     setTimeout(function() { // h a c k  f r a u d
    //         onYouTubeIframeAPIReady();
    //     }, 500);
    // }

    $(document).ready(function() {
        setTimeout(function() { // h a c k  f r a u d
            onYouTubeIframeAPIReady();
        }, 2000);
    });
})(window.sapphire = window.sapphire || {});