var formatFunctionList = require("./formatFunctionList")

var formatFunctions = formatFunctionList.items

exports.formatElementValue = (elementInfoValue) => {
    for (var formatFunction in formatFunctions) {
        if (elementInfoValue.startsWith(formatFunction)) {
            var openingBracketIndex = elementInfoValue.indexOf("(")
            var closingBracketIndex = elementInfoValue.indexOf(")")

            var argumentStr = elementInfoValue.slice(openingBracketIndex + 1, closingBracketIndex)
            var argumentArray = argumentStr.split(",").map(value => value.trim())
            
            return formatFunctions[formatFunction](...argumentArray)
        }
    }
}