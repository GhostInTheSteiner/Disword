var formatFunctionBuilder = require("./formatFunctionBuilder")
var formatFunctionList = require("./formatFunctionList")
var formatFunctionManager = require("./formatFunctionManager")

var functionStr

exports.init = (Param_functionStr) =>
    functionStr = Param_functionStr

exports.build = (selectorResult) =>
    formatFunctionBuilder.replaceSelectorWithResult(functionStr, selectorResult)

exports.isFormatFunction = (elementInfoValue) =>
    formatFunctionManager.functionNames.filter(functionName =>
        elementInfoValue.startsWith(functionName)).length > 1

exports.execute = (builtFormatFunction) =>
    formatFunctionManager.execute(builtFormatFunction)
