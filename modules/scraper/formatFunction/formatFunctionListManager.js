var formatFunctionList = require("./formatFunctionList")

var formatFunctions = formatFunctionList.getFormatFunctions()

exports.execute = (builtFormatFunction) =>
    evalInContext(builtFormatFunction, formatFunctions)

function evalInContext(js, context) {
    return function() { return eval(js) }.call(context)
}

exports.functionNames = Object.keys(formatFunctions)