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

function beautify(string) {
    var t_string = string.replace(/([v&]|=>)(.)/g, "\$1 \$2");
    t_string = t_string.replace(/(.)([v&]|=>)/g, "\$1 \$2");
    return t_string;
}

function map(func, array) {
    for (var i = 0; i < array.length; i++) {
        array[i] = func(array[i]);
    }
    return array;
}


function getPrefixedScopeId(scope) {
    return SCOPE_PREFIX + (cur_scope.join(".") || "0");
}

function getPrefixedExpressionId(scope, line) {
    var scope_id = scope.join(".");
    return EXPR_PREFIX + (scope_id ? scope_id + "." : "") + line;
}

function getModifier(type, rule_name) {
    return (type && type != "Rule" && type != "Discharge") ?
            type : rule_name ? rule_name : "";
}


function exportPrintable(actions) {
    var exportedContent = [];
    for (var i = 0; i < actions.length; i++) {
        var action = actions[i];
        if (action["name"] == "add_expression") {
            var expression = expressions_list[action["target"]];
            var line = expression.identifier.slice(-1);
            var expr_str;
            expr_str = expression.type == "Assumption" ?
                        repeat(tab, expression.scope.length - 1) :
                        repeat(tab, expression.scope.length);
            expr_str += expression.identifier.slice(-1) + ". " +
                        expression.content + tab +
                        getModifier(expression.type, expression.rule_name);
            exportedContent.push(expr_str);
        }
    }
    return exportedContent.join("\n");
}

var precedence = {"none": 4, ">": 2, "=": 2, "&": 2, "v": 2, "~": 3};
function comparePrecedence(operator1, operator2) {
    var pre1 = precedence[operator1], pre2 = precedence[operator2];
    if (pre1 < pre2) {
        return -1;
    } else if (pre1 == pre2) {
        return 0;
    } else {
        return 1;
    }
}