package user

//LoginRequest struct type
type LoginRequest struct {
	Email    string `json:"email,omitempty"`
	Password string `json:"password,omitempty"`
}

//Login facilitates login
func Login(request LoginRequest) (User, bool) {
	var requestHash string
	var user User

	if request.Email != "" {
		user = GetLoginInfoByEmail(request.Email)
		requestHash = hash(user.Salt + request.Password)
	} else {
		return user, false
	}
	if requestHash == user.Password {
		return user, true
	}

	return user, false
}
