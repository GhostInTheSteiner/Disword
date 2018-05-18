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
    var functionStrWithResult = formatFunctionBuilder.replaceSelectorWithResult(functionStr, selectorStr, selectorResultStr)
    var functionStrWithResultAndThis = formatFunctionBuilder.addThisBeforeFunctionName(functionStrWithResult, formatFunctionListManager.functionNames)

    return functionStrWithResultAndThis
}

exports.isFormatFunction = (textStr) =>
    formatFunctionListManager.functionNames.filter(functionName =>
        textStr.startsWith(functionName)).length > 0

function extractSelector() {
    var selectorStrQuoted = esprima.tokenize(functionStr).filter(token => token.value.match(/'.*'/))[0].value
    var selectorStr = selectorStrQuoted.slice(1, selectorStrQuoted.length - 1)

    return selectorStr
}

exports.getSelector = () => selectorStr

exports.execute = (selectorResultStr) =>
    formatFunctionListManager.execute(build(selectorResultStr))
