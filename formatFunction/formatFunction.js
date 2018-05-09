var formatFunctionBuilder = require("./formatFunctionBuilder.js")
var formatFunctionList = require("./formatFunctionList.js")
var formatFunctionManager = require("./formatFunctionManager.js")

var builtFunctionStr
var functionStr
var selectorStr

exports.init = (Param_functionStr) => {
    functionStr = Param_functionStr

    selectorStr = extractSelector()
}

function build(selectorResultStr) {
    return formatFunctionBuilder.replaceSelectorWithResult(functionStr, selectorStr, selectorResultStr)
}

exports.isFormatFunction = (textStr) =>
    formatFunctionManager.functionNames.filter(functionName =>
        textStr.startsWith(functionName)).length > 0

function extractSelector() {
    var openingBracketIndex = functionStr.indexOf("(")
    var commaIndex = functionStr.indexOf(",")
        
    var selectorStr = functionStr.slice(openingBracketIndex + 1, commaIndex)
        
    return selectorStr
}

exports.getSelector = () => selectorStr

exports.execute = (selectorResultStr) =>
    formatFunctionManager.execute(build(selectorResultStr))
