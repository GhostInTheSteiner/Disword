scraperJqueryFactory = require("./scraperJqueryFactory.js")
requestSync = require('request-sync')

var elementInfo
var $

exports.init = (Param_elementInfo) => {
    elementInfo = Param_elementInfo
    $ = Param_$
}

exports.updateJquery = (jquery) => {
    $ = jquery
}

exports.getElementGroups = () => {
    var elementSelectorIsFormatFunction
    var elementSelector
    var elementGroups = {}
    var selectorLinkPathStr

    //.userName: [name1, name2, name3]
    //.userKarma: [100, 300, 10]
    for (var elementInfoName in elementInfo) {
        elementGroups[elementInfoName] = []

        selectorLinkPath.init(elementInfo[elementInfoName])

        elementSelector = selectorLinkPath.getElementSelector()
        selectorLinks = selectorLinkPath.getSelectorLinks()
        
        elementSelectorIsFormatFunction = formatFunction.isFormatFunction(elementSelector)
        elementSelectorIsPath = selectorLinkPath.hasSelectorLink()

        //".userHref|slice(.karma, 0, 4)" || ".userHref|.karma"
        if (elementSelectorIsPath)
            elementSelectorValues = getLinkedPagesValues(selectorLinkPath)
        else
            elementSelectorValues = $(elementSelector)
        
        //elementSelectorValue == "100k"
        for (var elementSelectorValue of elementSelectorValues) {
            //slice(.karma, 0, 4)
            if (elementSelectorIsFormatFunction)
                elementGroups[elementInfoName].push(formatFunction.execute(elementSelectorValue.text()))
            //".karma"
            else
                elementGroups[elementInfoName].push(elementSelectorValue.text())
        }
    }
    return elementGroups
}

function getLinkedPagesValues(selectorLinkPath) {
    var firstSelectorLink = selectorLinkPath.getNextSelectorLink()
    var firstPageSelectorLinkValues = $(firstSelectorLink).toArray()
    var values = []

    for (var firstPageSelectorLinkValue of firstPageSelectorLinkValues) {
        var urlStr = firstPageSelectorLinkValue.attr("href")
        values.push(followSelectorLinks(selectorLinkPath, urlStr))
    }
}

//returns the jquery object containing the first found element of the defined elementSelector
function followSelectorLinks(selectorLinkPath, urlStr) {
    var currentPage = {
        html,
        jquery,
        selectorLink: {
            Str,
            Value
        }
    }

    while (selectorLinkPath.hasSelectorLink()) {
        currentPage.html = requestSync.get("GET", urlStr).getBody()

        currentPage.jquery = scraperJqueryFactory.getJqueryByHtml(currentPage.html)
        currentPage.selectorLink.Str = selectorLinkPath.getNextSelectorLink()

        currentPage.selectorLink.Value = currentPage.jquery(currentPage.selectorLink.Str).first()

        urlStr = currentPage.selectorLink.Value.attr("href")
    }

    return currentPage.jquery(selectorLinkPath.getElementSelector()).first().text()
}