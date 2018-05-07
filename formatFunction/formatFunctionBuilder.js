function replaceSelectorWithResult(functionStr, selectorResult) {

}

function isFilterFunction(elementInfoValue) {
    
}

function getSelectorFromFilterFunction(elementInfoValueStr) {
    var openingBracketIndex = elementInfoValue.indexOf("(")
    var commaIndex = elementInfoValue.indexOf(",")

    var elementInfoValueSelector = elementInfoValueStr.slice(openingBracketIndex + 1, commaIndex)

    return elementInfoValueSelector
}