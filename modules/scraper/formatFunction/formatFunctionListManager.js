esprima = require("esprima")

var formatFunctionList = require("./formatFunctionList")

var formatFunctions = formatFunctionList.items

exports.execute = (builtFormatFunction) => {
    var builtFormatFunctionTokenized

    for (var formatFunctionName in formatFunctions) {
        builtFormatFunctionTokenized = esprima.tokenize(builtFormatFunction)

        builtFormatFunctionName = builtFormatFunctionTokenized[0].value
        
        builtFormatFunctionParamTokens = builtFormatFunctionTokenized.slice(2, builtFormatFunctionTokenized.length - 1)
        
        var currentToken = 0

        builtFormatFunctionParams = builtFormatFunctionParamTokens.filter(token => currentToken++ % 2 == 0).map(token => token.value)

        if (builtFormatFunctionName == formatFunctionName) {
            return formatFunctions[formatFunctionName](...builtFormatFunctionParams)
        }
    }
}

exports.functionNames = Object.keys(formatFunctions)