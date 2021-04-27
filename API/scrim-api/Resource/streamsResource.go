package resource

import (
	"fmt"
	"net/http"

	broadcast "bitbucket.org/scrim-api/Broadcast"
	stream "bitbucket.org/scrim-api/Stream"
	util "bitbucket.org/scrim-api/Util"
	"github.com/gin-gonic/gin"
	log "github.com/sirupsen/logrus"
)

//StreamCreateRequest api request for creating streams
type StreamCreateRequest struct {
	BroadcastID string `json:"broadcastId,omitempty"`
	APIKey      string `json:"apikey,omitempty"`
}

//GetStreamByID get broadcast given broadcast id
func GetStreamByID(ctx *gin.Context) {
	res := util.Response{}
	streamID := ctx.Query("id")
	broadcast, err := broadcast.GetBroadcastByID(streamID)
	if err != nil {
		res.Status.Message = fmt.Sprintf("No Stream found with ID: %v", streamID)
		res.Status.Error = err.Error()
		ctx.JSON(http.StatusNotFound, res)
		return
	}
	res.Status.Message = "Stream found"
	res.Data = broadcast
	ctx.JSON(http.StatusOK, res)
}

//StartStream start stream given user's apikey, will redirect to saving with stream id
func StartStream(ctx *gin.Context) {
	res := util.Response{}
	apikey := ctx.Query("name")
	stream.StopStream(apikey)
	publicStreamIDs, err := startStream(apikey)
	if err != nil || len(publicStreamIDs) < 1 {
		res.Status.Message = fmt.Sprintf("Error making stream: %v", apikey)
		res.Status.Error = err.Error()
		ctx.JSON(http.StatusBadRequest, res)
		return
	}
	stream.StartStream(apikey)
	log.Info(util.RTMPServerPath + publicStreamIDs[0])
	ctx.Redirect(http.StatusFound, util.RTMPServerPath+publicStreamIDs[0])
}

func startStream(apikey string) ([]string, error) {
	var publicStreamIDs []string
	publicStreamIDs, err := stream.GetStreams(apikey, false)
	if err != nil || len(publicStreamIDs) < 1 {
		log.Infof("No streams found with ID %v, creating new stream", apikey)
		_, err := createStream(StreamCreateRequest{APIKey: apikey})
		if err != nil {
			return publicStreamIDs, err
		}
		return stream.GetStreams(apikey, false)
	}

	return publicStreamIDs, nil
}

//StopStream stops stream given stream id
func StopStream(ctx *gin.Context) {
	res := util.Response{}
	streamID := ctx.Query("name")
	apikey, err := stream.GetApikeyByStreamID(streamID)
	if err != nil {
		res.Status.Message = fmt.Sprintf("No streams found with key: %v", apikey)
		res.Status.Error = err.Error()
		ctx.JSON(http.StatusBadRequest, res)
		return
	}
	err = stream.StopStream(apikey)
	if err != nil {
		res.Status.Message = fmt.Sprintf("Error occurred while stopping streams for apikey: %v", apikey)
		res.Status.Error = err.Error()
		ctx.JSON(http.StatusBadRequest, res)
		return
	}
	res.Status.Message = fmt.Sprintf("Active streams from your device are stopped successfully.")
	ctx.JSON(http.StatusOK, res)
}

//CreateStream create a stream with the API Key and broadcast ID
func CreateStream(ctx *gin.Context) {
	res := util.Response{}
	var request StreamCreateRequest
	err := ctx.BindJSON(&request)
	if err != nil {
		res.Status.Error = "Invalid create stream request details"
		ctx.JSON(http.StatusBadRequest, res)
		return
	}
	streamID, err := createStream(request)
	if err != nil {
		res.Status.Message = "Stream create failed."
		res.Status.Error = err.Error()
		ctx.JSON(http.StatusBadRequest, res)
		return
	}
	res.Status.Message = "Stream create succeeded."
	res.Data = streamID
	ctx.JSON(http.StatusOK, res)
}

func createStream(request StreamCreateRequest) (string, error) {
	if request.BroadcastID == "" {
		newBroadcastID, err := broadcast.CreateBroadcastByApikey(request.APIKey, "")
		if err != nil {
			log.Error("Error creating broadcast by apikey", err)
			return "", err
		}
		request.BroadcastID = newBroadcastID
	}
	return stream.CreateStream(request.APIKey, request.BroadcastID)
}
