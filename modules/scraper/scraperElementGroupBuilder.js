scraperJqueryFactory = require("./scraperJqueryFactory.js")
requestSync = require('request-sync')

var elementInfo
var $

exports.init = (Param_$, Param_elementInfo) => {
    nextPageLink = getNextPageLink(Param_nextPageSelector)
    elementInfo = Param_elementInfo
    $ = Param_$
}

exports.getElementGroups = () => {
    var elementSelectorIsFormatFunction
    var elementSelector
    var elementGroups = {}
    var selectorLinkPathStr

    for (var elementInfoName in elementInfo) {
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



function getJqueryByUrl(urlStr) {
    return scraperJqueryFactory.getJqueryByHtml(requestSync.get("GET", urlStr).getBody())
}

function followSelectorLinks(selectorLinkPath) {
    var currentPageJquery = $

    while (selectorLinkPath.hasSelectorLink()) {
        urlStr = selectorLinkPath.getNextSelectorLink().text()
        html = requestSync.get("GET", urlStr).getBody()
        currentPageJquery = scraperJqueryFactory.getJqueryByHtml(html)
    }

    return currentPageJquery(selectorLinkPath.elementSelector).text()
}
