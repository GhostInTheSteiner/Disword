replaceall = require('replaceall')

exports.items = {
    slice: (value, from, length) => value.slice(from, length),
    trim: (value) => value.trim(),
    replace: (value, oldStr, newStr) => replaceall(oldStr, newStr, value)
}