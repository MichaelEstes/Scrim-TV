package user

import (
	"crypto/sha512"
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"net/url"
	"strconv"
	"strings"
	"time"

	handleredis "bitbucket.org/scrim-api/Redis"
	handlemysql "bitbucket.org/scrim-api/SQL"
	util "bitbucket.org/scrim-api/Util"
	"github.com/gin-gonic/gin"
	uuid "github.com/google/uuid"
	"github.com/segmentio/ksuid"
	log "github.com/sirupsen/logrus"
)

//User struct object
type User struct {
	ID             string     `json:"id,omitempty"`
	DisplayName    string     `json:"displayName,omitempty"`
	ImageURL       string     `json:"imageUrl,omitempty"`
	BannerImageURL string     `json:"bannerImageURL,omitempty"`
	FollowerCount  int64      `json:"followerCount"`
	FollowingCount int64      `json:"followingCount"`
	ViewerCount    int64      `json:"viewerCount,omitempty"`
	Tagline        string     `json:"tagline,omitempty"`
	FirstName      string     `json:"firstName,omitempty"`
	LastName       string     `json:"lastName,omitempty"`
	Phone          string     `json:"phone,omitempty"`
	Email          string     `json:"email,omitempty"`
	Password       string     `json:"password,omitempty"`
	Salt           string     `json:"salt,omitempty"`
	About          string     `json:"about,omitempty"`
	Vocations      []UserFlag `json:"vocations,omitempty"`
	Formats        []UserFlag `json:"formats,omitempty"`
	HasConnected   bool       `json:"hasConnected"`
	Following      []string   `json:"following,omitempty"`
	Temp           bool       `json:"temp,omitempty"`
	APIKeys        []APIKey   `json:"apikey,omitempty"`
	Reel           Reel       `json:"reel,omitempty"`
}

//Reel user's created content
type Reel struct {
	Broadcasts interface{} `json:"broadcasts,omitempty"`
	Papers     interface{} `json:"papers,omitempty"`
}

// RecommendedResponse response for frontend Connect page
type RecommendedUsersResponse struct {
	Name    string `json:"name"`
	SubText string `json:"subText"`
	Type    string `json:"type"`
	Users   []User `json:"users"`
}

//UserFlag type, holds the name of the flag and if the user has it set
type UserFlag struct {
	Name string `json:"name"`
	Set  bool   `json:"set"`
}

//UserContext get the user ID for interal use
type UserContext struct {
	ID   string `json:"id"`
	Temp bool   `json:"temp"`
}

// MarshalBinary -
func (uc UserContext) MarshalBinary() ([]byte, error) {
	return json.Marshal(uc)
}

// UnmarshalBinary -
func (uc UserContext) UnmarshalBinary(data []byte) error {
	if err := json.Unmarshal(data, &uc); err != nil {
		return err
	}

	return nil
}

const userCookieName = "user_id"

//Vocations
const (
	director        = "director"
	actor           = "actor"
	writer          = "writer"
	producer        = "producer"
	editor          = "editor"
	cinematographer = "cinematographer"
	animator        = "animator"
	composer        = "composer"
)

var vocations = map[string]bool{director: true, actor: true, writer: true, producer: true, editor: true, cinematographer: true, animator: true, composer: true}
var userTypeToSubtext = map[string]string{director: "They have a vision", actor: "They have the bug", writer: "They have a story", producer: "They have drive", editor: "They can put it all together", cinematographer: "They have a keen eye", animator: "They have a steady hand", composer: "They have perfect pitch"}
var userTypeToName = map[string]string{director: "Directors", actor: "Actors", writer: "Writers", producer: "Producers", editor: "Editors", cinematographer: "Cinematographers", animator: "Animators", composer: "Composers"}

const (
	connectionsName    = "Your Connections"
	connectionsSubText = "They have your heart"
	connectionsType    = "connection"
)

//Formats
const (
	movies      = "movies"
	series      = "series"
	shorts      = "shorts"
	animation   = "animation"
	vlogs       = "vlogs"
	educational = "educational"
)

var formats = map[string]bool{movies: true, series: true, shorts: true, animation: true, vlogs: true, educational: true}

const userPageLimit = 25

//GetUserIDFromContext get user ID, including temp users
func GetUserIDFromContext(ctx *gin.Context) (string, error) {
	userContext, err := GetUserContext(ctx)
	if err != nil {
		return "", err
	}

	return userContext.ID, nil
}

//GetLoggedInUserIDFromContext only get ID if user is registered
func GetLoggedInUserIDFromContext(ctx *gin.Context) (string, error) {
	userContext, err := GetUserContext(ctx)
	if err != nil {
		return "", err
	}
	if userContext.Temp {
		return "", nil
	}
	return userContext.ID, nil
}

//GetUserContext create User Context from cookie and cache
func GetUserContext(ctx *gin.Context) (UserContext, error) {
	var userContext UserContext
	cookieUserID, err := ctx.Cookie(userCookieName)
	if err != nil {
		log.Error("Error getting user ID from cookie, creating new cookie: ", err)
		cookieUserID = CreateUserContextCookie(ctx, createTempUser())
	}

	userContext = getUserContextRedis(cookieUserID)
	if userContext.ID == "" {
		cookieUserID = CreateUserContextCookie(ctx, createTempUser())
		userContext = getUserContextRedis(cookieUserID)
		if userContext.ID == "" {
			return userContext, errors.New("No matching user ID found after fall back")
		}
	}

	return userContext, nil
}

func getUserContextRedis(cookieUserID string) UserContext {
	var userContext UserContext
	client := handleredis.GetClient()
	ctxStr, err := client.Get(cookieUserID).Result()
	if err != nil {
		log.Error("Error getting user context from Redis")
		return userContext
	}

	err = json.Unmarshal([]byte(ctxStr), &userContext)
	if err != nil {
		log.Error("Error getting user context from Redis")
		return userContext
	}

	return userContext
}

//CreateUserContextCookie takes a user, generates a cookie and saves in it the cache. Returns cookie cache key
func CreateUserContextCookie(ctx *gin.Context, user User) string {
	cookieID := ksuid.New().String()
	userContext := UserContext{
		ID:   user.ID,
		Temp: user.Temp,
	}

	err := setUserContextRedis(cookieID, userContext)
	if err != nil {
		return ""
	}

	ctx.SetCookie(userCookieName, url.QueryEscape(cookieID), 3600000, "", ctx.Request.Host, false, false)
	log.Infof("Set user cookie for user ID %v with Cookie ID %v\n", user.ID, cookieID)
	return cookieID
}

func setUserContextRedis(cookieID string, userContext UserContext) error {
	client := handleredis.GetClient()
	err := client.Set(cookieID, userContext, 3600000*time.Second).Err()
	if err != nil {
		log.Error("Error setting user context in Redis", err)
	}
	return err
}

func createTempUser() User {
	return User{ID: uuid.New().String(), Temp: true}
}

const userQuery = "SELECT id, displayName, imageUrl, bannerImageUrl, followerCount, followingCount, tagline, about, director, actor, writer, producer, editor, cinematographer, animator, composer, movies, series, shorts, animation, vlogs, educational, trendingUpdated"
const profileQuery = "SELECT id, displayName, imageUrl, bannerImageUrl, followerCount, followingCount, viewerCount, tagline, about, director, actor, writer, producer, editor, cinematographer, animator, composer, movies, series, shorts, animation, vlogs, educational, trendingUpdated"

func scanUser(row *sql.Row) User {
	var user User
	var director bool
	var actor bool
	var writer bool
	var producer bool
	var editor bool
	var cinematographer bool
	var animator bool
	var composer bool
	var movies bool
	var series bool
	var shorts bool
	var animation bool
	var vlogs bool
	var educational bool
	var trendingUpdated time.Time

	err := row.Scan(&user.ID, &user.DisplayName, &user.ImageURL, &user.BannerImageURL, &user.FollowerCount, &user.FollowingCount, &user.Tagline, &user.About,
		&director, &actor, &writer, &producer, &editor, &cinematographer, &animator, &composer,
		&movies, &series, &shorts, &animation, &vlogs, &educational,
		&trendingUpdated)
	if err != nil {
		log.Error(err)
	}

	user.Vocations = parseVocations(director, actor, writer, producer, editor, cinematographer, animator, composer)
	user.Formats = parseFormats(movies, series, shorts, animation, vlogs, educational)
	if user.ID != "" {
		checkTrendingUpdated(trendingUpdated, user.ID)
	}
	return user
}

func scanUsers(rows *sql.Rows) []User {
	var users []User

	for rows.Next() {
		var user User
		var director bool
		var actor bool
		var writer bool
		var producer bool
		var editor bool
		var cinematographer bool
		var animator bool
		var composer bool
		var movies bool
		var series bool
		var shorts bool
		var animation bool
		var vlogs bool
		var educational bool
		var trendingUpdated time.Time

		err := rows.Scan(&user.ID, &user.DisplayName, &user.ImageURL, &user.BannerImageURL, &user.FollowerCount, &user.FollowingCount, &user.Tagline, &user.About,
			&director, &actor, &writer, &producer, &editor, &cinematographer, &animator, &composer,
			&movies, &series, &shorts, &animation, &vlogs, &educational,
			&trendingUpdated)
		if err != nil {
			log.Error(err)
		}

		user.Vocations = parseVocations(director, actor, writer, producer, editor, cinematographer, animator, composer)
		user.Formats = parseFormats(movies, series, shorts, animation, vlogs, educational)
		if user.ID != "" {
			checkTrendingUpdated(trendingUpdated, user.ID)
			users = append(users, user)
		}
	}

	return users
}

func checkTrendingUpdated(updated time.Time, userID string) {
	yesterday := time.Now().AddDate(0, 0, -1)
	if updated.Before(yesterday) {
		updateTrendingScore(userID)
	}
}

func updateTrendingScore(userID string) {
	todayViewCount, err := getTodayProfileViewCount(userID)
	if err != nil {
		return
	}
	yesterdayViewCount, err := getYesterdayProfileViewCount(userID)
	if err != nil {
		return
	}

	// velocity := todayViewCount - yesterdayViewCount
	// if velocity < 0 {}

	trendingScore := todayViewCount + yesterdayViewCount

	var db = handlemysql.GetDB()
	_, err = db.Exec("UPDATE USERS SET trendingUpdated=CURRENT_TIMESTAMP, trendingScore=? WHERE id=?", trendingScore, userID)
	if err != nil {
		log.Error("Error updating user trending score", err)
	}
}

func getTodayProfileViewCount(userID string) (int, error) {
	return getProfileViewCount(userID, "CURDATE()")
}

func getYesterdayProfileViewCount(userID string) (int, error) {
	return getProfileViewCount(userID, "subdate(current_date, 1)")
}

func getProfileViewCount(userID string, dateQuery string) (int, error) {
	var profileViewCountToday int
	var db = handlemysql.GetDB()
	err := db.QueryRow(fmt.Sprintf("SELECT count(*) FROM PROFILE_VIEW_ACTIVITY WHERE creatorId=? AND date=%v", dateQuery), userID).Scan(&profileViewCountToday)
	if err != nil {
		log.Error("Error getting profile view count for user ID "+userID, err)
		return 0, err
	}

	return profileViewCountToday, nil
}

func parseVocations(directorFlg bool, actorFlg bool, writerFlg bool, producerFlg bool, editorFlg bool, cinematographerFlg bool, animatorFlg bool, composerFlg bool) []UserFlag {
	var vocations []UserFlag

	vocations = append(vocations, UserFlag{Name: director, Set: directorFlg})
	vocations = append(vocations, UserFlag{Name: actor, Set: actorFlg})
	vocations = append(vocations, UserFlag{Name: writer, Set: writerFlg})
	vocations = append(vocations, UserFlag{Name: producer, Set: producerFlg})
	vocations = append(vocations, UserFlag{Name: editor, Set: editorFlg})
	vocations = append(vocations, UserFlag{Name: cinematographer, Set: cinematographerFlg})
	vocations = append(vocations, UserFlag{Name: animator, Set: animatorFlg})
	vocations = append(vocations, UserFlag{Name: composer, Set: composerFlg})

	return vocations
}

func parseFormats(moviesFlg bool, seriesFlg bool, shortsFlg bool, animationFlg bool, vlogsFlg bool, educationalFlg bool) []UserFlag {
	var formats []UserFlag

	formats = append(formats, UserFlag{Name: movies, Set: moviesFlg})
	formats = append(formats, UserFlag{Name: series, Set: seriesFlg})
	formats = append(formats, UserFlag{Name: shorts, Set: shortsFlg})
	formats = append(formats, UserFlag{Name: animation, Set: animationFlg})
	formats = append(formats, UserFlag{Name: vlogs, Set: vlogsFlg})
	formats = append(formats, UserFlag{Name: educational, Set: educationalFlg})

	return formats
}

//GetUserProfile gets user with extra fields
func GetUserProfile(id string) User {
	var user User
	var db = handlemysql.GetDB()

	row := db.QueryRow(profileQuery+" FROM USERS WHERE id=?", id)

	var director bool
	var actor bool
	var writer bool
	var producer bool
	var editor bool
	var cinematographer bool
	var animator bool
	var composer bool
	var movies bool
	var series bool
	var shorts bool
	var animation bool
	var vlogs bool
	var educational bool
	var trendingUpdated time.Time

	err := row.Scan(&user.ID, &user.DisplayName, &user.ImageURL, &user.BannerImageURL, &user.FollowerCount, &user.FollowingCount, &user.ViewerCount, &user.Tagline, &user.About,
		&director, &actor, &writer, &producer, &editor, &cinematographer, &animator, &composer,
		&movies, &series, &shorts, &animation, &vlogs, &educational,
		&trendingUpdated)
	if err != nil {
		log.Error(err)
	}

	user.Vocations = parseVocations(director, actor, writer, producer, editor, cinematographer, animator, composer)
	user.Formats = parseFormats(movies, series, shorts, animation, vlogs, educational)
	if user.ID != "" {
		checkTrendingUpdated(trendingUpdated, user.ID)
	}

	return user
}

//GetUserByID get User with the ID
func GetUserByID(id string, reqID string) User {
	var user User
	var db = handlemysql.GetDB()

	row := db.QueryRow(userQuery+" FROM USERS WHERE id=?", id)

	user = scanUser(row)

	if reqID != "" {
		user.HasConnected = HasUserConnectedTo(id, reqID)
		err := addProfileView(id, reqID)
		if err != nil {
			log.Error("Error updating profile view activity", err)
		}
	}

	return user
}

func addProfileView(id string, reqID string) error {
	var db = handlemysql.GetDB()
	_, err := db.Exec("INSERT INTO PROFILE_VIEW_ACTIVITY (viewerId, date, creatorId) VALUES (?, CURRENT_DATE(), ?)", reqID, id)
	if err != nil {
		log.Error("Error adding profile view", err)
		return err
	}
	_, err = db.Exec("UPDATE USERS SET viewerCount = viewerCount + 1 WHERE id=?", id)
	return err
}

//GetUsersByID get multiple users by id
func GetUsersByID(ids []string) []User {
	var users []User
	var db = handlemysql.GetDB()

	//IDs should always come from previous database query, no sanitation happing here
	rows, err := db.Query(userQuery + ` FROM USERS WHERE id IN("` + strings.Join(ids, `","`) + `")`)
	if err != nil {
		log.Error(err)
		return users
	}

	return scanUsers(rows)
}

//GetSimilarUsers get simialr users to the one passed in
func GetSimilarUsers(id string) []User {
	var users []User
	var db = handlemysql.GetDB()

	rows, err := db.Query(userQuery+" FROM USERS WHERE id IN(SELECT similarUser FROM SIMILAR_USERS WHERE user=?) LIMIT 10", id)
	if err != nil {
		log.Error(err)
		return users
	}

	return scanUsers(rows)
}

//GetUserByApikey get User by apikey
func GetUserByApikey(apiKey string) User {
	var db = handlemysql.GetDB()
	row := db.QueryRow(userQuery+" FROM USERS WHERE id=(SELECT userId FROM APIKEYS WHERE id=?)", apiKey)

	return scanUser(row)
}

//GetLoginInfoByDisplay get User by DisplayName
func GetLoginInfoByDisplay(displayName string) User {
	var user User

	var db = handlemysql.GetDB()
	err := db.
		QueryRow("SELECT id, displayName, email, password, salt FROM USERS WHERE displayName=?", displayName).
		Scan(
			&user.ID,
			&user.DisplayName,
			&user.Email,
			&user.Password,
			&user.Salt)
	if err != nil {
		//Handle errors
		log.Error(err)
		return user
	}

	return user
}

//GetLoginInfoByEmail get User by Email
func GetLoginInfoByEmail(email string) User {
	var user User

	var db = handlemysql.GetDB()
	err := db.
		QueryRow("SELECT id, displayName, email, password, salt FROM USERS WHERE email=?", email).
		Scan(
			&user.ID,
			&user.DisplayName,
			&user.Email,
			&user.Password,
			&user.Salt,
		)
	if err != nil {
		//Handle errors
		log.Error(err)
		return user
	}

	return user
}

//GetUserConnectionsTo Get users that are connected to this user
func GetUserConnectionsTo(id string) []string {
	var connections []string

	var db = handlemysql.GetDB()
	rows, err := db.Query("SELECT connectFrom FROM CONNECTIONS WHERE connectedTo=?", id)
	if err != nil {
		log.Error(err)
		return connections
	}

	for rows.Next() {
		var followingID string
		err = rows.Scan(&followingID)
		if followingID != "" {
			connections = append(connections, followingID)
		}
	}

	return connections
}

//GetUserConnectionFrom Get users that this user is connected to
func GetUserConnectionFrom(id string) []string {
	var connections []string

	var db = handlemysql.GetDB()
	rows, err := db.Query("SELECT connectTo FROM CONNECTIONS WHERE connectFrom=?", id)
	if err != nil {
		log.Error(err)
		return connections
	}

	for rows.Next() {
		var followerID string
		err = rows.Scan(&followerID)
		if followerID != "" {
			connections = append(connections, followerID)
		}
	}

	return connections
}

//HasUserConnectedTo Check to see if a user is subscribed to another user
func HasUserConnectedTo(connectedTo string, connectedFrom string) bool {
	var followerID sql.NullString
	var db = handlemysql.GetDB()
	err := db.QueryRow("SELECT connectedTo FROM CONNECTIONS WHERE connectedTo=? AND connectedFrom=?", connectedTo, connectedFrom).Scan(&followerID)
	if err != nil {
		log.Error(err)
		return false
	}

	return followerID.String != ""
}

//InsertUserConnection establish a connection from user to user
func InsertUserConnection(connectedTo string, connectedFrom string) error {
	var db = handlemysql.GetDB()
	_, err := db.Exec("INSERT INTO CONNECTIONS (connectedTo, connectedFrom) VALUES (?,?)", connectedTo, connectedFrom)
	if err != nil {
		log.Error("Error inserting user conenction", err)
		return err
	}

	_, err = db.Exec("UPDATE USERS SET followerCount = followerCount + 1 WHERE id=?", connectedTo)
	_, err = db.Exec("UPDATE USERS SET followingCount = followingCount + 1 WHERE id=?", connectedFrom)
	return err
}

//GetUserEmail Get users email for messaging
func GetUserEmail(id string) string {
	var email sql.NullString
	var db = handlemysql.GetDB()
	err := db.QueryRow("SELECT email FROM USERS WHERE id=?", id).Scan(&email)
	if err != nil {
		log.Error(err)
		return ""
	}

	return email.String
}

// RegisterUser registers user information, adds to DB, then returns
// newly created User object
func RegisterUser(user User) (string, error) {
	// if user.Phone != "" {
	// 	return registerWithPhone(user)
	// }
	return registerWithEmail(user)
}

func registerWithPhone(user User) (string, error) {
	var db = handlemysql.GetDB()
	userID := uuid.New().String()
	_, err := db.Exec("INSERT INTO USERS (id, phone, password, salt) VALUES (?,?,?,?)", userID, user.Phone, ' ', ' ')
	if err != nil {
		log.Error(err)
		return "", err
	}
	return userID, nil
}

func registerWithEmail(user User) (string, error) {
	var db = handlemysql.GetDB()
	salt, _ := util.GenerateRandomString(32)
	user.Password = hash(salt + user.Password)
	userID := uuid.New().String()
	_, err := db.Exec("INSERT INTO USERS (id, email, displayName, password, salt) VALUES (?,?,?,?,?)", userID, user.Email, user.DisplayName, user.Password, salt)
	if err != nil {
		log.Error(err)
		return "", err
	}
	return userID, nil
}

func hash(hashString string) string {
	hash := sha512.Sum512([]byte(hashString))
	return string(hash[:])
}

// DisplayNameExists check if the display name is unique for the user
func DisplayNameExists(displayNameQuery string) string {
	var db = handlemysql.GetDB()
	var displayName string
	err := db.QueryRow("SELECT displayName FROM USERS WHERE EXISTS (SELECT displayName FROM USERS WHERE displayName=?)", displayNameQuery).Scan(&displayName)
	if err != nil {
		log.Error(err)
		return ""
	}
	return displayName
}

// UniqueEmail check if the email is unique for the user
func UniqueEmail(emailQuery string) bool {
	var db = handlemysql.GetDB()
	var emailExsists sql.NullInt64
	err := db.QueryRow("SELECT EXISTS(SELECT email FROM USERS WHERE email=?)", emailQuery).Scan(&emailExsists)
	if err != nil {
		log.Error(err)
		return false
	}
	return emailExsists.Int64 == 0
}

// UniqueDisplayName check if the display name is unique for the user
func UniqueDisplayName(displayNameQuery string) bool {
	var db = handlemysql.GetDB()
	var displayNameExsists sql.NullInt64
	err := db.QueryRow("SELECT EXISTS(SELECT displayName FROM USERS WHERE displayName=?)", displayNameQuery).Scan(&displayNameExsists)
	if err != nil {
		log.Error(err)
		return false
	}
	return displayNameExsists.Int64 == 0
}

//UpdateUser update user editable fields
func UpdateUser(user User) error {
	var db = handlemysql.GetDB()
	var err error

	if user.About != "" {
		_, err = db.Exec("UPDATE USERS SET about=? WHERE id=?", user.About, user.ID)
	}

	if user.Tagline != "" {
		_, err = db.Exec("UPDATE USERS SET tagline=? WHERE id=?", user.Tagline, user.ID)
	}

	if user.FirstName != "" {
		_, err = db.Exec("UPDATE USERS SET firstName=? WHERE id=?", user.FirstName, user.ID)
	}

	if user.LastName != "" {
		_, err = db.Exec("UPDATE USERS SET lastName=? WHERE id=?", user.LastName, user.ID)
	}

	for _, vocation := range user.Vocations {
		if validVocation(vocation.Name) {
			_, err = db.Exec(fmt.Sprintf("UPDATE USERS SET %v=? WHERE id=?", vocation.Name), vocation.Set, user.ID)
		}
	}

	for _, format := range user.Formats {
		if validFormat(format.Name) {
			_, err = db.Exec(fmt.Sprintf("UPDATE USERS SET %v=? WHERE id=?", format.Name), format.Set, user.ID)
		}
	}

	if err != nil {
		log.Error(err)
		return err
	}

	return nil
}

//IsValidUserType returns if a string is a valid user type, just vocation for now, will expland later
func IsValidUserType(userType string) bool {
	return validVocation(userType) || userType == connectionsType
}

func validVocation(vocation string) bool {
	return vocations[vocation]
}

func validFormat(format string) bool {
	return formats[format]
}

//UpdateUserProfileImage update image location in MySQL to response from S3
func UpdateUserProfileImage(ID string, imageURL string) error {
	var db = handlemysql.GetDB()
	_, err := db.Exec("UPDATE USERS SET imageUrl=? WHERE id=?", imageURL, ID)
	return err
}

func getTrendingUsersForType(userType string, limit int) ([]User, error) {
	var db = handlemysql.GetDB()
	query := userQuery + fmt.Sprintf(" FROM USERS WHERE %v=1 ORDER BY trendingScore DESC LIMIT %v", userType, limit)
	rows, err := db.Query(query)
	if err != nil {
		log.Error("Error getting recommended users", err)
		return make([]User, 0), err
	}

	return scanUsers(rows), nil
}

//GetUsersConnections get the users that a user has connected with
func GetUsersConnections(id string) (RecommendedUsersResponse, error) {
	const limit = 8
	var usersConnections RecommendedUsersResponse

	var db = handlemysql.GetDB()
	query := userQuery + " FROM USERS as users INNER JOIN (SELECT connectedTo FROM CONNECTIONS WHERE connectedFrom=?) as connections ON users.id=connections.connectedTo ORDER BY trendingScore DESC LIMIT 8"
	rows, err := db.Query(query, id)
	if err != nil {
		log.Error("Error getting user's connections", err)
		return usersConnections, err
	}

	users := scanUsers(rows)

	return RecommendedUsersResponse{
		Name:    connectionsName,
		SubText: connectionsSubText,
		Type:    connectionsType,
		Users:   users,
	}, nil
}

//GetRecommendedUsers get recommended users by vocation
func GetRecommendedUsers() ([]RecommendedUsersResponse, error) {
	const limit = 8
	var recommendedUsers []RecommendedUsersResponse

	for vocation := range vocations {
		users, err := getTrendingUsersForType(vocation, limit)
		if err != nil {
			return recommendedUsers, err
		}
		recommendedUsers = append(recommendedUsers, RecommendedUsersResponse{
			Name:    userTypeToName[vocation],
			SubText: userTypeToSubtext[vocation],
			Type:    vocation,
			Users:   users,
		})
	}

	return recommendedUsers, nil
}

//GetRecommendedUsersByType get only users of a certain type
func GetRecommendedUsersByType(userType string, userID string) ([]RecommendedUsersResponse, error) {
	var recommendedUsers []RecommendedUsersResponse

	if userType == connectionsType {
		userConnections, err := GetUsersConnections(userID)
		if err != nil {
			return recommendedUsers, err
		}
		recommendedUsers = append(recommendedUsers, userConnections)
	} else {
		users, err := getTrendingUsersForType(userType, userPageLimit)
		if err != nil {
			return recommendedUsers, err
		}
		recommendedUsers = append(recommendedUsers, RecommendedUsersResponse{
			Name:    userTypeToName[userType],
			SubText: userTypeToSubtext[userType],
			Type:    userType,
			Users:   users,
		})
	}

	return recommendedUsers, nil
}

func getTrendingUsersForTypePaginated(userType string, page int) ([]User, error) {
	var db = handlemysql.GetDB()
	pageFrom := page * userPageLimit
	query := userQuery + fmt.Sprintf(" FROM USERS WHERE %v=1 ORDER BY trendingScore DESC LIMIT %v,%v", userType, pageFrom, userPageLimit)
	rows, err := db.Query(query)
	if err != nil {
		log.Error("Error getting recommended users", err)
		return make([]User, 0), nil
	}

	return scanUsers(rows), nil
}

func getConnectedUsersPaginated(userID string, page int) ([]User, error) {
	var db = handlemysql.GetDB()
	pageFrom := page * userPageLimit
	query := userQuery + fmt.Sprintf(" FROM USERS as users INNER JOIN (SELECT connectedTo FROM CONNECTIONS WHERE connectedFrom=?) as connections ON users.id=connections.connectedTo ORDER BY trendingScore DESC LIMIT %v,%v", pageFrom, userPageLimit)
	rows, err := db.Query(query, userID)
	if err != nil {
		log.Error("Error getting recommended users", err)
		return make([]User, 0), nil
	}

	return scanUsers(rows), nil
}

//GetRecommendedUsersByTypePaginated get recommeneded users by type for the page requested
func GetRecommendedUsersByTypePaginated(userType string, page string, userID string) ([]User, error) {
	var users []User

	pageInt, err := strconv.Atoi(page)
	if err != nil {
		log.Error("Error converting page to int", err)
		return users, err
	}

	if userType == connectionsType {
		users, err = getConnectedUsersPaginated(userID, pageInt)
	} else {
		users, err = getTrendingUsersForTypePaginated(userType, pageInt)
	}
	if err != nil {
		return users, err
	}

	return users, nil
}

//InsertFeedback cinsert user feedback into DB
func InsertFeedback(userID string, feedback string) error {
	db := handlemysql.GetDB()
	_, err := db.Exec("INSERT INTO FEEDBACK (userId, feedback) VALUES (?,?)", userID, feedback)
	if err != nil {
		log.Error(err)
		return err
	}
	return nil
}
