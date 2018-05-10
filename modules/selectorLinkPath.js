var selectorLinkPath
var selectorLinks
var elementSelector

exports.init = (Param_selectorLinkPath) => {
    var selectorLinkPathGroups = Param_selectorLinkPath.split("|")

    elementSelector = selectorLinkPathGroups.pop()
    selectorLinks = selectorLinkPathGroups
    selectorLinkPath = Param_selectorLinkPath
}

exports.getSelectorLinkPathStr = () => selectorLinkPath

exports.getNextSelectorLink = () =>
    selectorLinks.shift()

exports.hasSelectorLink = () =>
    selectorLinks.length > 0

exports.isOnlySelector = () =>
    selectorLinks.length == 0