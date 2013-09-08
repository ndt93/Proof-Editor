function arrayInit(value, length) {
    var a = new Array(length);
    for (var i = 0; i < length; i++) {
        a[i] = value;
    }
    return a;
}

function trim(string) {
    return string.replace(/[\s\n\t]+/g, "");
}