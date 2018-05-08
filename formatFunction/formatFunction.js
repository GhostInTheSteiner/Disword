var formatFunctionBuilder = require("./formatFunctionBuilder")
var formatFunctionList = require("./formatFunctionList")
var formatFunctionManager = require("./formatFunctionManager")

var builtFunctionStr
var functionStr
var selectorStr

exports.init = (Param_functionStr) => {
    functionStr = Param_functionStr

    selectorStr = extractSelector()
}

function build(selectorResultStr)
    formatFunctionBuilder.replaceSelectorWithResult(functionStr, selectorStr, selectorResultStr)

exports.isFormatFunction = () =>
    formatFunctionManager.functionNames.filter(functionName =>
        functionStr.startsWith(functionName)).length > 1

function extractSelector() {
    var openingBracketIndex = functionStr.indexOf("(")
    var commaIndex = functionStr.indexOf(",")
        
    var selectorStr = functionStr.slice(openingBracketIndex + 1, commaIndex)
        
    return selectorStr
}

exports.getSelector = () => selectorStr

exports.execute = (selectorResultStr) =>
    formatFunctionManager.execute(build(selectorResultStr))
