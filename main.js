fileStream = require('fs')
tubo = require('tubo')

tableObjectFactory = require("./modules/tableObjectFactory.js")
log = require("./modules/log.js")
connection = require("./modules/connection.js")
database = require("./modules/database.js")

currentPage = 0
config = {}
tableObject = []

fileStream.readFile("config", start)

function beginDataScrap() {
    connection.setOptions(config.nextPageSelector, config.scrapedPage, config.elementInfo)
    connection.scrapElementGroups(processElementGroups)
}

function start(err, data) {
    loadConfig(err, data)
    beginDataScrap()
}

function loadConfig(err, data) {
    config = JSON.parse(data)
}

function processElementGroups(elementGroups) {
    log.write.info("processElementGroups was called.")    

    tableObject = tubo(elementGroups, tableObjectFactory.create, concatGlobalTableObject)
    
    log.write.info("tableObject has " + tableObject.length + " items.")
    
    currentPage++
    
    if (currentPage < config.maxPages) {
        log.write.group("Finished fetching data of " + currentPage + ". page, moving on with the next one.")
        
        connection.scrapElementGroups(processElementGroups)    
    } else {
        log.write.group("Finished fetching data of last one, writing it to database now.")        

        database.write(tableObject, config.tableName)
    }
}

function concatGlobalTableObject(tableObjectNew) {
    return tableObject.concat(tableObjectNew)
}