function createLookUpObject(arrayOfObjects, newObjectKey, newObjectValue) {

    const lookUpObject = {}

    for(let i = 0; i < arrayOfObjects.length; i++) {
        const keyToAdd = arrayOfObjects[i][newObjectKey];
        const valueToAdd = arrayOfObjects[i][newObjectValue];

        lookUpObject[keyToAdd] = valueToAdd;
    }

    return lookUpObject;
}

module.exports = createLookUpObject;