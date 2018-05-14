replaceall = require("replaceall")

exports.replaceSelectorWithResult = (functionStr, selectorStr, selectorResultStr) => {
    selectorResultStr = replaceall("\"", "\\\"", selectorResultStr)
    
    return functionStr.replace("'" + selectorStr + "'", selectorResultStr)
}