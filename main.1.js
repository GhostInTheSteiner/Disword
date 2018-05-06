fileStream = require('fs')
request = require('request')
tubo = require('tubo')
jquery = require("jquery")
jsdom = require('jsdom')
sqlite3 = require('sqlite3')
replaceall = require('replaceall')

isNumber = require('is-number')
isBoolean = require('boolean')
isDate = require('is-valid-date')
isString = require('is-string')

currentPage = 1
config = {}
tableObject = []

$ = {}

fileStream.readFile("config", loadConfig)

function loadConfig(err, data) {
    config = JSON.parse(data)
    init()
}

function init() {
    request.get(config.scrapedPage, loadJquery)
}

function loadJquery(err, data) {
    writeOnConsoleInfo("loadJquery was called.") 
    
    tubo(data.body, getJqueryByHtml, setGlobalJquery, process)
}

function process() {
    tableObject = tubo(scrapElements(config.elementInfo), convertToTableObject, concatGlobalTableObject)
    
    writeOnConsoleInfo("tableObject has " + tableObject.length + " items.")
    
    if (currentPage < config.maxPages) {
        writeOnConsoleGroup("Finished fetching data of " + currentPage + ". page, moving on with the next one.")
        
        tubo(config.nextPageSelector, getNextPageLink, fetchNextPageData)
    } else {
        writeOnConsoleGroup("Finished fetching data of last one, writing it to database now.")        

        var tagTypes = tubo(tableObject[0], GetTypes)
        createTable(tableObject, tagTypes, config.tableName)
    }
}

function concatGlobalTableObject(tableObjectNew) {
    return tableObject.concat(tableObjectNew)
}

function setGlobalJquery(jquery) {
    writeOnConsoleInfo("setGlobalJquery was called.")     

    $ = jquery
}

function getNextPageLink(selectorJquery) {
    writeOnConsoleInfo("getNextPageLink was called.")    

    return $(selectorJquery).attr("href")
}

function fetchNextPageData(urlStr) {
    writeOnConsoleInfo("fetchNextPageData was called.")

    
    setTimeout(() => {
            writeOnConsoleInfo("setTimeout callback was called.")
            request.get(urlStr, getValidHtml)
        },
        config.loadPageDelay)
    }
    
function getValidHtml(err, data) {
    writeOnConsoleInfo("getValidHtml was called.")
    
    if (err) {
        writeOnConsoleError(err.message)
    }

    if (isMessedHtml(data.body)) {
        writeOnConsoleWarning("HTML of this request was messed.")    

        fetchNextPageData(data.request.href)
    } else {
        currentPage++
        loadJquery(err, data)
    }
        
}

function isMessedHtml(html) {
    writeOnConsoleInfo("isMessedHtml was called.")        

    return html.startsWith("<!DOCTYPE")
}

function getJqueryByHtml(html) {
    writeOnConsoleInfo("getJqueryByHtml was called.")
    
    var document = new jsdom.JSDOM(html);
    var window = document.window;
    
    return jquery(window);
}

function getTableNameWithTimestamp(tableName) {
    var ISODate = new Date().toISOString()

    var ISODate = replaceall(":", "_", ISODate)
    var ISODate = replaceall("-", "_", ISODate)
    var ISODate = replaceall(".", "_", ISODate)
    var ISODate = replaceall("T", "_", ISODate)    

    return tableName + "_" + ISODate
}

function scrapElements(elementInfo) {
    var elementGroups = {}

    for (elementInfoName in elementInfo) {
        elementGroups[elementInfoName] = []
        elementGroupValuesJquery = $(elementInfo[elementInfoName])

        for (elementGroupValueHtml of elementGroupValuesJquery)
            elementGroups[elementInfoName].push(elementGroupValueHtml.textContent)
    }

    return elementGroups
}

//field 1: 1 => field 1: 1
//         2    field 2: 1
//         3    field 3: 1
function convertToTableObject(elementGroups) {
    var elementGroupKeyFirst = Object.keys(elementGroups)[0]
    var elementGroupValuesFirst = elementGroups[elementGroupKeyFirst]
    var elementGroupKeys = Object.keys(elementGroups)
    var elementGroupValuesLength = elementGroupValuesFirst.length
    var elementGroupKeysLength = elementGroupKeys.length  

    var tableObject = createTableObject(elementGroupKeysLength, elementGroupValuesLength)
    
    for (var field = 0; field < elementGroupKeysLength; field++)
        for (var row = 0; row < elementGroupValuesLength; row++)
            tableObject[row][elementGroupKeys[field]] = getElementGroupValue(elementGroups, row, field)

    return tableObject
}

function getElementGroupValue(elementGroups, rowNumber, fieldNumber) {
    elementGroupKey = Object.keys(elementGroups)[fieldNumber]
    elementGroupValues = elementGroups[elementGroupKey]
    elementGroupValue = elementGroupValues[rowNumber]

    return elementGroupValue
}

function createTableObject(fieldNumber, rowNumber) {
    var tableObject = []

    for (var row = 0; row < rowNumber; row++)
        tableObject.push({})

    return tableObject
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

function createTable(tableObject, tagTypes, tableName) {
    writeOnConsoleInfo("createTable was called.")       

    var database = new sqlite3.Database(config.databaseName)
    var fields = ""
    var parameters = ""

    for (var tagName in tagTypes) {
        fields += tagName + " " + tagTypes[tagName] + ", "
        parameters += "?, "
    }

    parameters = parameters.slice(0, parameters.length - 2)  
    fields = fields.slice(0, fields.length - 2)

    var tableNameWithTimestamp = getTableNameWithTimestamp(tableName)

    var createTableStr = "CREATE TABLE '" + tableNameWithTimestamp + "' (" + fields + ")"

    database.exec(createTableStr)

    writeOnConsoleInfo(tableNameWithTimestamp + " was created.")      

    var insertRecordStr = "INSERT INTO '" + tableNameWithTimestamp + "' VALUES (" + parameters + ")"

    for (var tableObjectRow of tableObject)
        database.run(insertRecordStr, Object.values(tableObjectRow))

    writeOnConsoleInfo("Data was inserted.")    
}

function writeOnConsoleError(message) {
    console.log("ERROR: " + message)
}

function writeOnConsoleInfo(message) {
    console.log("INFO: " + message)
}

function writeOnConsoleGroup(message) {
    console.log("\nGROUP: " + message + "\n")
}

function writeOnConsoleWarning(message) {
    console.log("WARNING: " + message)
}