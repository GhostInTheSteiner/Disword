var selectorLinkPathIterator = require('./selectorLinkPathIterator.js')

var selectorLinkPath
var elementSelector
var selectorLinks

var selectorLinksIterator

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
    selectorLinksIterator = selectorLinks[Symbol.iterator]()

exports.getSelectorLinks = () => selectorLinks

exports.getElementSelector = () =>
    elementSelector

exports.setElementSelector = (Param_elementSelector) =>
    elementSelector = Param_elementSelector

exports.isOnlySelector = () =>
    selectorLinks.length == 0