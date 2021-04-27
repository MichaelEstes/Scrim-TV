package handlemysql

import (
	"database/sql"
	"fmt"

	//Loading Driver
	_ "github.com/go-sql-driver/mysql"
)

var db *sql.DB

//ConnectMySQL establish connection with MySQL
func ConnectMySQL() {
	var err error
	db, err = sql.Open(`mysql`, `root:password@tcp(localhost:3306)/SCRIM?parseTime=true`)
	if err != nil {
		fmt.Println("Error opening the DB", err)
	}
	err = db.Ping()
	if err != nil {
		fmt.Println("Error pinging the DB", err)
	}

	fmt.Println(db)
}

//GetDB get MySQL DB instance, check connection here down the line
func GetDB() *sql.DB {
	return db
}
