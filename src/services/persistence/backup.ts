export function backupLocalStorage(): string {
    const backupObj: Record<string, string> = {};
    for (var i = 0, len = localStorage.length; i < len; ++i) {
        const key = localStorage.key(i)!;
        console.log(key);
        backupObj[key] = localStorage.getItem(key)!;
    }
    return JSON.stringify(backupObj);
}

export function restoreLocalStorage(backup: string) {
    localStorage.clear();
    const backupObj: Record<string, string> = JSON.parse(backup);
    Object.keys(backupObj).map(k => {
        localStorage.setItem(k, backupObj[k]);
    })
}


export function readFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e => {
            const content = reader.result as string;
            resolve(content);
        })
        reader.readAsText(file);
    })
}

export function download(filename: string, text: string) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}