package broadcast

import (
	"database/sql"
	"fmt"
	"strconv"
	"time"

	handlemysql "bitbucket.org/scrim-api/SQL"
	stream "bitbucket.org/scrim-api/Stream"
	user "bitbucket.org/scrim-api/Users"
	util "bitbucket.org/scrim-api/Util"
	"github.com/google/uuid"
	log "github.com/sirupsen/logrus"
)

//Broadcast struct object
type Broadcast struct {
	ID          string          `json:"id"`
	Title       string          `json:"title"`
	Description string          `json:"description,omitempty"`
	ImageURL    string          `json:"imageUrl,omitempty"`
	StreamID    string          `json:"streamId"`
	ViewerCount uint32          `json:"viewerCount,omitempty"`
	Live        bool            `json:"live,omitempty"`
	Airtime     string          `json:"airtime,omitempty"`
	Runtime     uint32          `json:"runtime,omitempty"`
	Broadcaster user.User       `json:"broadcaster,omitempty"`
	Program     Program         `json:"program,omitempty"`
	Streams     []stream.Stream `json:"streams,omitempty"`
}

//Program The show information of the broadcast
type Program struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	ImageURL    string `json:"imageUrl,omitempty"`
	ViewerCount uint32 `json:"viewerCount,omitempty"`
}

//BroadcastExtras broadcast with extra information for the broadcast page
type BroadcastExtras struct {
	Broadcast         Broadcast   `json:"broadcast"`
	SimilarCreators   []user.User `json:"similarCreators"`
	SimilarBroadcasts []Broadcast `json:"similarBroadcasts"`
}

const broadcastQuery = `SELECT broadcast.id, broadcast.title, broadcast.description, broadcast.imageUrl, broadcast.streamId, 
							   broadcast.live, broadcast.viewerCount, broadcast.airtime, broadcast.runtime, broadcast.trendingUpdated, 
							   user.id, user.displayName, user.imageUrl, user.followerCount
						FROM BROADCASTS broadcast inner join USERS user on user.id=broadcast.userId `

func scanBroadcasts(rows *sql.Rows) ([]Broadcast, error) {
	var broadcasts []Broadcast

	for rows.Next() {
		var broadcast Broadcast
		var trendingUpdated time.Time
		var timeStamp sql.NullString
		err := rows.Scan(&broadcast.ID,
			&broadcast.Title,
			&broadcast.Description,
			&broadcast.ImageURL,
			&broadcast.StreamID,
			&broadcast.Live,
			&broadcast.ViewerCount,
			&timeStamp,
			&broadcast.Runtime,
			&trendingUpdated,
			&broadcast.Broadcaster.ID,
			&broadcast.Broadcaster.DisplayName,
			&broadcast.Broadcaster.ImageURL,
			&broadcast.Broadcaster.FollowerCount)
		if err != nil {
			log.Error(err)
			return broadcasts, err
		}

		if broadcast.ID != "" {
			broadcast.Airtime = util.FormatTime(timeStamp.String, broadcast.Live)
			broadcasts = append(broadcasts, broadcast)
			checkTrendingUpdated(trendingUpdated, broadcast.ID)
		}
	}

	return broadcasts, nil
}

func scanBroadcast(row *sql.Row) (Broadcast, error) {
	var broadcast Broadcast
	var trendingUpdated time.Time
	var timeStamp sql.NullString
	err := row.Scan(&broadcast.ID,
		&broadcast.Title,
		&broadcast.Description,
		&broadcast.ImageURL,
		&broadcast.StreamID,
		&broadcast.Live,
		&broadcast.ViewerCount,
		&timeStamp,
		&broadcast.Runtime,
		&trendingUpdated,
		&broadcast.Broadcaster.ID,
		&broadcast.Broadcaster.DisplayName,
		&broadcast.Broadcaster.ImageURL,
		&broadcast.Broadcaster.FollowerCount)
	if err != nil {
		log.Error(err)
		return broadcast, err
	}

	broadcast.Airtime = util.FormatTime(timeStamp.String, broadcast.Live)
	checkTrendingUpdated(trendingUpdated, broadcast.ID)
	return broadcast, nil
}

func checkTrendingUpdated(updated time.Time, broadcastID string) {
	yesterday := time.Now().AddDate(0, 0, -1)
	if updated.Before(yesterday) {
		updateTrendingScore(broadcastID)
	}
}

func updateTrendingScore(broadcastID string) {
	todayViewCount, err := getTodayBroadcastViewCount(broadcastID)
	if err != nil {
		return
	}
	yesterdayViewCount, err := getYesterdayBroadcastViewCount(broadcastID)
	if err != nil {
		return
	}

	// velocity := todayViewCount - yesterdayViewCount
	// if velocity < 0 {}

	trendingScore := todayViewCount + yesterdayViewCount

	var db = handlemysql.GetDB()
	_, err = db.Exec("UPDATE BROADCASTS SET trendingUpdated=CURRENT_TIMESTAMP, trendingScore=? WHERE id=?", trendingScore, broadcastID)
	if err != nil {
		log.Error("Error updating user trending score", err)
	}
}

func getTodayBroadcastViewCount(userID string) (int, error) {
	return getBroadcastViewCount(userID, "CURDATE()")
}

func getYesterdayBroadcastViewCount(userID string) (int, error) {
	return getBroadcastViewCount(userID, "subdate(current_date, 1)")
}

func getBroadcastViewCount(broadcastID string, dateQuery string) (int, error) {
	var broadcastViewCount int
	var db = handlemysql.GetDB()
	err := db.QueryRow(fmt.Sprintf("SELECT count(*) FROM BROADCAST_VIEW_ACTIVITY WHERE broadcastId=? AND date=%v", dateQuery), broadcastID).Scan(&broadcastViewCount)
	if err != nil {
		log.Error("Error getting broadcast view count for user ID "+broadcastID, err)
		return 0, err
	}

	return broadcastViewCount, nil
}

//GetBroadcastWithExtrasByID get broadcast from ID and extras for stream page
func GetBroadcastWithExtrasByID(broadcastID string, userID string) (BroadcastExtras, error) {
	log.Infof("Getting Broadcast with extras for ID: %v", broadcastID)
	var broadcastExtras BroadcastExtras

	broadcast, err := GetBroadcastByID(broadcastID)
	if err != nil {
		log.Error("Unable to get broadcast with extras", err)
		return broadcastExtras, err
	}

	if userID != "" {
		broadcast.Broadcaster.HasConnected = user.HasUserConnectedTo(broadcast.Broadcaster.ID, userID)
	}

	broadcastExtras.Broadcast = broadcast
	broadcastExtras.SimilarCreators = user.GetSimilarUsers(broadcast.Broadcaster.ID)
	broadcastExtras.SimilarBroadcasts, _ = GetSimilarBroadcasts(broadcast.ID)

	return broadcastExtras, nil
}

//GetBroadcastByID get broadcast from ID
func GetBroadcastByID(id string) (Broadcast, error) {
	log.Infof("Getting Broadcast for ID: %v", id)
	var db = handlemysql.GetDB()
	row := db.QueryRow(broadcastQuery+`WHERE broadcast.id=? AND visible=1`, id)

	return scanBroadcast(row)
}

//GetTrendingBroadcasts return top trending broadcasts
func GetTrendingBroadcasts() ([]Broadcast, error) {
	var broadcasts []Broadcast
	db := handlemysql.GetDB()

	rows, err := db.Query(broadcastQuery + `WHERE visible=1 ORDER BY broadcast.trendingScore DESC LIMIT 8`)
	if err != nil {
		log.Error("Unable to get trending broadcasts", err)
		return broadcasts, err
	}

	return scanBroadcasts(rows)
}

//GetBroadcastsByUser return list of Broadcasts given userID
func GetBroadcastsByUser(userID string, live bool) ([]Broadcast, error) {
	db := handlemysql.GetDB()
	rows, err := db.Query(broadcastQuery+`WHERE broadcast.userId=? AND broadcast.live=?  AND visible=1`, userID, live)
	if err != nil {
		log.Error("Error quering broadcasts by users", err)
	}

	return scanBroadcasts(rows)
}

//GetSimilarBroadcasts return list of Broadcasts related to broadcast passed in
func GetSimilarBroadcasts(broadcastID string) ([]Broadcast, error) {
	var broadcasts []Broadcast
	db := handlemysql.GetDB()

	rows, err := db.Query(broadcastQuery+`WHERE broadcast.id IN(SELECT similarBroadcast FROM SIMILAR_BROADCASTS WHERE broadcast=?)  AND visible=1 ORDER BY trendingScore DESC LIMIT 10`, broadcastID)
	if err != nil {
		log.Error("Unable to get similar broadcasts", err)
		return broadcasts, err
	}

	return scanBroadcasts(rows)
}

//GetBroadcastsCountByApikey return number of Broadcasts given userId
func GetBroadcastsCountByApikey(apiKey string) (int, error) {
	var userBroadcastCount int
	db := handlemysql.GetDB()

	err := db.QueryRow("SELECT count(*) FROM BROADCASTS WHERE userId=(SELECT userId FROM APIKEYS WHERE id=?)", apiKey).Scan(&userBroadcastCount)
	if err != nil {
		log.Error("Unable to get broadcasts by api key", err)
		return 0, err
	}
	return userBroadcastCount, nil
}

//CreateBroadcast create a broadcast
func CreateBroadcast(broadcast Broadcast) (string, error) {
	db := handlemysql.GetDB()
	broadcastID := uuid.New().String()

	_, err := db.Exec("INSERT INTO BROADCASTS (id, title, description, userId) VALUES (?,?,?,?)",
		broadcastID,
		broadcast.Title,
		broadcast.Description,
		broadcast.Broadcaster.ID)

	if err != nil {
		log.Error("Unable to create broadcast", err)
		return "", err
	}

	stream.CreateStream(broadcast.Broadcaster.ID, broadcastID)
	return broadcastID, nil
}

//BroadcastViewed create a broadcast
func BroadcastViewed(broadcastID string, viewerID string) error {
	db := handlemysql.GetDB()

	_, err := db.Exec("INSERT INTO BROADCAST_VIEW_ACTIVITY (viewerId, date, broadcastId, creatorId) VALUES (?, CURRENT_DATE(), ?, (SELECT userId FROM BROADCASTS WHERE id=?))",
		viewerID,
		broadcastID,
		broadcastID)

	if err != nil {
		log.Error("Unable to create view activity record", err)
		return err
	}

	_, err = db.Exec("UPDATE BROADCASTS SET viewerCount = viewerCount + 1 WHERE id=?", broadcastID)
	if err != nil {
		log.Error("Unable to update broadcast viewcount", err)
		return err
	}

	return nil
}

//CreateBroadcastByApikey create a broadcast for a user by API key with no attached stream and live is false
// doesn't really work yet
func CreateBroadcastByApikey(apiKey, title string) (string, error) {
	db := handlemysql.GetDB()
	broadcastID := uuid.New().String()
	if title == "" {
		broadcastUser := user.GetUserByApikey(apiKey)
		count, err := GetBroadcastsCountByApikey(apiKey)
		if err != nil {
			log.Error(err)
			return "", err
		}
		title = "Live@" + broadcastUser.DisplayName + "-" + strconv.Itoa(count)
	}
	_, err := db.Exec("INSERT INTO BROADCASTS (id, title, userId, live) VALUES (?, ?, (SELECT userId FROM APIKEYS WHERE id=?), false)", broadcastID, title, apiKey)
	if err != nil {
		log.Error("Unable to create broadcast by api key", err)
		return "", err
	}

	return broadcastID, nil
}

//StopBroadcast will set live to false on a stream
func StopBroadcast(apiKey string) error {
	db := handlemysql.GetDB()

	err := stream.StopStream(apiKey)
	if err != nil {
		log.Error(err)
		return err
	}

	ids, err := stream.GetStreams(apiKey, true)
	if err != nil {
		log.Error(err)
		return err
	}

	if len(ids) == 0 {
		_, err := db.Exec("UPDATE BROADCASTS SET live=false WHERE id=(SELECT id FROM STREAMS WHERE apiKey=?) AND live=true", apiKey)
		if err != nil {
			log.Error("Unable to update broadcast to not live", err)
			return err
		}
	}

	return nil
}

//UpdateBroadcastThumbnail update image location in MySQL to response from S3
func UpdateBroadcastThumbnail(ID string, imageURL string) error {
	var db = handlemysql.GetDB()
	_, err := db.Exec("UPDATE BROADCASTS SET imageUrl=? WHERE id=?", imageURL, ID)
	return err
}
