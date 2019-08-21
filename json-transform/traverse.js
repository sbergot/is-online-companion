function traverse(cbs) {

    function processNode(node) {
        let newNode = {...node};
        for (cb of cbs) {
            const newObj = cb(newNode);
            if (newObj != null && newObj != undefined) {
                newNode.current = newObj;
            }
        }
        return newNode;
    }

    function recurse(node) {
        const newNode = processNode(node);
        const currentObj = newNode.current;

        if (Array.isArray(currentObj)) {
            return currentObj.map((sub, i) => recurse({
                current: sub,
                parent: newNode,
                childType: "array",
                key: i
            }));
        }
    
        if (typeof currentObj == "object" && currentObj != null) {
            const res = {}
            Object.keys(currentObj).map(k => {
                res[k] = recurse({
                    current: currentObj[k],
                    parent: newNode,
                    childType: "object",
                    key: k
                });
            })
            return res;
        }

        return node.current;
    }

    return obj => recurse({
        current: obj,
        parent: null,
        childType: null,
        key: null
    });
}

module.exports = traverse;