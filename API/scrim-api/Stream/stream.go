package stream

import (
	handlemysql "bitbucket.org/scrim-api/SQL"
	"github.com/google/uuid"
	log "github.com/sirupsen/logrus"
)

// Stream struct object
type Stream struct {
	ID          string `json:"id,omitempty"`
	APIKey      string `json:"apikey,omitempty"`
	BroadcastID string `json:"broadcastId,omitempty"`
	Live        bool   `json:"live,omitempty"`
}

//CreateStream create a stream with a specified ID
func CreateStream(userID string, broadcastID string) (string, error) {
	db := handlemysql.GetDB()
	id := uuid.New().String()
	_, err := db.Exec("INSERT INTO STREAMS (id, userId, broadcastId, live) VALUES (?, ? , ?, false)", id, userID, broadcastID)
	if err != nil {
		log.Error("Unable to create stream", err)
		return "", err
	}

	err = AddStreamToBroadcast(broadcastID, id)

	return id, err
}

//AddStreamToBroadcast add stream ID to broadcast
func AddStreamToBroadcast(broadcastID string, streamID string) error {
	db := handlemysql.GetDB()
	_, err := db.Exec("UPDATE BROADCASTS SET streamId=? WHERE id=?", streamID, broadcastID)
	if err != nil {
		log.Error("Unable to add stream to broadcast", err)
		return err
	}

	return nil
}

//StartStream start a stream - set apiKey to live, return deviceName associated to apiKey
func StartStream(apiKey string) error {
	db := handlemysql.GetDB()
	_, err := db.Exec("UPDATE STREAMS SET live=true WHERE apiKey=?", apiKey)
	if err != nil {
		log.Error("Unable to start stream", err)
		return err
	}
	return nil
}

//StopStream stops a stream tied to the API key
func StopStream(apiKey string) error {
	db := handlemysql.GetDB()
	_, err := db.Exec("UPDATE STREAMS SET live=false WHERE apiKey=?", apiKey)
	if err != nil {
		log.Error("Unable to stop stream", err)
		return err
	}
	return nil
}

//GetStreams get the streams associated with an apikey
func GetStreams(apiKey string, live bool) ([]string, error) {
	var ids []string
	db := handlemysql.GetDB()
	rows, err := db.Query("SELECT id FROM STREAMS WHERE apikey=? AND live=?", apiKey, live)
	if err != nil {
		log.Error("Unable to get live streams with apikey", err)
		return nil, err
	}
	for rows.Next() {
		var id string
		err = rows.Scan(&id)
		ids = append(ids, id)
	}
	return ids, nil
}

//GetApikeyByStreamID get apikey given streamID
func GetApikeyByStreamID(streamID string) (string, error) {
	db := handlemysql.GetDB()
	var apikey string
	err := db.QueryRow("SELECT apikey FROM STREAMS WHERE id=?", streamID).Scan(&apikey)
	if err != nil {
		log.Error("Unable to get streams with apikey", err)
		return "", err
	}
	return apikey, nil
}

//GetStreamID get stream ID for user and broadcast
func GetStreamID(userID string, broadcastID string) (string, error) {
	db := handlemysql.GetDB()
	var streamID string
	err := db.QueryRow("SELECT id FROM STREAMS WHERE userId=? AND broadcastId=?", userID, broadcastID).Scan(&streamID)
	if err != nil {
		log.Error("Unable to get stream for user broadcast", err)
		return "", err
	}
	return streamID, nil

}
