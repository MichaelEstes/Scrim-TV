package resource

import (
	"fmt"
	"net/http"
	"strings"

	handleaws "bitbucket.org/scrim-api/AWS"
	broadcast "bitbucket.org/scrim-api/Broadcast"
	stream "bitbucket.org/scrim-api/Stream"
	user "bitbucket.org/scrim-api/Users"
	util "bitbucket.org/scrim-api/Util"
	"github.com/gin-gonic/gin"
)

//GetBroadcastByID get broadcast given broadcast id
func GetBroadcastByID(ctx *gin.Context) {
	res := util.Response{}
	broadcastID := ctx.Query("id")
	broadcast, err := broadcast.GetBroadcastByID(broadcastID)
	if err != nil {
		res.Status.Message = fmt.Sprintf("No broadcast found with ID: %v", broadcastID)
		res.Status.Error = err.Error()
	} else {
		res.Status.Message = "Broadcast found"
		res.Data = broadcast
	}
	ctx.JSON(http.StatusOK, res)
}

//GetBroadcastWithExtrasByID get broadcast for stream page given broadcast id
func GetBroadcastWithExtrasByID(ctx *gin.Context) {
	res := util.Response{}
	broadcastID := ctx.Query("id")
	userContext, err := user.GetUserContext(ctx)
	broadcast, err := broadcast.GetBroadcastWithExtrasByID(broadcastID, userContext.ID)
	if err != nil {
		res.Status.Message = fmt.Sprintf("No broadcast found with ID: %v", broadcastID)
		res.Status.Error = err.Error()
	} else {
		res.Status.Message = "Broadcast found"
		res.Data = broadcast
	}
	ctx.JSON(http.StatusOK, res)
}

//GetBroadcastsByUser get broadcasts by user
func GetBroadcastsByUser(ctx *gin.Context) {
	res := util.Response{}
	var live bool
	userID := ctx.Query("userId")
	liveString := ctx.Query("live")
	if liveString == "" || strings.ToLower(liveString) == "true" {
		live = true
	} else {
		live = false
	}
	userBroadcasts, err := broadcast.GetBroadcastsByUser(userID, live)
	if err != nil {
		res.Status.Message = "Broadcasts could not be found due to error."
		res.Status.Error = err.Error()
		ctx.JSON(http.StatusBadRequest, err)
		return
	}
	res.Status.Message = "Broadcasts found for User " + userID
	res.Data = userBroadcasts
	ctx.JSON(http.StatusOK, res)
}

//StopBroadcast stop broadcast
func StopBroadcast(ctx *gin.Context) {
	res := util.Response{}
	apiKey := ctx.Query("name")

	if apiKey == "" {
		res.Status.Message = "Missing name query param"
		ctx.JSON(http.StatusBadRequest, res)
		return
	}

	err := broadcast.StopBroadcast(apiKey)
	if err != nil {
		res.Status.Message = "Error stopping broadcast"
		res.Status.Error = err.Error()
		ctx.JSON(http.StatusBadRequest, res)
		return
	}

	res.Status.Message = "Stopped broadcast successfully"
	ctx.JSON(http.StatusOK, res)
}

//CreateBroadcast create broadcast
func CreateBroadcast(ctx *gin.Context) {
	res := util.Response{}
	var request broadcast.Broadcast
	err := ctx.BindJSON(&request)
	if err != nil {
		res.Status.Error = "Invalid broadcast request details"
		ctx.JSON(http.StatusBadRequest, res)
		return
	}

	reqUserID, err := user.GetLoggedInUserIDFromContext(ctx)
	if reqUserID == "" || err != nil {
		res.Status.Error = "No logged in user found"
		ctx.JSON(http.StatusBadRequest, res)
		return
	}
	request.Broadcaster.ID = reqUserID

	broadcastID, err := broadcast.CreateBroadcast(request)
	if err != nil {
		res.Status.Message = "Error creating broadcast"
		res.Status.Error = err.Error()
		ctx.JSON(http.StatusBadRequest, res)
		return
	}

	res.Status.Message = "Created broadcast successfully"
	res.Data = broadcastID
	ctx.JSON(http.StatusOK, res)
}

//UploadBroadcast upload broadcast video
func UploadBroadcast(ctx *gin.Context) {
	res := util.Response{}

	broadcastID := ctx.Query("id")
	if broadcastID == "" {
		res.Status.Error = "No broadcast id found to upload"
		ctx.JSON(http.StatusBadRequest, res)
		return
	}

	reqUserID, err := user.GetLoggedInUserIDFromContext(ctx)
	if err != nil || reqUserID == "" {
		res.Status.Error = err
		ctx.JSON(http.StatusBadRequest, res)
		return
	}

	streamID, err := stream.GetStreamID(reqUserID, broadcastID)
	if err != nil || streamID == "" {
		res.Status.Error = "No stream found for broadcast that belongs to user"
		ctx.JSON(http.StatusUnauthorized, res)
		return
	}

	err = uploadThumbnail(ctx, broadcastID)
	if err != nil {
		res.Status.Error = err
		ctx.JSON(http.StatusBadRequest, res)
		return
	}

	file, header, err := ctx.Request.FormFile("video")
	defer file.Close()
	if err != nil {
		res.Status.Error = err
		ctx.JSON(http.StatusBadRequest, res)
		return
	}

	ext := util.GetFileExt(header)
	filename := fmt.Sprintf("%v.%v", streamID, ext)

	go handleaws.UploadVideoToS3(filename, file)
	res.Status.Message = "Video upload started"
	ctx.JSON(http.StatusOK, res)
}

func uploadThumbnail(ctx *gin.Context, broadcastID string) error {
	thumbnail, header, err := ctx.Request.FormFile("thumbnail")
	defer thumbnail.Close()
	if err != nil {
		return err
	}

	ext := util.GetFileExt(header)
	filename := fmt.Sprintf("%v.%v", broadcastID, ext)

	image, err := util.ResizeImage(thumbnail, ext)
	if err != nil {
		return err
	}

	location, err := handleaws.UploadThumbnailToS3(filename, image)
	if err != nil {
		return err
	}

	return broadcast.UpdateBroadcastThumbnail(broadcastID, location)
}

//BroadcastViewed update broadcast view count
func BroadcastViewed(ctx *gin.Context) {
	res := util.Response{}
	userContext, err := user.GetUserContext(ctx)
	if err != nil {
		res.Status.Message = "No User ID found or avialable"
		res.Status.Error = "No User ID found or avialable"
		ctx.JSON(http.StatusBadRequest, res)
		return
	}

	broadcastID := ctx.Query("id")
	if broadcastID == "" {
		res.Status.Message = "No Broadcast ID"
		res.Status.Error = "Broadcast ID missing"
		ctx.JSON(http.StatusBadRequest, res)
		return
	}

	err = broadcast.BroadcastViewed(broadcastID, userContext.ID)
	if err != nil {
		res.Status.Message = "Error updating broadcast view count"
		res.Status.Error = err.Error()
		ctx.JSON(http.StatusConflict, res)
		return
	}

	res.Status.Message = "Broadcast view count updated successfully"
	res.Data = broadcastID
	ctx.JSON(http.StatusOK, res)
}
