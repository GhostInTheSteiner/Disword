jquery = require("jquery")
jsdom = require('jsdom')
requestSync = require('request-sync')
request = require('request')
tubo = require('tubo')

formatFunction = require("./formatFunction/formatFunction.js")
log = require("./log.js")
selectorLinkPath = require("./selectorLinkPath.js")

$ = {}

elementInfo = {}
nextPageLink = ""
nextPageSelector = ""

self = this

exports.setOptions = (Param_NextPageSelector, Param_NextPageLink, Param_elementInfo) => {
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
            loadJquery(err, data)
            nextPageLink = getNextPageLink(nextPageSelector)
            tubo(elementInfo, getElementGroups, callback)
        }
    })

}

function loadJquery(err, data) {
    log.write.info("loadJquery was called.")
    
    tubo(data.body, getJqueryByHtml, setGlobalJquery)
}

function setGlobalJquery(jquery) {
    log.write.info("setGlobalJquery was called.")     

    $ = jquery
}

function getNextPageLink(selectorJquery) {
    log.write.info("getNextPageLink was called.")    

    return $(selectorJquery).attr("href")
}

function isMessedHtml(html) {
    log.write.info("isMessedHtml was called.")        

    return html.startsWith("<!DOCTYPE")
}

function getJqueryByHtml(html) {
    log.write.info("getJqueryByHtml was called.")
    
    var document = new jsdom.JSDOM(html);
    var window = document.window;
    
    return jquery(window);
}

function getJqueryByUrlSync(urlStr) {
    return getJqueryByHtml(requestSync.get("GET", urlStr).getBody())
}

function followSelectorLinks(selectorLinkPath) {
    var currentPageJquery = $

    while (selectorLinkPath.hasSelectorLink()) {
        currentPageJquery = getJqueryByUrlSync(currentPageJquery(selectorLinkPath.getNextSelectorLink()).text())
    }

    return currentPageJquery(selectorLinkPath.elementSelector).text()
}

function getElementGroups(elementInfo) {
    var elementSelectorIsFormatFunction
    var elementSelector
    var elementGroups = {}
    var selectorLinkPathStr

    for (elementInfoName in elementInfo) {
        elementGroups[elementInfoName] = []

        selectorLinkPath.init(elementInfo[elementInfoName])

        elementSelector = selectorLinkPath.getElementSelector()
        elementSelectorIsFormatFunction = formatFunction.isFormatFunction(elementSelector)

        if (elementSelectorIsFormatFunction) {
            formatFunction.init(elementSelector)
            elementSelector = formatFunction.getSelector()
        }

        elementSelectorValues = $(elementSelector)

        for (var elementSelectorValue of elementSelectorValues) {
            if (selectorLinkPath.isOnlySelector()) {
                if (elementSelectorIsFormatFunction)
                    elementGroups[elementInfoName].push(formatFunction.execute(elementSelectorValue))
                else
                    elementGroups[elementInfoName].push(elementSelectorValue.text())                    
            } else {
                elementGroups[elementInfoName].push(followSelectorLinks(selectorLinkPath.getSelectorLinkPathStr()))
            }
        }


    }

    return elementGroups
}