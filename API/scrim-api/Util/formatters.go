package util

import (
	"fmt"
	"time"

	log "github.com/sirupsen/logrus"
)

//FormatTime get the minutes, hours or day from a timeStamp
func FormatTime(timeStamp string, live bool) string {
	//layout := "2006-01-02T15:04:05.00Z"
	t, err := time.Parse(time.RFC3339, timeStamp)
	if err != nil {
		log.Error(err)
		return ""
	}

	duration := time.Since(t)
	hours := int(duration.Hours())
	if hours <= 12 {
		minutes := int(duration.Minutes())
		if minutes <= 60 {
			minutesString := "minutes"
			if minutes == 1 {
				minutesString = "minute"
			}
			return fmt.Sprintf("%v %v ago", minutes, minutesString)
		}
		hoursString := "hours"
		if hours == 1 {
			hoursString = "hour"
		}
		return fmt.Sprintf("%v %v ago", hours, hoursString)
	}

	if t.Year() != time.Now().Year() {
		return t.Format("Jan 02 2006")
	}
	return t.Format("Jan 02")
}

//FormatDate, either with year if year not this year or without
func FormatDate(timeStamp string) string {
	t, err := time.Parse(time.RFC3339, timeStamp)
	if err != nil {
		log.Error(err)
		return ""
	}

	if t.Year() != time.Now().Year() {
		return t.Format("Jan 02 2006")
	}
	return t.Format("Jan 02")
}
