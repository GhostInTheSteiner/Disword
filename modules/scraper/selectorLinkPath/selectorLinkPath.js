var selectorLinkPath
var elementSelector
var selectorLinks

exports.init = (Param_selectorLinkPath) => {
    var selectorLinkPathGroups = Param_selectorLinkPath.split("|")

    elementSelector = selectorLinkPathGroups.pop()
    selectorLinks = selectorLinkPathGroups
    selectorLinkPath = Param_selectorLinkPath
}

exports.getSelectorLinkPathStr = () => selectorLinkPath

exports.hasSelectorLink = () =>
    selectorLinks.length > 0

exports.getIterator = () =>
    selectorLinks[Symbol.iterator]()

exports.getSelectorLinks = () => selectorLinks

exports.getElementSelector = () =>
    elementSelector

exports.setElementSelector = (Param_elementSelector) =>
    elementSelector = Param_elementSelector

exports.isOnlySelector = () =>
    selectorLinks.length == 0