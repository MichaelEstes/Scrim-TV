package resource

import (
	"fmt"
	"net/http"

	handleaws "bitbucket.org/scrim-api/AWS"
	broadcast "bitbucket.org/scrim-api/Broadcast"
	paper "bitbucket.org/scrim-api/Paper"
	user "bitbucket.org/scrim-api/Users"
	util "bitbucket.org/scrim-api/Util"
	"github.com/gin-gonic/gin"
)

//GetRecommendedUsers get users for the connect screen
func GetRecommendedUsers(ctx *gin.Context) {
	res := util.Response{}
	var recommended []user.RecommendedUsersResponse

	reqUserID, err := user.GetLoggedInUserIDFromContext(ctx)
	if reqUserID != "" {
		userConnections, err := user.GetUsersConnections(reqUserID)
		if err == nil {
			recommended = append(recommended, userConnections)
		}
	}

	recommendedUsers, err := user.GetRecommendedUsers()
	if err != nil {
		res.Status.Error = err
		ctx.JSON(http.StatusInternalServerError, res)
		return
	}

	recommended = append(recommended, recommendedUsers...)
	res.Status.Message = "Retrieved recommended users successfully"
	res.Data = recommended
	ctx.JSON(http.StatusOK, res)
}

//GetRecommendedUsersByType get recommended users of a certain type
func GetRecommendedUsersByType(ctx *gin.Context) {
	res := util.Response{}
	userType := ctx.Param("type")
	page := ctx.Query("page")
	if !user.IsValidUserType(userType) {
		res.Status.Error = "No valid user type"
		ctx.JSON(http.StatusBadRequest, res)
		return
	}
	reqUserID, _ := user.GetLoggedInUserIDFromContext(ctx)

	if page != "" {
		recommended, err := user.GetRecommendedUsersByTypePaginated(userType, page, reqUserID)
		if err != nil {
			res.Status.Error = err
			ctx.JSON(http.StatusInternalServerError, res)
			return
		}
		res.Status.Message = "Retrieved recommended users successfully"
		res.Data = recommended
	} else {
		recommended, err := user.GetRecommendedUsersByType(userType, reqUserID)
		if err != nil {
			res.Status.Error = err
			ctx.JSON(http.StatusInternalServerError, res)
			return
		}
		res.Status.Message = "Retrieved recommended users successfully"
		res.Data = recommended
	}

	ctx.JSON(http.StatusOK, res)
}

//GetUserContext Return whether or not the user is logged in
func GetUserContext(ctx *gin.Context) {
	res := util.Response{}
	userContext, err := user.GetUserContext(ctx)
	if err != nil {
		res.Status.Error = err
		ctx.JSON(http.StatusOK, res)
		return
	}

	if userContext.ID == "" {
		res.Status.Message = "No user context found"
	} else {
		res.Status.Message = "Found user context"
		res.Data = userContext
	}

	ctx.JSON(http.StatusOK, res)
}

// GetProfile returns logged in user's profile
func GetProfile(ctx *gin.Context) {
	res := util.Response{}

	userID, err := user.GetUserIDFromContext(ctx)
	if userID == "" || err != nil {
		res.Status.Error = "No user ID in request"
		ctx.JSON(http.StatusBadRequest, res)
		return
	}

	user := user.GetUserProfile(userID)
	if user.ID != "" {
		res.Status.Message = "User found"
		res.Data = user
	} else {
		res.Status.Message = "No user found with ID"
	}

	ctx.JSON(http.StatusOK, res)
}

// GetUserByID returns User information by id
func GetUserByID(ctx *gin.Context) {
	res := util.Response{}
	userID := ctx.Query("id")
	if userID == "" {
		res.Status.Error = "No user ID in request"
		ctx.JSON(http.StatusBadRequest, res)
		return
	}

	reqUserID, err := user.GetUserIDFromContext(ctx)
	if err != nil {
		res.Status.Error = "No user ID in request"
		ctx.JSON(http.StatusBadRequest, res)
		return
	}

	user := user.GetUserByID(userID, reqUserID)

	getUserReel(userID, &user)

	if user.ID != "" {
		res.Status.Message = "User found"
		res.Data = user
	} else {
		res.Status.Message = "No user found with ID"
	}

	ctx.JSON(http.StatusOK, res)
}

func getUserReel(userID string, outUser *user.User) {
	papers, _ := paper.GetPapersByUser(userID)
	broadcasts, _ := broadcast.GetBroadcastsByUser(userID, false)
	outUser.Reel.Broadcasts = broadcasts
	outUser.Reel.Papers = papers
}

//ConnectUser connect a logged in user to another user
func ConnectUser(ctx *gin.Context) {
	res := util.Response{}
	userID := ctx.Param("id")
	if userID == "" {
		res.Status.Error = "No user ID in request"
		ctx.JSON(http.StatusBadRequest, res)
		return
	}

	reqUserID, err := user.GetLoggedInUserIDFromContext(ctx)
	if reqUserID == "" || err != nil {
		res.Status.Error = "No logged in user found"
		ctx.JSON(http.StatusBadRequest, res)
		return
	}

	if userID == reqUserID {
		res.Status.Error = "Can't connect with yourself"
		ctx.JSON(http.StatusBadRequest, res)
		return
	}

	err = user.InsertUserConnection(userID, reqUserID)
	if err != nil {
		res.Status.Error = err
		ctx.JSON(http.StatusInternalServerError, res)
		return
	}

	res.Status.Message = "Sucessfully connected users"
	ctx.JSON(http.StatusOK, res)
}

//MessageUser get the mailto address for a user
func MessageUser(ctx *gin.Context) {
	res := util.Response{}
	userID := ctx.Param("id")
	if userID == "" {
		res.Status.Error = "No user ID in request"
		ctx.JSON(http.StatusBadRequest, res)
		return
	}

	reqUserID, err := user.GetLoggedInUserIDFromContext(ctx)
	if reqUserID == "" || err != nil {
		res.Status.Error = "No logged in user found"
		ctx.JSON(http.StatusBadRequest, res)
		return
	}

	if userID == reqUserID {
		res.Status.Error = "Can't message yourself"
		ctx.JSON(http.StatusBadRequest, res)
		return
	}

	toEmail := user.GetUserEmail(userID)
	if toEmail == "" {
		res.Status.Error = "Error getting emails"
		ctx.JSON(http.StatusBadRequest, res)
		return
	}

	res.Status.Message = "Sucessfully connected users"
	res.Data = fmt.Sprintf(`mailto:%v?&subject=%v`, toEmail, "Message from Scrim")
	ctx.JSON(http.StatusOK, res)
}

// UpdateUser updates user with new field values
func UpdateUser(ctx *gin.Context) {
	res := util.Response{}
	var request user.User
	if ctx.BindJSON(&request) != nil {
		res.Status.Error = "Invalid update details"
		ctx.JSON(http.StatusBadRequest, res)
		return
	}
	userContext, err := user.GetUserContext(ctx)
	if err != nil {
		res.Status.Error = err
		ctx.JSON(http.StatusOK, res)
		return
	}

	request.ID = userContext.ID
	err = user.UpdateUser(request)
	if err != nil {
		res.Status.Message = "Error updating some or all user fields"
		res.Status.Error = err
	} else {
		res.Status.Message = "Updated user successfully"
	}

	ctx.JSON(http.StatusOK, res)
}

// UpdateUserImage updates user with new profile image
func UpdateUserImage(ctx *gin.Context) {
	res := util.Response{}
	userContext, err := user.GetUserContext(ctx)
	if err != nil || userContext.ID == "" {
		res.Status.Error = err
		ctx.JSON(http.StatusOK, res)
		return
	}
	file, header, err := ctx.Request.FormFile("image")
	defer file.Close()
	if err != nil {
		res.Status.Error = err
		ctx.JSON(http.StatusBadRequest, res)
		return
	}

	userID := userContext.ID
	ext := util.GetFileExt(header)
	filename := fmt.Sprintf("%v.%v", userID, ext)

	image, err := util.ResizeImage(file, ext)
	if err != nil {
		res.Status.Error = err
		ctx.JSON(http.StatusInternalServerError, res)
		return
	}

	location, err := handleaws.UploadProfilePictureToS3(filename, image)
	if err != nil {
		res.Status.Error = err
		ctx.JSON(http.StatusInternalServerError, res)
		return
	}

	err = user.UpdateUserProfileImage(userID, location)
	if err != nil {
		res.Status.Error = err
	} else {
		res.Status.Message = "Successfully uploaded new profile image"
		res.Data = location
	}
	ctx.JSON(http.StatusOK, res)
}

// RegisterUser registers user with register request validation
func RegisterUser(ctx *gin.Context) {
	res := util.Response{}
	var request user.User
	if ctx.BindJSON(&request) != nil {
		res.Status.Error = "Invalid registration details"
		ctx.JSON(http.StatusBadRequest, res)
		return
	}
	if request.Email != "" {
		if request.Password == "" {
			res.Status.Error = "Please enter a valid password"
			ctx.JSON(http.StatusBadRequest, res)
			return
		}
		if request.DisplayName == "" {
			res.Status.Error = "An email registration must require a password."
			ctx.JSON(http.StatusBadRequest, res)
			return
		}

		uniqueEmail := user.UniqueEmail(request.Email)
		if !uniqueEmail {
			res.Status.Error = "This email has already been used. Please use a different one."
			ctx.JSON(http.StatusBadRequest, res)
			return
		}

		uniqueDisplayName := user.UniqueDisplayName(request.DisplayName)
		if !uniqueDisplayName {
			res.Status.Error = "This display name has already been used. Please use a different one."
			ctx.JSON(http.StatusBadRequest, res)
			return
		}
	} else {
		// else if request.Phone == "" {
		res.Status.Error = "Please enter a valid email to complete registration."
		ctx.JSON(http.StatusBadRequest, res)
		return
	}

	userID, err := user.RegisterUser(request)
	if err != nil {
		res.Status.Error = "Error occurred when creating your account. Please try again."
		ctx.JSON(http.StatusBadRequest, res)
		return
	}

	user.CreateUserContextCookie(ctx, user.User{ID: userID})
	res.Status.Message = "Registered user successfully"
	res.Data = userID
	ctx.JSON(http.StatusOK, res)
}

// LoginUser logs in user
func LoginUser(ctx *gin.Context) {
	res := util.Response{}
	var request user.LoginRequest
	if ctx.BindJSON(&request) != nil {
		res.Status.Error = "Invalid registration details"
		ctx.JSON(http.StatusBadRequest, res)
		return
	}

	loggedInUser, loginSuccessful := user.Login(request)

	if loginSuccessful {
		user.CreateUserContextCookie(ctx, loggedInUser)
		res.Data = loggedInUser.ID
		res.Status.Message = "User login successful"
		ctx.JSON(http.StatusOK, res)
	} else {
		res.Status.Message = "User login failed. Please try again."
		ctx.JSON(http.StatusBadRequest, res)
	}
}

// ForgotLogin request to send forgot login email, email integration has not been done yet
func ForgotLogin(ctx *gin.Context) {
	res := util.Response{}
	email := ctx.Query("email")
	exists := !user.UniqueEmail(email)

	res.Data = struct {
		Exists bool `json:"exists"`
	}{exists}

	if exists {
		res.Status.Message = "Recovery email sent to user's email."
		ctx.JSON(http.StatusOK, res)
	} else {
		res.Status.Message = "Email address is not associated with a user."
		ctx.JSON(http.StatusOK, res)
	}
}

// GetUsersConnectedToUser see whos connected to a user
func GetUsersConnectedToUser(ctx *gin.Context) {
	res := util.Response{}
	userID := ctx.Param("id")
	ids := user.GetUserConnectionsTo(userID)
	idsLen := len(ids)

	if idsLen == 0 {
		res.Status.Message = "No Users found"
	} else {
		res.Status.Message = fmt.Sprintf("Found %v Users", idsLen)
		res.Data = ids
	}

	ctx.JSON(http.StatusOK, res)
}

// GetUsersConnectedFromUser see who a user has connected with
func GetUsersConnectedFromUser(ctx *gin.Context) {
	res := util.Response{}
	userID := ctx.Param("id")
	ids := user.GetUserConnectionFrom(userID)
	idsLen := len(ids)
	if idsLen == 0 {
		res.Status.Message = "No Users found"
	} else {
		res.Status.Message = fmt.Sprintf("Found %v Users", idsLen)
		res.Data = ids
	}

	ctx.JSON(http.StatusOK, res)
}

//CreateApikey create an apikey
func CreateApikey(ctx *gin.Context) {
	res := util.Response{}
	var request user.APIKey
	if ctx.BindJSON(&request) != nil {
		res.Status.Error = "Invalid apikey details"
		ctx.JSON(http.StatusBadRequest, res)
		return
	}

	apikey, err := user.CreateApikey(request)
	if err != nil {
		res.Status.Error = "Apikey create operation failed"
		ctx.JSON(http.StatusBadRequest, res)
		return
	}

	res.Status.Message = "Apikey created successfully"
	res.Data = apikey
	ctx.JSON(http.StatusOK, res)
}

//FeedbackRequest post feedback request body
type FeedbackRequest struct {
	Feedback string `json:"feedback"`
}

//PostUserFeedback insert userfeedback into databack
func PostUserFeedback(ctx *gin.Context) {
	res := util.Response{}
	var request FeedbackRequest
	if ctx.BindJSON(&request) != nil {
		res.Status.Error = "Error parsing feedback"
		ctx.JSON(http.StatusBadRequest, res)
		return
	}
	userContext, err := user.GetUserContext(ctx)
	if err != nil {
		res.Status.Error = err
		ctx.JSON(http.StatusOK, res)
		return
	}

	err = user.InsertFeedback(userContext.ID, request.Feedback)

	if err != nil {
		res.Status.Error = err
		res.Status.Message = "Error inserting feedback"
		ctx.JSON(http.StatusOK, res)
		return
	}

	res.Status.Message = "User feedback recieved"
	ctx.JSON(http.StatusOK, res)
}
