import express from 'express'
import mysql from 'mysql'
import bodyParser from 'body-parser'
import mysqlConfig from './config/mysql'
import routes from './Routes'

const db = mysql.createConnection(mysqlConfig)
db.connect((err) => {
    if (err) throw err
    console.log("Connected to MYSQL")
})

const app = express()

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

routes({app, db})
app.listen(8080)