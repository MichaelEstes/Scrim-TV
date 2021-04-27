package user

import (
	"bitbucket.org/scrim-api/SQL"
	"github.com/google/uuid"
	log "github.com/sirupsen/logrus"
)

// APIKey apikey struct
type APIKey struct {
	ID         string `json:"id,omitempty"`
	UserID     string `json:"userId,omitempty"`
	DeviceName string `json:"deviceName,omitempty"`
}

//GetApikeysByUser Get the user's apikeys
func GetApikeysByUser(userID string) ([]APIKey, error) {
	var apikeys []APIKey
	var db = handlemysql.GetDB()
	rows, err := db.Query("SELECT id, userId, deviceName FROM APIKEYS WHERE userId=?", userID)
	if err != nil {
		log.Error(err)
		return apikeys, err
	}

	for rows.Next() {
		var apikey APIKey
		err = rows.Scan(&apikey.ID, &apikey.UserID, &apikey.DeviceName)
		if apikey.ID != "" {
			apikeys = append(apikeys, apikey)
		}
	}
	return apikeys, nil
}

//GetDeviceNameByApikey get the device name by apikey
func GetDeviceNameByApikey(apiKey string) (string, error) {
	db := handlemysql.GetDB()
	var deviceName string
	err := db.QueryRow("SELECT deviceName FROM APIKEYS WHERE id=?", apiKey).Scan(&deviceName)
	if err != nil {
		log.Error(err)
		return "", err
	}
	return deviceName, nil
}

//CreateApikey create apikey
func CreateApikey(apikey APIKey) (string, error) {
	db := handlemysql.GetDB()
	apikeyID := uuid.New().String()
	_, err := db.Exec("INSERT INTO APIKEYS (id, userId, deviceName) VALUES (?,?,?)", apikeyID, apikey.UserID, apikey.DeviceName)
	if err != nil {
		log.Error(err)
		return "", err
	}
	return apikeyID, nil
}
