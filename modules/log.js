exports["write"] = {}

exports.write.error = (message) => {
    console.log("ERROR: " + message)
}

exports.write.info = (message) => {
    console.log("INFO: " + message)
}

exports.write.group = (message) => {
    console.log("\nGROUP: " + message + "\n")
}

exports.write.warning = (message) => {
    console.log("WARNING: " + message)
}