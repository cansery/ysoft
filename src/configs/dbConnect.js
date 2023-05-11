require('dotenv').config()

const { Sequelize } = require('sequelize')

const databaseName = process.env.dbName
const databaseUser = process.env.dbUserName
const databasePass = process.env.dbPassword

const serverObject = {
    dialect: 'postgres',
    host: process.env.dbHost,
    port: process.env.dbPort,
    encrypt: false,
    logging: false,
}

const SequelizeConnection = new Sequelize(databaseName, databaseUser, databasePass, serverObject)
module.exports = SequelizeConnection