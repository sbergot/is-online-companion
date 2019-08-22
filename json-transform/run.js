const fs = require('fs');
const traverse = require('./traverse');

function apply(name, cb) {
    console.log(`applying ${cb.name} for ${name}`);
    const fname = "../src/referentials/" + name + ".json";
    const obj = require(fname);
    return new Promise((resolve, reject) => {
        let newObj;
        try {
            newObj = cb(obj);
        } catch (e) {
            reject(e);
            return;
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

function fix_notes(obj) {
    return traverse([node => {
        if (node.key == "custom-note") {
            const [title, placeholder] = node.current;
            return {title, placeholder}
        }
    }])(obj);
}

// ["assets", "foes", "moves", "oracles", "regions", "world"].forEach(name => {
//     apply(name, transform);
// });

["assets"].forEach(name => {
    apply(name, fix_notes).catch(console.error);
});
