import express from 'express'
import mysql from 'mysql'
import mysqlConfig from './src/config/mysql'
import routes from './src/Routes'
const con = mysql.createConnection(mysqlConfig)
con.connect((err)=>{
    if (err) throw err
    console.log("Connected to MYSQL")
})
const app = express()
routes(app, con)
app.listen(3000)