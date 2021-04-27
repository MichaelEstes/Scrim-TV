package resource

import (
	"fmt"
	"net/http"

	project "bitbucket.org/scrim-api/Project"
	user "bitbucket.org/scrim-api/Users"
	util "bitbucket.org/scrim-api/Util"
	"github.com/gin-gonic/gin"
)

//GetProjectByID get project given project id
func GetProjectByID(ctx *gin.Context) {
	res := util.Response{}
	projectID := ctx.Query("id")
	userContext, err := user.GetUserContext(ctx)
	project, err := project.GetProjectByID(projectID, userContext.ID)
	if err != nil {
		res.Status.Message = fmt.Sprintf("No project found with ID: %v", projectID)
		res.Status.Error = err.Error()
	} else {
		res.Status.Message = "Project found"
		res.Data = project
	}
	ctx.JSON(http.StatusOK, res)
}

//GetProjectsByUser get projects by user
func GetProjectsByUser(ctx *gin.Context) {
	res := util.Response{}
	userID := ctx.Query("userId")
	userProjects, err := project.GetProjectsByUser(userID)
	if err != nil {
		res.Status.Message = "Projects could not be found due to error."
		res.Status.Error = err.Error()
		ctx.JSON(http.StatusInternalServerError, err)
		return
	}
	res.Status.Message = "Projects found for User " + userID
	res.Data = userProjects
	ctx.JSON(http.StatusOK, res)
}
