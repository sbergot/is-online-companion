const Ajv = require('ajv');
const fs = require('fs')

function check(name) {
    const dataPath = "../src/referentials/" + name + ".json";
    const schemaPath = "../src/referentials/" + name + ".schema.json";
    if (!fs.existsSync(dataPath)) {
        console.error("file not found: " + dataPath);
    }

    if (!fs.existsSync(schemaPath)) {
        return;
    }

    const data = require(dataPath);
    const schema = require(schemaPath);
    const ajv = new Ajv({allErrors: true});
    const validate = ajv.compile(schema);
    const valid = validate(data);
    if (!valid) return validate.errors;
}

["assets", "foes", "moves", "oracles", "regions", "world"].forEach(name => {
    const errs = check(name);
    if (errs) {
        console.log(errs);
    }
});

