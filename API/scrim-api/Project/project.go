package project

import (
	"database/sql"
	"fmt"
	"time"

	handlemysql "bitbucket.org/scrim-api/SQL"
	util "bitbucket.org/scrim-api/Util"
	log "github.com/sirupsen/logrus"
)

//Project struct object
type Project struct {
	ID                    string           `json:"id"`
	Title                 string           `json:"title"`
	ImageURL              string           `json:"imageUrl"`
	Tag                   string           `json:"tag"`
	Description           string           `json:"description"`
	Logline               string           `json:"logline"`
	Format                string           `json:"format"`
	Length                string           `json:"length"`
	Tone                  string           `json:"tone"`
	ScriptSample          string           `json:"scriptSample"`
	Look                  []string         `json:"look"`
	ProductionStartDate   string           `json:"productionStartDate"`
	TargetAmount          int              `json:"targetAmount"`
	RaisedAmount          int              `json:"raisedAmount"`
	Backers               int              `json:"backers"`
	FanInfo               pledgeInfo       `json:"fanInfo"`
	InvestorInfo          pledgeInfo       `json:"investorInfo"`
	ExecutiveProducerInfo pledgeInfo       `json:"executiveProducerInfo"`
	LeadCreator           projectCreator   `json:"leadCreator,omitempty"`
	Creators              []projectCreator `json:"creators,omitempty"`
}

type projectCreator struct {
	ID          string `json:"id"`
	DisplayName string `json:"displayName"`
	ImageURL    string `json:"imageUrl"`
	Description string `json:"description"`
}

type pledgeInfo struct {
	AmountRaised int `json:"amountRaised"`
	PledgeCount  int `json:"pledgeCount"`
	PledgeMin    int `json:"PledgeMin"`
}

const projectQuery = `SELECT id, userId, title, logline, description, imageUrl, tag, format, length, tone, scriptSample, productionStart, 
							 targetAmount, raisedAmount, fanAmountRaised, fanPledgeCount, fanPledgeMin,
							 investorAmountRaised, investorPledgeCount, investorPledgeMin,
							 executiveProducerAmountRaised, executiveProducerPledgeCount, executiveProducerPledgeMin,
							 trendingUpdated FROM PROJECTS `

const projectLeadCreatorQuery = `SELECT user.id, user.displayName, user.imageUrl, role.description
								 FROM USERS user inner join PROJECT_USERS role on user.id=role.creatorId WHERE role.projectId=? AND user.id=?`

const projectCreatorsQuery = `SELECT user.id, user.displayName, user.imageUrl, role.description
							  FROM USERS user inner join PROJECT_USERS role on user.id=role.creatorId WHERE role.projectId=?`

const projectLookQuery = `SELECT imageUrl FROM PROJECT_LOOK WHERE projectId=?`

func createInfo(amountRaised int, pledgeCount int, pledgeMin int) pledgeInfo {
	return pledgeInfo{
		AmountRaised: amountRaised,
		PledgeCount:  pledgeCount,
		PledgeMin:    pledgeMin,
	}
}

func getLeadCreator(projectID string, userID string) projectCreator {
	var lead projectCreator
	var db = handlemysql.GetDB()
	err := db.QueryRow(projectLeadCreatorQuery, projectID, userID).Scan(
		&lead.ID,
		&lead.DisplayName,
		&lead.ImageURL,
		&lead.Description)
	if err != nil {
		log.Error("Error getting project lead", err)
	}

	return lead
}

func getProjectCreators(projectID string) []projectCreator {
	var creators []projectCreator
	var db = handlemysql.GetDB()

	rows, err := db.Query(projectCreatorsQuery, projectID)
	if err != nil {
		log.Error("Unable to get project creators", err)
		return creators
	}

	for rows.Next() {
		var creator projectCreator
		rows.Scan(&creator.ID,
			&creator.DisplayName,
			&creator.ImageURL,
			&creator.Description)

		creators = append(creators, creator)
	}

	return creators
}

func getProjectLook(projectID string) []string {
	var look []string
	var db = handlemysql.GetDB()

	rows, err := db.Query(projectLookQuery, projectID)
	if err != nil {
		log.Error("Unable to get project look", err)
		return look
	}

	for rows.Next() {
		var image sql.NullString
		rows.Scan(&image)

		if image.String != "" {
			look = append(look, image.String)
		}
	}

	return look
}

func scanProjects(rows *sql.Rows) ([]Project, error) {
	var projects []Project

	for rows.Next() {
		var project Project
		var leadCreatorID sql.NullString
		var productionStart sql.NullString

		var fanAmountRaised int
		var fanPledgeCount int
		var fanPledgeMin int

		var investorAmountRaised int
		var investorPledgeCount int
		var investorPledgeMin int

		var executiveProducerAmountRaised int
		var executiveProducerPledgeCount int
		var executiveProducerPledgeMin int

		var trendingUpdated time.Time
		err := rows.Scan(&project.ID,
			&leadCreatorID,
			&project.Title,
			&project.Logline,
			&project.Description,
			&project.ImageURL,
			&project.Tag,
			&project.Format,
			&project.Length,
			&project.Tone,
			&project.ScriptSample,
			&productionStart,
			&project.TargetAmount,
			&project.RaisedAmount,
			&fanAmountRaised,
			&fanPledgeCount,
			&fanPledgeMin,
			&investorAmountRaised,
			&investorPledgeCount,
			&investorPledgeMin,
			&executiveProducerAmountRaised,
			&executiveProducerPledgeCount,
			&executiveProducerPledgeMin,
			&trendingUpdated)
		if err != nil {
			log.Error(err)
			return projects, err
		}

		if project.ID != "" {
			project.ProductionStartDate = util.FormatDate(productionStart.String)
			project.FanInfo = createInfo(fanAmountRaised, fanPledgeCount, fanPledgeMin)
			project.InvestorInfo = createInfo(investorAmountRaised, investorPledgeCount, investorPledgeMin)
			project.ExecutiveProducerInfo = createInfo(executiveProducerAmountRaised, executiveProducerPledgeCount, executiveProducerPledgeMin)
			project.Backers = project.FanInfo.PledgeCount + project.InvestorInfo.PledgeCount + project.ExecutiveProducerInfo.PledgeCount
			project.LeadCreator = getLeadCreator(project.ID, leadCreatorID.String)
			project.Creators = getProjectCreators(project.ID)
			project.Look = getProjectLook(project.ID)
			projects = append(projects, project)
			checkTrendingUpdated(trendingUpdated, project.ID)
		}
	}

	return projects, nil
}

func scanProject(row *sql.Row) (Project, error) {
	var project Project
	var leadCreatorID sql.NullString
	var productionStart sql.NullString

	var fanAmountRaised int
	var fanPledgeCount int
	var fanPledgeMin int

	var investorAmountRaised int
	var investorPledgeCount int
	var investorPledgeMin int

	var executiveProducerAmountRaised int
	var executiveProducerPledgeCount int
	var executiveProducerPledgeMin int

	var trendingUpdated time.Time
	err := row.Scan(&project.ID,
		&leadCreatorID,
		&project.Title,
		&project.Logline,
		&project.Description,
		&project.ImageURL,
		&project.Tag,
		&project.Format,
		&project.Length,
		&project.Tone,
		&project.ScriptSample,
		&productionStart,
		&project.TargetAmount,
		&project.RaisedAmount,
		&fanAmountRaised,
		&fanPledgeCount,
		&fanPledgeMin,
		&investorAmountRaised,
		&investorPledgeCount,
		&investorPledgeMin,
		&executiveProducerAmountRaised,
		&executiveProducerPledgeCount,
		&executiveProducerPledgeMin,
		&trendingUpdated)
	if err != nil {
		log.Error(err)
		return project, err
	}

	project.ProductionStartDate = util.FormatDate(productionStart.String)
	project.FanInfo = createInfo(fanAmountRaised, fanPledgeCount, fanPledgeMin)
	project.InvestorInfo = createInfo(investorAmountRaised, investorPledgeCount, investorPledgeMin)
	project.ExecutiveProducerInfo = createInfo(executiveProducerAmountRaised, executiveProducerPledgeCount, executiveProducerPledgeMin)
	project.Backers = project.FanInfo.PledgeCount + project.InvestorInfo.PledgeCount + project.ExecutiveProducerInfo.PledgeCount
	project.LeadCreator = getLeadCreator(project.ID, leadCreatorID.String)
	project.Creators = getProjectCreators(project.ID)
	project.Look = getProjectLook(project.ID)
	checkTrendingUpdated(trendingUpdated, project.ID)

	return project, nil
}

func checkTrendingUpdated(updated time.Time, projectID string) {
	yesterday := time.Now().AddDate(0, 0, -1)
	if updated.Before(yesterday) {
		updateTrendingScore(projectID)
	}
}

func updateTrendingScore(projectID string) {
	todayViewCount, err := getTodayProjectViewCount(projectID)
	if err != nil {
		return
	}
	yesterdayViewCount, err := getYesterdayProjectViewCount(projectID)
	if err != nil {
		return
	}

	// velocity := todayViewCount - yesterdayViewCount
	// if velocity < 0 {}

	trendingScore := todayViewCount + yesterdayViewCount

	var db = handlemysql.GetDB()
	_, err = db.Exec("UPDATE PROJECTS SET trendingUpdated=CURRENT_TIMESTAMP, trendingScore=? WHERE id=?", trendingScore, projectID)
	if err != nil {
		log.Error("Error updating user trending score", err)
	}
}

func getTodayProjectViewCount(userID string) (int, error) {
	return getProjectViewCount(userID, "CURDATE()")
}

func getYesterdayProjectViewCount(userID string) (int, error) {
	return getProjectViewCount(userID, "subdate(current_date, 1)")
}

func getProjectViewCount(projectID string, dateQuery string) (int, error) {
	var viewCount int
	var db = handlemysql.GetDB()
	err := db.QueryRow(fmt.Sprintf("SELECT count(*) FROM PROJECT_VIEW_ACTIVITY WHERE projectId=? AND date=%v", dateQuery), projectID).Scan(&viewCount)
	if err != nil {
		log.Error("Error getting project view count for user ID "+projectID, err)
		return 0, err
	}

	return viewCount, nil
}

//GetProjectByID get project from ID
func GetProjectByID(id string, userID string) (Project, error) {
	log.Infof("Getting project for ID: %v", id)
	var db = handlemysql.GetDB()
	row := db.QueryRow(projectQuery+`WHERE id=?`, id)

	project, err := scanProject(row)
	if err == nil && project.ID != "" {
		ProjectViewed(id, userID)
	}

	return project, err
}

//GetTrendingProjects return top trending projects
func GetTrendingProjects() ([]Project, error) {
	var projects []Project
	db := handlemysql.GetDB()

	rows, err := db.Query(projectQuery + `WHERE visible=1 ORDER BY trendingScore DESC LIMIT 8`)
	if err != nil {
		log.Error("Unable to get trending projects", err)
		return projects, err
	}

	return scanProjects(rows)
}

//GetProjectsByUser return list of Projects given userID
func GetProjectsByUser(userID string) ([]Project, error) {
	db := handlemysql.GetDB()
	rows, err := db.Query(projectQuery+`WHERE userId=? AND visible=1`, userID)
	if err != nil {
		log.Error("Error quering projects by users", err)
	}

	return scanProjects(rows)
}

//ProjectViewed project was viewed by someone
func ProjectViewed(projectID string, viewerID string) error {
	db := handlemysql.GetDB()

	_, err := db.Exec("INSERT INTO PROJECT_VIEW_ACTIVITY (viewerId, date, projectId) VALUES (?, CURRENT_DATE(), ?)", viewerID, projectID)

	if err != nil {
		log.Error("Unable to create view activity record", err)
		return err
	}

	_, err = db.Exec("UPDATE PROJECTS SET viewerCount = viewerCount + 1 WHERE id=?", projectID)
	if err != nil {
		log.Error("Unable to update project viewcount", err)
		return err
	}

	return nil
}
