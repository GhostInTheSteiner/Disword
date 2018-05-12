var request = require('request')
var tubo = require('tubo')

var formatFunction = require("./formatFunction/formatFunction.js")
var selectorLinkPath = require("./selectorLinkPath/selectorLinkPath.js")

var scraperElementGroupBuilder = require("./scraperElementGroupBuilder.js")
var scraperJqueryFactory = require("./scraperJqueryFactory.js")

var $ = {}

var elementInfo = {}
var nextPageLink = ""
var nextPageSelector = ""

exports.init = (Param_NextPageSelector, Param_NextPageLink, Param_elementInfo) => {
    nextPageSelector = Param_NextPageSelector
    nextPageLink = Param_NextPageLink
    elementInfo = Param_elementInfo

    var pageBaseUrl = nextPageLink.match(/^.+?[^\/:](?=[?\/]|$)/)[0]

    scraperElementGroupBuilder.init(elementInfo, pageBaseUrl)
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
            nextPageLink = getNextPageLink(nextPageSelector)
            callback(scraperElementGroupBuilder.getElementGroups())
        }
    })

}

function isMessedHtml(html) {
    log.write.info("isMessedHtml was called.")        
    
    return html.startsWith("<!DOCTYPE")
}

function getNextPageLink(selectorJquery) {
    return $(selectorJquery)[0].href
}