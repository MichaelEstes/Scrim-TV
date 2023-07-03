package main

import (
	"html/template"

	handleaws "bitbucket.org/scrim-api/AWS"
	handleredis "bitbucket.org/scrim-api/Redis"
	resource "bitbucket.org/scrim-api/Resource"
	handlemysql "bitbucket.org/scrim-api/SQL"
	"github.com/gin-gonic/gin"
	log "github.com/sirupsen/logrus"
)

var landingHTML = template.Must(template.New("scrim-landing").Parse(`
<!DOCTYPE html>
<html lang='en'>

<head data-cast-api-enabled="true">
  <script async defer src="https://github.com/videojs/videojs-contrib-media-sources/releases/download/v0.1.0/videojs-media-sources.js"></script>
  <script async defer src="https://github.com/videojs/videojs-contrib-hls/releases/download/v0.11.2/videojs.hls.min.js"></script>
  <link rel="icon" type="image/png" href="./favicon.ico">
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1.0, user-scalable=no">

  <style>
   @font-face {
      font-family: "Kilroy";
      font-weight: 700;
      src: url("./font/Gilroy-ExtraBold.woff") format("woff"), 
      url("./font/Gilroy-ExtraBold.ttf")  format("truetype");
    }

    @font-face {
      font-family: "Kilroy";
      font-weight: 600;
      src: url("./font/Gilroy-SemiBold.woff") format("woff"), 
      url("./font/Gilroy-SemiBold.ttf")  format("truetype");
    }

    @font-face {
      font-family: "Kilroy";
      font-weight: 400;
      src: url("./font/Gilroy-Regular.woff") format("woff"), 
      url("./font/Gilroy-Regular.ttf")  format("truetype");
    }

    body {
      margin: 0;
    }

    *,
    :after,
    :before {
      -webkit-box-sizing: inherit;
      box-sizing: inherit
    }

    html {
      -webkit-box-sizing: border-box;
      box-sizing: border-box
    }

    /*
  Player Skin Designer for Video.js
  http://videojs.com

  To customize the player skin edit 
  the CSS below. Click "details" 
  below to add comments or questions.
  This file uses some SCSS. Learn more  
  at http://sass-lang.com/guide)

  This designer can be linked to at:
  https://codepen.io/heff/pen/EarCt/left/?editors=010
*/
    .video-js {
      /* The base font size controls the size of everything, not just text.
     All dimensions use em-based sizes so that the scale along with the font size.
     Try increasing it to 15px and see what happens. */
      font-size: 10px;
      /* The main font color changes the ICON COLORS as well as the text */
      color: #fff;
    }

    /* The "Big Play Button" is the play button that shows before the video plays.
   To center it set the align values to center and middle. The typical location
   of the button is the center, but there is trend towards moving it to a corner
   where it gets out of the way of valuable content in the poster image.*/
    .vjs-default-skin .vjs-big-play-button {
      /* The font size is what makes the big play button...big. 
     All width/height values use ems, which are a multiple of the font size.
     If the .video-js font-size is 10px, then 3em equals 30px.*/
      font-size: 3em;
      /* We're using SCSS vars here because the values are used in multiple places.
     Now that font size is set, the following em values will be a multiple of the
     new font size. If the font-size is 3em (30px), then setting any of
     the following values to 3em would equal 30px. 3 * font-size. */
      /* 1.5em = 45px default */
      line-height: 2em;
      height: 2em;
      width: 2em;
      /* 0.06666em = 2px default */
      border: 0.06666em solid #fff;
      /* 0.3em = 9px default */
      border-radius: 2em;
      /* Align center */
      left: 50%;
      top: 50%;
      margin-left: -1em;
      margin-top: -1em;
    }

    /* The default color of control backgrounds is mostly black but with a little
   bit of blue so it can still be seen on all-black video frames, which are common. */
    .video-js .vjs-control-bar,
    .video-js .vjs-big-play-button,
    .video-js .vjs-menu-button .vjs-menu-content {
      /* IE8 - has no alpha support */
      background: #4A4A4A;
      /* Opacity: 1.0 = 100%, 0.0 = 0% */
      background: linear-gradient(rgba(255, 255, 255, 0), #4A4A4A);
      background-color: unset !important;
    }

    /* Slider - used for Volume bar and Progress bar */
    .video-js .vjs-slider {
      background-color: #9e9e9e;
      background-color: rgba(158, 158, 158, 0.5);
    }

    /* The slider bar color is used for the progress bar and the volume bar
   (the first two can be removed after a fix that's coming) */
    .video-js .vjs-volume-level,
    .video-js .vjs-play-progress,
    .video-js .vjs-slider-bar {
      background: #fff;
    }

    /* Progress bar that we want to hide, but still allocate element space */
    /* .vjs-progress-control {
      visibility: hidden;
    } */

    /* Time indicator
    TODO: look at LiveDisplay api for vjs */
    .vjs-remaining-time {
      visibility: hidden;
    }

    /* The main progress bar also has a bar that shows how much has been loaded. */
    .video-js .vjs-load-progress {
      /* For IE8 we'll lighten the color */
      background: #dedede;
      /* Otherwise we'll rely on stacked opacities */
      background: rgba(158, 158, 158, 0.5);
    }

    /* The load progress bar also has internal divs that represent
   smaller disconnected loaded time ranges */
    .video-js .vjs-load-progress div {
      /* For IE8 we'll lighten the color */
      background: white;
      /* Otherwise we'll rely on stacked opacities */
      background: rgba(158, 158, 158, 0.75);
    }
  </style>

  <!-- allow chromecast extention -->
  <!-- <script src="http://www.gstatic.com/cv/js/sender/v1/cast_sender.js"></script> -->
  <!-- add chromecast sdk -->
  <!-- <script src="../node_modules/video.js/dist/video.js"></script>add video.js sdk -->
  <!-- <script src="../node_modules/videojs-chromecast/dist/videojs-chromecast.js"></script>add plugin -->
</head>

<body>
  <div id="root"></div>
  <script type="text/javascript" src="./main.js?v=13"></script></body>

</html>
`))

func main() {
	handlemysql.ConnectMySQL()
	handleredis.ConnectRedis()
	handleaws.InitS3()

	port := ":5000"
	//gin.SetMode(gin.ReleaseMode)
	router := gin.Default()

	router.SetHTMLTemplate(landingHTML)

	// React App
	//router.Use(static.Serve("/", static.LocalFile("./react", true)))
	router.GET("/", func(ctx *gin.Context) {
		ctx.HTML(200, "scrim-landing", nil)
	})

	router.NoRoute(func(ctx *gin.Context) {
		ctx.HTML(200, "scrim-landing", nil)
	})

	router.GET("/sitemap", func(ctx *gin.Context) {
		ctx.Redirect(301, `https://example.com/scrim-landing/sitemap.xml`)
	})

	api := router.Group("/api")
	{
		//Trending API
		api.GET("/trending", resource.GetTrending)

		// Users api
		api.GET("/profile", resource.GetProfile)
		api.GET("/user", resource.GetUserByID)
		api.GET("/user/context", resource.GetUserContext)
		api.GET("/user/connectTo/:id", resource.ConnectUser)
		api.GET("/user/message/:id", resource.MessageUser)
		api.POST("/user/feedback", resource.PostUserFeedback)
		api.PUT("/user/update", resource.UpdateUser)
		api.POST("/user/update/image", resource.UpdateUserImage)

		// Users api
		api.GET("/users/recommended", resource.GetRecommendedUsers)
		api.GET("/users/recommended/:type", resource.GetRecommendedUsersByType)
		api.POST("/users/register", resource.RegisterUser)
		api.POST("/users/login", resource.LoginUser)
		api.GET("/users/login/forgot", resource.ForgotLogin)
		api.GET("/users/connectedTo/:id", resource.GetUsersConnectedToUser)
		api.GET("/users/connectedFrom/:id", resource.GetUsersConnectedFromUser)
		api.POST("/apikeys/create", resource.CreateApikey)

		// Broadcasts api
		api.GET("/broadcast", resource.GetBroadcastWithExtrasByID)
		api.GET("/broadcasts", resource.GetBroadcastByID)
		api.GET("/broadcasts/stop", resource.StopBroadcast)
		api.GET("/broadcasts/user", resource.GetBroadcastsByUser)
		api.POST("/broadcasts/create", resource.CreateBroadcast)
		api.POST("/broadcasts/upload", resource.UploadBroadcast)
		api.GET("/broadcasts/viewed", resource.BroadcastViewed)

		// Papers api
		api.GET("/paper", resource.GetPaperWithExtrasByID)
		api.GET("/papers", resource.GetPaperByID)
		api.GET("/papers/user", resource.GetPapersByUser)
		api.POST("/papers/create", resource.CreatePaper)

		// Projects api
		api.GET("/project", resource.GetProjectByID)
		api.GET("/projects", resource.GetTrendingProjects)
		api.GET("/projects/user", resource.GetProjectsByUser)

		// Stream API
		api.GET("/streams/start", resource.StartStream)
		api.GET("/streams/stop", resource.StopStream)
		api.POST("/streams/create", resource.CreateStream)

		// Reactions API
		api.POST("/reactions/add", resource.AddReaction)
		api.GET("/reactions", resource.GetReactionsByStream)
	}

	log.Fatal(router.Run(port))
}
