sqlite3 = require('sqlite3')
replaceall = require('replaceall')

isNumber = require('is-number')
isBoolean = require('boolean')
isDate = require('is-valid-date')
isString = require('is-string')

log = require("./log.js")

exports.write = (tableObject, tableName) => {
    var tableNameWithTimestamp = getTableNameWithTimestamp(tableName)
    var tagTypes = GetTypes(tableObject[0])

    createTable(tableObject, tagTypes, tableNameWithTimestamp)
}

//first row has to be passed
function GetTypes(tableObjectRow) {
    var tagTypes = {}

    for (tableObjectFieldName in tableObjectRow) {
        if (isNumber(tableObjectRow[tableObjectFieldName])) tagTypes[tableObjectFieldName] = "REAL"
        if (isDate(tableObjectRow[tableObjectFieldName])) tagTypes[tableObjectFieldName] = "TEXT"
        if (isBoolean(tableObjectRow[tableObjectFieldName])) tagTypes[tableObjectFieldName] = "INTEGER"
        if (isString(tableObjectRow[tableObjectFieldName])) tagTypes[tableObjectFieldName] = "TEXT"
    }

    return tagTypes
}

function getTableNameWithTimestamp(tableName) {
    var ISODate = new Date().toISOString()

    var ISODate = replaceall(":", "_", ISODate)
    var ISODate = replaceall("-", "_", ISODate)
    var ISODate = replaceall(".", "_", ISODate)
    var ISODate = replaceall("T", "_", ISODate)    

    return tableName + "_" + ISODate
}

function createTable(tableObject, tagTypes, tableNameWithTimestamp) {
    log.write.info("createTable was called.")       

    var database = new sqlite3.Database(config.databaseName)
    var fields = ""
    var parameters = ""

    for (var tagName in tagTypes) {
        fields += tagName + " " + tagTypes[tagName] + ", "
        parameters += "?, "
    }

    parameters = parameters.slice(0, parameters.length - 2)  
    fields = fields.slice(0, fields.length - 2)

    var createTableStr = "CREATE TABLE '" + tableNameWithTimestamp + "' (" + fields + ")"

    database.exec(createTableStr)

    log.write.info(tableNameWithTimestamp + " was created.")      

    var insertRecordStr = "INSERT INTO '" + tableNameWithTimestamp + "' VALUES (" + parameters + ")"

    for (var tableObjectRow of tableObject)
        database.run(insertRecordStr, Object.values(tableObjectRow))

    log.write.info("Data was inserted.")    
}