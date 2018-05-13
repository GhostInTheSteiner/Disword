var requestSync = require('sync-request')

var selectorLinkPath = require("./selectorLinkPath/selectorLinkPath.js")
var formatFunction = require("./formatFunction/formatFunction.js")
var scraperJqueryFactory = require("./scraperJqueryFactory.js")
var log = require("../log.js")

var pageBaseUrl
var elementInfo
var $

exports.init = (Param_elementInfo, Param_pageBaseUrl) => {
    elementInfo = Param_elementInfo
    pageBaseUrl = Param_pageBaseUrl
}

exports.updateJquery = (jquery) => {
    $ = jquery
}

exports.getElementGroups = () => {
    var elementSelectorIsFormatFunction
    var elementSelector
    var elementGroups = {}
    var selectorLinkPathStr
    var elementSelectorValues

    //.userName: [name1, name2, name3]
    //.userKarma: [100, 300, 10]
    for (var elementInfoName in elementInfo) {
        elementGroups[elementInfoName] = []

        selectorLinkPath.init(elementInfo[elementInfoName])
        elementSelector = selectorLinkPath.getElementSelector()
        
        elementSelectorIsFormatFunction = formatFunction.isFormatFunction(elementSelector)
        elementSelectorInPath = selectorLinkPath.hasSelectorLink()

        //"slice(.karma, 0, 4)"     ||      ".userHref|slice(.karma, 0, 4)"
        if (elementSelectorIsFormatFunction) {
            var formatFunctionStr = elementSelector
            formatFunction.init(formatFunctionStr)
            
            elementSelector = formatFunction.getSelector()
            
            if (elementSelectorInPath) {
                selectorLinkPath.setElementSelector(elementSelector)
                elementSelectorValues = $(getLinkedPagesValues(selectorLinkPath))                
            } else {
                elementSelectorValues = $(elementSelector)
            }
        //".karma"                  ||      ".userHref|.karma"
        } else {
            if (elementSelectorInPath) {
                elementSelectorValues = $(getLinkedPagesValues(selectorLinkPath))
            } else {
                elementSelectorValues = $(elementSelector)
            }
        }
        
        //elementSelectorValue == "100k"
        for (var elementSelectorValue of elementSelectorValues) {
            //slice(.karma, 0, 4)
            if (elementSelectorIsFormatFunction)
                elementGroups[elementInfoName].push(formatFunction.execute(elementSelectorValue.textContent))
            //".karma"
            else
                elementGroups[elementInfoName].push(elementSelectorValue.textContent)
        }
    }
    return elementGroups
}

function getLinkedPagesValues(selectorLinkPath) {
    log.write.warning("Starting to scrap further pages links, this will take some time.")    

    var firstSelectorLink = selectorLinkPath.getSelectorLinks()[0]
    var firstPageSelectorLinkValues = $(firstSelectorLink).toArray()
    var values = []
    var href
    var selectorLinkCurrent = 0

    log.write.info(firstPageSelectorLinkValues.length - 1 + " links to further pages existent.")

    for (var firstPageSelectorLinkValue of firstPageSelectorLinkValues) {
        selectorLinkPathIterator = selectorLinkPath.getIterator() 
        selectorLinkPathIterator.next()       
        href = firstPageSelectorLinkValue.href
        urlStr = getFullUrl(href)
        values.push(followOtherSelectorLinks(selectorLinkPathIterator, selectorLinkPath, urlStr))

        log.write.info(++selectorLinkCurrent + ". link was scraped.")    
    }

    return values
}

//returns the jquery object containing the first found element of the defined elementSelector
function followOtherSelectorLinks(selectorLinkPathIterator, selectorLinkPath, urlStr) {
    var currentPage = {
        html: null,
        jquery: null,
        selectorLink: {
            str: null,
            value: null
        }
    }

    var selectorLinkPathIteratorItem

    while ((selectorLinkPathIteratorItem = selectorLinkPathIterator.next()).value) {
        currentPage.html = requestSync("GET", urlStr).getBody()

        currentPage.jquery = scraperJqueryFactory.getJqueryByHtml(currentPage.html)
        currentPage.selectorLink.str = selectorLinkPathIteratorItem.value

        currentPage.selectorLink.value = currentPage.jquery(currentPage.selectorLink.str)[0]

        urlStr = getFullUrl(currentPage.selectorLink.value.href)
    }

    
    currentPage.html = requestSync("GET", urlStr).getBody()    
    currentPage.jquery = scraperJqueryFactory.getJqueryByHtml(currentPage.html)

    return currentPage.jquery(selectorLinkPath.getElementSelector())[0] ? currentPage.jquery(selectorLinkPath.getElementSelector())[0] : currentPage.jquery("div")[0]
}

function getFullUrl(href) {
    if (href.startsWith("http"))
        return href
    else
        return pageBaseUrl + href
}