request = require('request')
tubo = require('tubo')

formatFunction = require("./formatFunction/formatFunction.js")
selectorLinkPath = require("./selectorLinkPath/selectorLinkPath.js")
scraperElementGroupBuilder = require("./scraperElementGroupBuilder.js")
scraperJqueryFactory = require("./scraperJqueryFactory.js")

$ = {}

elementInfo = {}
nextPageLink = ""
nextPageSelector = ""

exports.init = (Param_NextPageSelector, Param_NextPageLink, Param_elementInfo) => {
    nextPageSelector = Param_NextPageSelector
    nextPageLink = Param_NextPageLink
    elementInfo = Param_elementInfo

    scraperElementGroupBuilder.init(elementInfo)
}

exports.scrapElementGroups = (callback) => {
    request.get(nextPageLink, (err, data) => {
        if (isMessedHtml(data.body)) {
            log.write.warning("HTML of this request was messed.")    
            
            exports.scrapElementGroups(callback)
        }   
        else {
            $ = scraperJqueryFactory.getJqueryByHtml(data.body)
            scraperElementGroupBuilder.updateJquery($)
            callback(scraperElementGroupBuilder.getElementGroups())
        }
    })

}

function isMessedHtml(html) {
    log.write.info("isMessedHtml was called.")        
    
    return html.startsWith("<!DOCTYPE")
}

function getNextPageLink(selectorJquery) {
    return $(selectorJquery).attr("href")
}