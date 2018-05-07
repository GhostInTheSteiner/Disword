var formatFunctionList = require("./formatFunctionList")

var formatFunctions = formatFunctionList.items

exports.execute = (builtFormatFunction) => {

    for (var formatFunction in formatFunctions) {
        if (builtFormatFunction.startsWith(formatFunction)) {
            var openingBracketIndex = result.indexOf("(")
            var closingBracketIndex = result.indexOf(")")

            var argumentStr = result.slice(openingBracketIndex + 1, closingBracketIndex)
            var argumentArray = argumentStr.split(",").map(value => value.trim())
            
            return formatFunctions[formatFunction](...argumentArray)
        }
    }
}

exports.functionNames = Object.keys(formatFunctions)