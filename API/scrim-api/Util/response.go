package util

//Response struct object
type Response struct {
	Status status      `json:"status"`
	Data   interface{} `json:"data"`
}

type status struct {
	Message string      `json:"message"`
	Error   interface{} `json:"error,omitempty"`
}
