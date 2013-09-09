var cur_scope = [];
var cur_scope_lid = 1;
var cur_area;

var expressions_list = {};
var selections_list = {};
var actionsStack = [];

var undo_button;
var summary_box;
var message_box;

function addNewExpression(content, type, rule_name) {
    // Create new expression object and add to expressions list
    content = beautify(parse(trim(content).split(""), 0));
    var scope_id = cur_scope.join(".");
    var newExpr = new Expression((scope_id ? scope_id + "." : "") + cur_scope_lid,
                                 content, type, rule_name);
    expressions_list[EXPR_PREFIX + newExpr.identifier] = newExpr;
    actionsStack.push({ "name": "add_expression",
                        "target": EXPR_PREFIX + newExpr.identifier,
                        "scope": cur_scope.slice(0),
                        "line": cur_scope_lid });
    
    //Create new DOM list item for the expression
    var expr_el = document.createElement("div");
    var expr_str = document.createElement("span");
    var expr_mod = document.createElement("span");
    expr_el.className = EXPR_ITEM_CLASS_NAME;
    expr_el.id = EXPR_PREFIX + newExpr.identifier;
    expr_str.innerHTML = newExpr.content;
    expr_str.className = EXPR_STRING_CLASS_NAME;
    expr_mod.innerHTML = (type && type != "Rule" && type != "Discharge") ? type : rule_name ? rule_name : "";
    expr_mod.className = EXPR_MODIFIER_CLASS_NAME + " " + type;
    expr_el.appendChild(expr_str);
    expr_el.appendChild(expr_mod);
    
    if (rule_name && rule_name.search(builtin_rules["=>I"].name) !== -1) {
        cur_scope_lid = cur_scope.pop() + 1;
        cur_area = document.getElementById(getPrefixedScopeId(cur_scope));
    }
    cur_area.appendChild(expr_el);
    
    //Update current scope, line id in case of assumption
    //discharge or premise. DOM ordered list for the scope is also created or updated
    if (type == "Assumption") {
        cur_scope.push(cur_scope_lid);
        cur_scope_lid = 1;
        
        var sub_area = document.createElement("ol");
        sub_area.id = getPrefixedScopeId(cur_scope);
        cur_area.appendChild(sub_area);
        cur_area = sub_area;
        actionsStack.push({ "name": "add_scope",
                            "target": sub_area.id});
    } else {
        cur_scope_lid++;
    }
    
    if ((undo_button.disabled)) {
        undo_button.disabled = false;
    }
}

function getPrefixedScopeId(scope) {
    return SCOPE_PREFIX + (cur_scope.join(".") || "0");
}

function getPrefixedExpressionId(scope, line) {
    var scope_id = scope.join(".");
    return EXPR_PREFIX + (scope_id ? scope_id + "." : "") + line;
}

//item: DOM li element
function toggleSelection(item) {
    if (item.className == "expression_content") {
        item.className = "expression_content_selected";
        selections_list[item.id] = expressions_list[item.id];
    } else {
        item.className = "expression_content";
        delete selections_list[item.id];
    }
}

function resetSelection() {
    for (expr_id in selections_list) {
        var expr_item = document.getElementById(expr_id);
        toggleSelection(expr_item);
    }
}

// Event handler when a rule item is clicked
// return [conclusion, modifier] if exists or "" otherwise
function ruleSelected(rule) {
    var dependencies = [];
    var expression_strs = [];
    for (var expr_id in selections_list) {
        expression = selections_list[expr_id];
        if (!expression.canBeSeen(cur_scope)) {
            console.log(expression.scope + " " + cur_scope);
            return INVALID_SCOPE;
        }
        expression_strs.push(expression.content);
        dependencies.push(expression.identifier);
    }
    
    if (expression_strs.length < rule.premises.length)
        return INVALID_MATCH_QUANTITY;
    if (rule.name == builtin_rules["=>I"].name) {
        var discharge = expression_strs.join("|-");
        expression_strs = [discharge];
    }
    
    var conclusion = matchWithRule(expression_strs, rule);
    if (conclusion) {
        var modifier = rule.name + " with ";
        return [rule.substitute(conclusion), modifier + dependencies.join(", ")];
    } else {
        return INVALID_MATCH_QUALITY;
    }
}

//Event handler when a mouseover a rule
function ruleQuery(rule) {
    var sum_content = rule.name + "<br>" +
                      "{ " + rule.uncompiled_premises.join(", ") + " }" +
                      " |- " + "{ " + beautify(rule.conclusion) + " }";
    summary_box.innerHTML = sum_content;
}

function undo() {
    function removeExpression(expr_id) {
        delete expressions_list[expr_id];
        var removedExpr = document.getElementById(expr_id);
        removedExpr.parentNode.removeChild(removedExpr);
    }
    
    resetSelection();
    var previous_action = actionsStack.pop();
    if (previous_action.name == "add_expression") {
        removeExpression(previous_action.target);
        cur_scope = previous_action.scope;
        cur_scope_lid = previous_action.line;
        cur_area = document.getElementById(getPrefixedScopeId(cur_scope));
    } else if (previous_action.name == "add_scope") {
        var removedScope = document.getElementById(previous_action.target);
        removedScope.parentNode.removeChild(removedScope);
        undo();
    }
    
    if (actionsStack.length == 0) {
        undo_button.disabled = true;
    }
}

function init() {
    cur_area = document.getElementById("scope_0");
    var rule_box = document.getElementById("rules_box");
    for (var rule in builtin_rules) {
        var rule_button = document.createElement("input");
        rule_button.type = "button"; rule_button.value = builtin_rules[rule].name;
        rule_button.id = rule;
        rule_box.appendChild(rule_button);
    }
}

function setupListeners() {
    var premise_button = document.getElementById("premise");
    var assumption_button = document.getElementById("assumption");
    var clear_button = document.getElementById("clear");
    var conclude_button = document.getElementById("conclude");
    undo_button = document.getElementById("undo");
    
    var expression = document.getElementById("expression");
    var message = document.getElementById("message");
    
    var main_scope = document.getElementById("scope_0");
    
    var rules_box = document.getElementById("rules_box");
    summary_box = document.getElementById("summary");
    message_box = document.getElementById("message");
    
    premise_button.addEventListener("click", function () {
        addNewExpression(expression.value, "Premise");
    });
    
    assumption_button.addEventListener("click", function () {
        addNewExpression(expression.value, "Assumption");
    });
    
    conclude_button.addEventListener("click", function() {
        var expr = expression.value.split("#");
        if (expr[1].search(builtin_rules["=>I"].name) !== -1) {
            addNewExpression(expr[0], "Discharge", expr[1]);
        } else {
            addNewExpression(expr[0], "Rule", expr[1]);
        }
       clear_button.dispatchEvent(new Event('click'));
       resetSelection();
    });
    
    clear_button.addEventListener("click", function () {
        expression.value = "";
        message.innerHTML = "";
        if (!conclude_button.disabled) {
            conclude_button.disabled = true;
            premise_button.disabled = false;
            assumption_button.disabled = false;
        }
    });
    
    main_scope.addEventListener("click", function(e) {
        if (e.target.className == EXPR_ITEM_CLASS_NAME ||
            e.target.className == EXPR_ITEM_SELECTED_CLASS_NAME) {
            var selection = document.getElementById(e.target.id);
            toggleSelection(selection);
        } else if (e.target.className == EXPR_STRING_CLASS_NAME) {
            var selection = document.getElementById(e.target.parentNode.id);
            toggleSelection(selection);
        }
    });
    
    undo_button.addEventListener("click", undo);
    
    rules_box.addEventListener("mouseover", function (e) {
        if (e.target.type == "button") {
            ruleQuery(builtin_rules[e.target.id]);
        }
    });
    
    rules_box.addEventListener("click", function (e) {
        if (e.target.type == "button") {
            var rule = builtin_rules[e.target.id];
            var result = ruleSelected(rule);
            if (result == INVALID_SCOPE) {
                message_box.innerHTML = ERROR_MESSAGE_SCOPE;
            } else if (result == INVALID_MATCH_QUALITY) {
                message_box.innerHTML = ERROR_MESSAGE_MATCH_QUALITY;
            } else if (result == INVALID_MATCH_QUANTITY) {
                message_box.innerHTML = ERROR_MESSAGE_MATCH_QUANTITY +
                                        ". Require " + rule.premises.length + " premises";
            } else if (result) {
                expression.value = beautify(result[0]) + "#" + result[1];
                conclude_button.disabled = false;
                premise_button.disabled = true;
                assumption_button.disabled = true;
                message_box.innerHTML = "";
            }
        }
    })
}

function main() {
    init();
    setupListeners();
}

window.addEventListener("load", main);