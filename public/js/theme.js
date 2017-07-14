(function(sapphire) {
    window.onload = function(e) {
        //todo: save selected theme as a cookie and then apply color
        $("#default-theme").find("img").css("filter", "none");
    }

    $("#theme a").click(function() {
        remove_icon_color();
        $(this).find("img").css("filter", "none"); // get the old image, and then use curr img
        console.log($("body").css("background-image"));
        $(this).find("img").toggleClass("transparent"); // make old image transparent..
    });

    $("#fire-theme").click(function() { 
        $("body").css("background", "url(\"../img/firewallpaper.png\") no-repeat");
        $("body").css("background-size", "cover");
        $("#header-content a svg path").css("fill", "#ea6f00");
        $("body").css("transition", "opacity 1s ease-in-out");
        $("body").css("-moz-transition", "opacity 1s ease-in-out");
    });

    $("#leaf-theme").click(function() {
        $("body").css("background", "url(\"../img/leafwallpaper.jpg\") no-repeat");
        $("body").css("background-size", "cover");
        $("#header-content a svg path").css("fill", "#446b49");
    });

    $("#default-theme").click(function() {
        $("body").css("background", "url(\"../img/backgroundtwo.jpg\") no-repeat");
        $("body").css("background-size", "cover");
        $("#header-content a svg path").css("fill", "#31bedf");
        
    });

    $("#thresh-theme").click(function() {
        $("body").css("background", "url(\"../img/threshpape.jpg\") no-repeat");
        $("body").css("background-size", "cover");
        $("#header-content a svg path").css("fill", "#3eb59f");
    });

    function remove_icon_color() {
        $("#theme a img").each(function() {
            $(this).css("filter", "grayscale(1.0)");
        });
    }

})(window.sapphire = window.sapphire || {});
