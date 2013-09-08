var cur_scope = [];
var cur_scope_lid = 1;
var cur_area;

var expressions_list = {};

function addNewExpression(content, type, rule_name, parentIds) {
    // Create new expression object and add to expressions list
    var scope_id = cur_scope.join(".");
    var newExpr = new Expression((scope_id ? scope_id + "." : "") + cur_scope_lid,
                                 content, type, rule_name);
    expressions_list[EXPR_PREFIX + newExpr.identifier] = newExpr;
    
    //Create new DOM list item for the expression
    var expr_el = document.createElement("div");
    var expr_str = document.createElement("span");
    var expr_mod = document.createElement("span");
    expr_el.className = EXPR_ITEM_CLASS_NAME;
    expr_el.id = EXPR_PREFIX + newExpr.identifier;
    expr_str.innerHTML = newExpr.content;
    expr_str.className = EXPR_STRING_CLASS_NAME;
    expr_mod.innerHTML = type ? type : rule_name ? rule_name : "";
    expr_mod.className = EXPR_MODIFIER_CLASS_NAME + " " + type;
    expr_el.appendChild(expr_str);
    expr_el.appendChild(expr_mod);
    cur_area.appendChild(expr_el);
    
    //Update current scope, line id in case of assumption
    //discharge or premise. DOM ordered list for the scope is also created or updated
    if (type == "Assumption") {
        cur_scope.push(cur_scope_lid);
        cur_scope_lid = 1;
        
        var sub_area = document.createElement("ol");
        sub_area.id = SCOPE_PREFIX + cur_scope.join(".");
        cur_area.appendChild(sub_area);
        cur_area = sub_area;
    } else if (rule_name == builtin_rules["=>I"].name) {
        cur_scope_lid = cur_scope.pop() + 1;
        cur_area = document.getElementById(SCOPE_PREFIX + (cur_scope.join(".") || "0"));
    } else {
        cur_scope_lid++;
    }
}

//item: DOM li element
function toggleSelection(item) {
    item.className = item.className == "expression_content" ?
                    "expression_content_selected" : "expression_content";
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
    
    var expression = document.getElementById("expression");
    
    var main_scope = document.getElementById("scope_0");
    
    premise_button.addEventListener("click", function () {
        addNewExpression(expression.value, "Premise");
    });
    
    assumption_button.addEventListener("click", function () {
        addNewExpression(expression.value, "Assumption");
    });
    
    clear_button.addEventListener("click", function () {
        expression.value = "";
        if (!conclude_button.disabled) {
            conclude_button.disabled = true;
            premise_button.disabled = false;
            assumption_button.disabled = false;
        }
    });
    
    main_scope.addEventListener("click", function(e) {
        console.log(e.target);
        if (e.target.className == EXPR_ITEM_CLASS_NAME ||
            e.target.className == EXPR_ITEM_SELECTED_CLASS_NAME) {
            var selection = document.getElementById(e.target.id);
            toggleSelection(selection);
        } else if (e.target.className == EXPR_STRING_CLASS_NAME) {
            var selection = document.getElementById(e.target.parentNode.id);
            toggleSelection(selection);
        }
    });
}


function main() {
    init();
    setupListeners();
}

window.addEventListener("load", main);