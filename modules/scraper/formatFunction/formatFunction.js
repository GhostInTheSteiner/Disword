var esprima = require("esprima")

var formatFunctionBuilder = require("./formatFunctionBuilder.js")
var formatFunctionList = require("./formatFunctionList.js")
var formatFunctionListManager = require("./formatFunctionListManager.js")

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
    formatFunctionListManager.functionNames.filter(functionName =>
        textStr.startsWith(functionName)).length > 0

function extractSelector() {
    var functionStrTokenized = esprima.tokenize(functionStr)
    var selectorStrQuoted = functionStrTokenized[2].value
    var selectorStr = selectorStrQuoted.slice(1, selectorStrQuoted.length - 1)

    return selectorStr
}

exports.getSelector = () => selectorStr

exports.execute = (selectorResultStr) =>
    formatFunctionListManager.execute(build(selectorResultStr))
