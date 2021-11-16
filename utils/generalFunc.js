export function checkFileType(data) {
    const fileType = ["image/jpeg", "image/png", "application/pdf"];

    //Logic 1
    if (Array.isArray(data)) {
        const temp = data.filter(p => !fileType.includes(p.type));

        return temp.length == 0 ? false : true;
    }
    else {
        return !fileType.includes(data.mimetype);
    }
};

//Fill child and parent array, if child null, make empty array
export function FindNestedChild(parent, child, key) {
    const res = []

    parent.forEach(d => {

        if (d[key] != null) {
            if (d[key].toString() == child._id.toString()) {
                d = d.toObject();
                d.items = FindNestedChild(parent, d)
                res.push(d)
            }
        }

    })
    return res
}

export function FindChildObject(parent, child, key) {
    const res = []

    parent.forEach(d => {
        if (d[key] != null) {
            if (d[key].toString() == child._id.toString()) {
                d = d.fillObject(d);
                d.items = FindChildObject(parent, d, key);
                res.push(d)
            }
        }

    })
    return res
}

export function numberSequence(str, currentNum, lastNum){
    //currentNum is the current doc number
    let currentNumLength = currentNum.toString().length
    //lastNum is the latest number sequence in the database
    let lastNumLength = lastNum.toString().length
    for(let i = currentNumLength; i < lastNumLength; i++){
        str += "0"
    }
    return str + currentNum.toString()
    // Example: numberSequence("", 120, 10000000) => result = 0000000120
}