package stream

import (
	"bitbucket.org/scrim-api/SQL"
	user "bitbucket.org/scrim-api/Users"
	"github.com/google/uuid"
	log "github.com/sirupsen/logrus"
)

//Reaction struct object
type Reaction struct {
	ID        string    `json:"id,omitempty"`
	Reaction  uint16    `json:"reaction,omitempty"`
	Timestamp uint32    `json:"timestamp,omitempty"`
	User      user.User `json:"user,omitempty"`
	Stream    Stream    `json:"stream,omitempty"`
}

//AddReaction add reaction to a stream by a user at a time denoted in seconds within that stream
func AddReaction(reaction Reaction) (string, error) {
	db := handlemysql.GetDB()
	reactionID := uuid.New().String()

	_, err := db.Exec("INSERT INTO REACTIONS (id, reaction, timestamp, userId, streamId) VALUES (?,?,?,?,?)",
		reactionID,
		reaction.Reaction,
		reaction.Timestamp,
		reaction.User.ID,
		reaction.Stream.ID)

	if err != nil {
		log.Error(err)
		return "", err
	}
	return reactionID, nil
}

//GetReactionsByStream get all the reactions loaded in a stream
func GetReactionsByStream(streamID string) ([]Reaction, error) {
	var reactions []Reaction
	db := handlemysql.GetDB()

	rows, err := db.Query(`SELECT id, reaction, timestamp, userId, streamId FROM REACTIONS where streamId=?`, streamID)
	if err != nil {
		log.Error(err)
		return reactions, err
	}
	for rows.Next() {
		var reaction Reaction
		err = rows.Scan(&reaction.ID, &reaction.Reaction, &reaction.Timestamp, &reaction.User.ID, &reaction.Stream.ID)
		reactions = append(reactions, reaction)
	}
	return reactions, nil
}
