package resource

import (
	"net/http"

	broadcast "bitbucket.org/scrim-api/Broadcast"
	paper "bitbucket.org/scrim-api/Paper"
	project "bitbucket.org/scrim-api/Project"
	util "bitbucket.org/scrim-api/Util"
	"github.com/gin-gonic/gin"
)

// TrendingResponse struct object
type TrendingResponse struct {
	Name    string        `json:"name,omitempty"`
	SubText string        `json:"subText,omitempty"`
	Type    string        `json:"type,omitempty"`
	Data    []interface{} `json:"data,omitempty"`
}

//GetTrending get trending content
func GetTrending(ctx *gin.Context) {
	res := util.Response{}
	var trending []TrendingResponse

	broadcasts, _ := broadcast.GetTrendingBroadcasts()
	trending = append(trending, TrendingResponse{
		Name:    "Trending Videos",
		SubText: "What other people are watching now",
		Type:    "Broadcast",
		Data:    mapBroadcasts(broadcasts...),
	})

	papers, _ := paper.GetTrendingPapers()
	trending = append(trending, TrendingResponse{
		Name:    "Trending Papers",
		SubText: "What other people are reading now",
		Type:    "Paper",
		Data:    mapPapers(papers...),
	})

	res.Status.Message = "Got Trending Content"
	res.Data = trending
	ctx.JSON(http.StatusOK, res)
}

//GetTrendingProjects get trending projects
func GetTrendingProjects(ctx *gin.Context) {
	res := util.Response{}
	var trending []TrendingResponse

	projects, _ := project.GetTrendingProjects()
	trending = append(trending, TrendingResponse{
		Name:    "Trending Projects",
		SubText: "Help projects from the world's greatest creators come to life",
		Type:    "Project",
		Data:    mapProjects(projects...),
	})

	res.Status.Message = "Got Trending Projects"
	res.Data = trending
	ctx.JSON(http.StatusOK, res)
}

func mapBroadcasts(broadcasts ...broadcast.Broadcast) []interface{} {
	var recommendations []interface{}
	for _, broadcast := range broadcasts {
		recommendations = append(recommendations, broadcast)
	}
	return recommendations
}

func mapPapers(papers ...paper.Paper) []interface{} {
	var recommendations []interface{}
	for _, paper := range papers {
		recommendations = append(recommendations, paper)
	}
	return recommendations
}

func mapProjects(projects ...project.Project) []interface{} {
	var recommendations []interface{}
	for _, project := range projects {
		recommendations = append(recommendations, project)
	}
	return recommendations
}
