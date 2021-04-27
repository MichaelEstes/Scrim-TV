package resource

import (
	"fmt"
	"net/http"

	paper "bitbucket.org/scrim-api/Paper"
	user "bitbucket.org/scrim-api/Users"
	util "bitbucket.org/scrim-api/Util"
	"github.com/gin-gonic/gin"
)

//GetPaperByID get paper given paper id
func GetPaperByID(ctx *gin.Context) {
	res := util.Response{}
	paperID := ctx.Query("id")
	paper, err := paper.GetPaperByID(paperID)
	if err != nil {
		res.Status.Message = fmt.Sprintf("No paper found with ID: %v", paperID)
		res.Status.Error = err.Error()
	} else {
		res.Status.Message = "Paper found"
		res.Data = paper
	}
	ctx.JSON(http.StatusOK, res)
}

//GetPaperWithExtrasByID get paper with extras
func GetPaperWithExtrasByID(ctx *gin.Context) {
	res := util.Response{}
	paperID := ctx.Query("id")
	userContext, err := user.GetUserContext(ctx)
	paper, err := paper.GetPaperWithExtrasByID(paperID, userContext.ID)
	if err != nil {
		res.Status.Message = fmt.Sprintf("No paper found with ID: %v", paperID)
		res.Status.Error = err.Error()
	} else {
		res.Status.Message = "Paper found"
		res.Data = paper
	}
	ctx.JSON(http.StatusOK, res)
}

//GetPapersByUser get papers by user
func GetPapersByUser(ctx *gin.Context) {
	res := util.Response{}
	userID := ctx.Query("userId")
	userPapers, err := paper.GetPapersByUser(userID)
	if err != nil {
		res.Status.Message = "Papers could not be found due to error."
		res.Status.Error = err.Error()
		ctx.JSON(http.StatusInternalServerError, err)
		return
	}
	res.Status.Message = "Papers found for User " + userID
	res.Data = userPapers
	ctx.JSON(http.StatusOK, res)
}

//CreatePaper create paper
func CreatePaper(ctx *gin.Context) {
	res := util.Response{}
	var request paper.Paper
	err := ctx.BindJSON(&request)
	if err != nil {
		res.Status.Error = "Invalid paper request details"
		ctx.JSON(http.StatusBadRequest, res)
		return
	}

	reqUserID, err := user.GetLoggedInUserIDFromContext(ctx)
	if reqUserID == "" || err != nil {
		res.Status.Error = "No logged in user found"
		ctx.JSON(http.StatusBadRequest, res)
		return
	}
	request.Creator.ID = reqUserID

	paperID, err := paper.CreatePaper(request)
	if err != nil {
		res.Status.Message = "Error creating broadcast"
		res.Status.Error = err.Error()
		ctx.JSON(http.StatusBadRequest, res)
		return
	}

	res.Status.Message = "Created paper successfully"
	res.Data = paperID
	ctx.JSON(http.StatusOK, res)
}
