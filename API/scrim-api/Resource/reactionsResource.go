package resource

import (
	"net/http"

	stream "bitbucket.org/scrim-api/Stream"
	util "bitbucket.org/scrim-api/Util"
	"github.com/gin-gonic/gin"
)

//AddReaction add reaction to stream from user
func AddReaction(ctx *gin.Context) {
	res := util.Response{}
	var request stream.Reaction
	err := ctx.BindJSON(&request)
	if err != nil {
		res.Status.Error = "Invalid reaction request details"
		ctx.JSON(http.StatusBadRequest, res)
		return
	}

	reactionID, err := stream.AddReaction(request)
	if err != nil {
		res.Status.Message = "Error creating reaction"
		res.Status.Error = err.Error()
		ctx.JSON(http.StatusBadRequest, res)
		return
	}

	res.Status.Message = "Created reaction successfully"
	res.Data = reactionID
	ctx.JSON(http.StatusOK, res)
}

//GetReactionsByStream get all the reactions associated with a stream
func GetReactionsByStream(ctx *gin.Context) {
	res := util.Response{}
	streamID := ctx.Query("streamId")

	reactions, err := stream.GetReactionsByStream(streamID)
	if err != nil {
		res.Status.Message = "Broadcasts could not be found due to error."
		res.Status.Error = err.Error()
		ctx.JSON(http.StatusBadRequest, err)
		return
	}
	res.Status.Message = "Reactions found for Stream " + streamID
	res.Data = reactions
	ctx.JSON(http.StatusOK, res)
}
