var formatFunctionList = require("./formatFunctionList")

var formatFunctions = formatFunctionList.items

exports.execute = (builtFormatFunction) => {

    for (var formatFunction in formatFunctions) {
        if (builtFormatFunction.startsWith(formatFunction)) {
            var openingBracketIndex = builtFormatFunction.indexOf("(")
            var closingBracketIndex = builtFormatFunction.indexOf(")")

            var argumentStr = builtFormatFunction.slice(openingBracketIndex + 1, closingBracketIndex)
            var argumentArray = argumentStr.split(",").map(value => value.trim())
            
            return formatFunctions[formatFunction](...argumentArray)
        }
    }
}

exports.functionNames = Object.keys(formatFunctions)