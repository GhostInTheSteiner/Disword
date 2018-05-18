replaceall = require("replaceall")
esprima = require("esprima")

exports.replaceSelectorWithResult = (functionStr, selectorStr, selectorResultStr) => {
    selectorResultStr = "'" + replaceall("'", "\\'", selectorResultStr) + "'"
    
    return functionStr.replace("'" + selectorStr + "'", selectorResultStr)
}

exports.addThisBeforeFunctionName = (functionStr, formatFunctionNames) => {
    var functionStrTokenized = esprima.tokenize(functionStr)

    var functionStrWithThisArray = functionStrTokenized.map(token => formatFunctionNames.includes(token.value) ? "this." + token.value : token.value)
    var functionStrWithThis = functionStrWithThisArray.join('')

    return functionStrWithThis
}