replaceall = require('replaceall')

function FormatFunctions() {
    this.slice = (value, from, length) =>
        value.slice(from, length)

    this.trim = (value) =>
        value.trim()

    this.replace = (value, oldStr, newStr) =>
        replaceall(oldStr, newStr, value)
}

exports.getFormatFunctions = () =>
    new FormatFunctions()