const fs = require('fs');

function isAssociativeArray(arr) {
    if (!Array.isArray(arr)) {
        return false;
    }

    const len = arr.filter(e => {
        return Array.isArray(e) && e.length == 2 && (typeof e[0] == 'string' || typeof e[0] == 'number');
    }).length;

    return len == arr.length;
}

function transform(obj) {
    if (isAssociativeArray(obj)) {
        const res = {};
        obj.map(e => {
            res[e[0]] = e[1];
        });
        return res;
    }

    if (Array.isArray(obj)) {
        return obj.map(transform);
    }

    if (typeof obj == "object" && obj != null) {
        const res = {}
        Object.keys(obj).map(k => {
            res[k] = transform(obj[k]);
        })
        return res;
    }

    return obj;
}

["assets", "foes", "moves", "oracles", "regions", "world"].forEach(name => {
    console.log("processing " + name);
    const fname = "./" + name + ".json";
    const obj = require(fname);
    fs.writeFile(fname, JSON.stringify(transform(obj), null, 2), () => {
        console.log("done");
    });
});
