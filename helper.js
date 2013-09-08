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

var tab = "  ";
function repeat(string, times) {
    if (times === 0) {
        return "";
    } else if (times % 2 === 0) {
        return repeat(string + string, times / 2);
    } else {
        return string + repeat(string, times - 1);
    }
}