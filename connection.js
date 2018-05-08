jquery = require("jquery")
jsdom = require('jsdom')
request = require('request')
tubo = require('tubo')

formatFunction = require("./formatFunction.js")
log = require("./log.js")

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

function fetchNextPageHtml(urlStr, callback) {
    log.write.info("fetchNextPageHtml was called.")
    
    setTimeout(() => {
            log.write.info("setTimeout callback was called.")
            request.get(urlStr, (err, data) => {
                tubo(getValidHtml(err, data), callback)
            })
        },
        config.loadPageDelay)
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

function getElementGroups(elementInfo) {
    var elementGroupValuesJquery
    var elementGroups = {}
    var valueIsFormatFunction
    var selectorStr
    var elementGroupValueHtmlText

    for (elementInfoName in elementInfo) {
        elementGroups[elementInfoName] = []

        elementInfoValue = elementInfo[elementInfoName]

        valueIsFormatFunction = formatFunction.isFormatFunction(elementInfoValue)

        if (valueIsFormatFunction) {
            formatFunction.init(elementInfoValue)
            selectorStr = formatFunction.getSelector()

            elementGroupValuesJquery = $(selectorStr)
        } else
            elementGroupValuesJquery = $(elementInfoValue)

        for (var elementGroupValueHtml of elementGroupValuesJquery) {
            elementGroupValueHtmlText = elementGroupValueHtml.textContent

            if (valueIsFormatFunction)
                elementGroupValueHtmlText = formatFunction.execute(elementGroupValueHtmlText)

            elementGroups[elementInfoName].push(elementGroupValueHtmlText)
        }
    }

    return elementGroups
}