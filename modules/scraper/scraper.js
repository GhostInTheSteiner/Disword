request = require('request')
tubo = require('tubo')

formatFunction = require("./formatFunction/formatFunction.js")
selectorLinkPath = require("./selectorLinkPath.js")
scraperElementGroupBuilder = require("./scraperElementGroupBuilder")
scraperJqueryFactory = require("./scraperJqueryFactory.js")

$ = {}

elementInfo = {}
nextPageLink = ""
nextPageSelector = ""

exports.init = (Param_NextPageSelector, Param_NextPageLink, Param_elementInfo) => {
    nextPageSelector = Param_NextPageSelector
    nextPageLink = Param_NextPageLink
    elementInfo = Param_elementInfo

}

exports.scrapElementGroups = (callback) => {
    request.get(nextPageLink, (err, data) => {
        if (isMessedHtml(data.body)) {
            log.write.warning("HTML of this request was messed.")    
            
            exports.scrapElementGroups(callback)
        }   
        else {
            $ = scraperJqueryFactory.getJqueryByHtml(data.body)
            scraperElementGroupBuilder.init($, elementInfo)
            callback(scraperElementGroupBuilder.getNextElementGroups())
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