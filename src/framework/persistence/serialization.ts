export function replacer(key: string, value: unknown) {
    if (typeof value === 'object' && value instanceof Set) {
        return {
            _type: 'set',
            values: Array.from(value),
        };
    }
    return value;
}

export function reviver(name: string, value: unknown) {
    if (typeof value === 'string' && /^\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d.\d\d\dZ$/.test(value)) {
        return new Date(value);
    }
    if (
        typeof value === 'object' &&
        value != null &&
        (value.hasOwnProperty('_type') && (value as { _type: string })._type == 'set')
    ) {
        return new Set((value as { values: string[] }).values);
    }
    return value;
}
