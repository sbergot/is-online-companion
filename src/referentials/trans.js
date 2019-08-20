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
            res[e[0]] = transform(e[1]);
        });
        return res;
    }

    if (Array.isArray(obj)) {
        return obj.map(transform);
    }

    if (typeof obj == "object" && obj != null) {
        const res = {}
        Object.keys(obj).map(k => {
            const value = obj[k];
            if (value == null) {
                return;
            }
            if (k == "random-event") {
                res[k] = listity_random_events(value);
            } else {
                res[k] = transform(value);
            }
        })
        return res;
    }

    return obj;
}

function listity_random_events(obj) {
    return Object.keys(obj).map(k => {
        const value = obj[k];
        if (typeof value == "string") {
            return {
                upper: Number(k),
                description: value
            }
        } else {
            return {
                upper: Number(k),
                ...transform(obj[k]),
            }
        }
    })
}

function listify(obj) {
    return Object.keys(obj).map(k => ({
        name: k,
        ...obj[k],
    }))
}

function apply(name, cb) {
    console.log(`applying ${cb.name} for ${name}`);
    const fname = "./" + name + ".json";
    const obj = require(fname);
    return new Promise((resolve, reject) => {
        let newObj;
        try {
            newObj = cb(obj);
        } catch (e) {
            reject(e);
        }
        fs.writeFile(fname, JSON.stringify(newObj, null, 2), (err) => {
            if (err) {
                reject(err);
                return;
            }
            console.log(`done applying ${cb.name} for ${name}`);
            resolve();
        });
    });
}

// ["assets", "foes", "moves", "oracles", "regions", "world"].forEach(name => {
//     apply(name, transform);
// });

["oracles", "regions"].forEach(name => {
    apply(name, listify).catch(console.error);
});

