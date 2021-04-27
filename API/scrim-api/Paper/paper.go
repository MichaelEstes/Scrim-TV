package paper

import (
	"database/sql"
	"fmt"
	"time"

	handlemysql "bitbucket.org/scrim-api/SQL"
	user "bitbucket.org/scrim-api/Users"
	util "bitbucket.org/scrim-api/Util"
	"github.com/google/uuid"
	log "github.com/sirupsen/logrus"
)

//Paper struct object
type Paper struct {
	ID            string    `json:"id"`
	Title         string    `json:"title"`
	Content       string    `json:"content"`
	ViewerCount   uint32    `json:"viewerCount,omitempty"`
	Live          bool      `json:"live,omitempty"`
	PublishedTime string    `json:"publishedTime,omitempty"`
	Creator       user.User `json:"creator,omitempty"`
	Program       Program   `json:"program,omitempty"`
}

//Program The show information of the paper
//TO become series
type Program struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	ImageURL    string `json:"imageUrl,omitempty"`
	ViewerCount uint32 `json:"viewerCount,omitempty"`
}

//PaperExtras paper with extra information for the paper page
type PaperExtras struct {
	Paper           Paper       `json:"paper"`
	SimilarCreators []user.User `json:"similarCreators"`
	SimilarPapers   []Paper     `json:"similarPapers"`
}

const paperQuery = `SELECT paper.id, paper.title, paper.content, paper.viewerCount, paper.publishedTime, paper.trendingUpdated,
						  user.id, user.displayName, user.imageUrl, user.followerCount
					FROM PAPERS paper inner join USERS user on user.id=paper.userId `

func scanPapers(rows *sql.Rows) ([]Paper, error) {
	var papers []Paper

	for rows.Next() {
		var paper Paper
		var trendingUpdated time.Time
		var timeStamp sql.NullString
		err := rows.Scan(&paper.ID,
			&paper.Title,
			&paper.Content,
			&paper.ViewerCount,
			&timeStamp,
			&trendingUpdated,
			&paper.Creator.ID,
			&paper.Creator.DisplayName,
			&paper.Creator.ImageURL,
			&paper.Creator.FollowerCount)
		if err != nil {
			log.Error(err)
			return papers, err
		}

		if paper.ID != "" {
			paper.PublishedTime = util.FormatTime(timeStamp.String, false)
			papers = append(papers, paper)
			checkTrendingUpdated(trendingUpdated, paper.ID)
		}
	}

	return papers, nil
}

func scanPaper(row *sql.Row) (Paper, error) {
	var paper Paper
	var trendingUpdated time.Time
	var timeStamp sql.NullString
	err := row.Scan(&paper.ID,
		&paper.Title,
		&paper.Content,
		&paper.ViewerCount,
		&timeStamp,
		&trendingUpdated,
		&paper.Creator.ID,
		&paper.Creator.DisplayName,
		&paper.Creator.ImageURL,
		&paper.Creator.FollowerCount)
	if err != nil {
		log.Error(err)
		return paper, err
	}

	paper.PublishedTime = util.FormatTime(timeStamp.String, false)
	checkTrendingUpdated(trendingUpdated, paper.ID)
	return paper, nil
}

func checkTrendingUpdated(updated time.Time, paperID string) {
	yesterday := time.Now().AddDate(0, 0, -1)
	if updated.Before(yesterday) {
		updateTrendingScore(paperID)
	}
}

func updateTrendingScore(paperID string) {
	todayViewCount, err := getTodayPaperViewCount(paperID)
	if err != nil {
		return
	}
	yesterdayViewCount, err := getYesterdayPaperViewCount(paperID)
	if err != nil {
		return
	}

	// velocity := todayViewCount - yesterdayViewCount
	// if velocity < 0 {}

	trendingScore := todayViewCount + yesterdayViewCount

	var db = handlemysql.GetDB()
	_, err = db.Exec("UPDATE PAPERS SET trendingUpdated=CURRENT_TIMESTAMP, trendingScore=? WHERE id=?", trendingScore, paperID)
	if err != nil {
		log.Error("Error updating paper trending score", err)
	}
}

func getTodayPaperViewCount(paperID string) (int, error) {
	return getPaperViewCount(paperID, "CURDATE()")
}

func getYesterdayPaperViewCount(paperID string) (int, error) {
	return getPaperViewCount(paperID, "subdate(current_date, 1)")
}

func getPaperViewCount(paperID string, dateQuery string) (int, error) {
	var paperViewCount int
	var db = handlemysql.GetDB()
	err := db.QueryRow(fmt.Sprintf("SELECT count(*) FROM PAPER_VIEW_ACTIVITY WHERE paperId=? AND date=%v", dateQuery), paperID).Scan(&paperViewCount)
	if err != nil {
		log.Error("Error getting paper view count for user ID "+paperID, err)
		return 0, err
	}

	return paperViewCount, nil
}

//GetPaperWithExtrasByID get paper from ID and extras for stream page
func GetPaperWithExtrasByID(paperID string, userID string) (PaperExtras, error) {
	log.Infof("Getting paper with extras for ID: %v", paperID)
	var paperExtras PaperExtras

	paper, err := GetPaperByID(paperID)
	if err != nil {
		log.Error("Unable to get paper with extras", err)
		return paperExtras, err
	}

	if userID != "" {
		paper.Creator.HasConnected = user.HasUserConnectedTo(paper.Creator.ID, userID)
	}

	PaperViewed(paperID, userID)

	paperExtras.Paper = paper
	paperExtras.SimilarCreators = user.GetSimilarUsers(paper.Creator.ID)
	paperExtras.SimilarPapers, _ = GetSimilarPapers(paper.ID)

	return paperExtras, nil
}

//GetPaperByID get paper from ID
func GetPaperByID(id string) (Paper, error) {
	log.Infof("Getting paper for ID: %v", id)
	var db = handlemysql.GetDB()
	row := db.QueryRow(paperQuery+`WHERE paper.id=?`, id)
	return scanPaper(row)
}

//GetTrendingPapers return top trending papers
func GetTrendingPapers() ([]Paper, error) {
	var papers []Paper
	db := handlemysql.GetDB()

	rows, err := db.Query(paperQuery + `ORDER BY paper.trendingScore LIMIT 8`)
	if err != nil {
		log.Error("Unable to get trending papers", err)
		return papers, err
	}

	return scanPapers(rows)
}

//GetPapersByUser return list of Papers given userID
func GetPapersByUser(userID string) ([]Paper, error) {
	var userPapers []Paper
	db := handlemysql.GetDB()

	rows, err := db.Query(paperQuery+`WHERE paper.userId=?`, userID)
	if err != nil {
		log.Error("Unable to get papers by user", err)
		return userPapers, err
	}
	return scanPapers(rows)
}

//GetSimilarPapers return list of Papers related to the paper passed in
func GetSimilarPapers(paperID string) ([]Paper, error) {
	var papers []Paper
	db := handlemysql.GetDB()

	rows, err := db.Query(paperQuery+`WHERE paper.id IN(SELECT similarPaper FROM SIMILAR_PAPERS WHERE paper=?) ORDER BY paper.viewerCount LIMIT 10`, paperID)
	if err != nil {
		log.Error("Unable to get similar papers", err)
		return papers, err
	}

	return scanPapers(rows)
}

//CreatePaper create a paper
func CreatePaper(paper Paper) (string, error) {
	db := handlemysql.GetDB()
	paperID := uuid.New().String()

	_, err := db.Exec("INSERT INTO PAPERS (id, title, content, userId) VALUES (?,?,?,?)",
		paperID, paper.Title, paper.Content, paper.Creator.ID)

	if err != nil {
		log.Error("Unable to create paper", err)
		return "", err
	}
	return paperID, nil
}

//PaperViewed update paper view activity
func PaperViewed(paperID string, viewerID string) error {
	db := handlemysql.GetDB()

	_, err := db.Exec("INSERT INTO PAPER_VIEW_ACTIVITY (viewerId, date, paperId, creatorId) VALUES (?, CURRENT_DATE(), ?, (SELECT userId FROM PAPERS WHERE id=?))",
		viewerID, paperID, paperID)

	if err != nil {
		log.Error("Unable to create paper view activity record", err)
		return err
	}

	_, err = db.Exec("UPDATE PAPERS SET viewerCount = viewerCount + 1 WHERE id=?", paperID)
	if err != nil {
		log.Error("Unable to update paper viewcount", err)
		return err
	}

	return nil
}
