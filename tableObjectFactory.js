exports.create = (elementGroups) => {
    var elementGroupKeyFirst = Object.keys(elementGroups)[0];
    var elementGroupValuesFirst = elementGroups[elementGroupKeyFirst];
    var elementGroupKeys = Object.keys(elementGroups);
    var elementGroupValuesLength = elementGroupValuesFirst.length;
    var elementGroupKeysLength = elementGroupKeys.length;
    var tableObject = createTableObject(elementGroupKeysLength, elementGroupValuesLength);
    for (var field = 0; field < elementGroupKeysLength; field++)
        for (var row = 0; row < elementGroupValuesLength; row++)
            tableObject[row][elementGroupKeys[field]] = getElementGroupValue(elementGroups, row, field);
    return tableObject;
}

function getElementGroupValue(elementGroups, rowNumber, fieldNumber) {
    elementGroupKey = Object.keys(elementGroups)[fieldNumber]
    elementGroupValues = elementGroups[elementGroupKey]
    elementGroupValue = elementGroupValues[rowNumber]

    return elementGroupValue
}

function createTableObject(fieldNumber, rowNumber) {
    var tableObject = []

    for (var row = 0; row < rowNumber; row++)
        tableObject.push({})

    return tableObject
}