/* Convert a proposition to regex for pattern matching
 * The pattern is identified by a <tag>
 * link the variables order in the compiled pattern to a
 * variable name in the <link> dictionary
 */
function compileAndLinkPattern(pattern_string, link, tag) {
    var trimmed_pattern = pattern_string.replace(/\s+/g, "");
    var divided_pattern = trimmed_pattern.split("");
    
    var matched_variable_count = 0;
    var variable_ids = {};
    for (var i = 0, len = divided_pattern.length, test_pat = /[A-Za-z]/; i < len; i++) {
        if (test_pat.test(divided_pattern[i])) {
            if (variable_ids[divided_pattern[i]]) {
                divided_pattern[i] = "\\" +  variable_ids[divided_pattern[i]];
            } else {
                variable_ids[divided_pattern[i]] = ++matched_variable_count;
                
                link[divided_pattern[i]] = link[divided_pattern[i]] || {};
                link[divided_pattern[i]][tag] = matched_variable_count;
                
                divided_pattern[i] = "([\\w\\(\\)v&~\\s]+)";
            }
        } else if (divided_pattern[i] === '(' || divided_pattern[i] === ')'){
            divided_pattern[i] = '\\' + divided_pattern[i];
        }

    }
    return new RegExp(divided_pattern.join(""), "g");
}

function testExpression(expr, pat) {
    return pat.test(expr.replace(/\s+/g, ""));
}

/* Rule function constructor
 * params: premises: string array; conclusion: string
 */
function Rule(premises, conclusion) {
    this.link = {};
    this.premises = [];
    this.conclusion = conlusion;
    this.sub_index = []; //index of substition slots in conclusion
    
    this.compile_and_link = function () {
        //compile regex for each premise and link their variable
        for (var i = 0, len = premises.length; i < len; i++) {
            this.premises[i] = compileAndLinkPattern(premises[i], this.link, i);
        }
        //find index for substitution slot in conclusion
        var a_conclusion = conclusion.split("");
        for (var i = 0, len = a_conclusion.length, test_pat = /[A-Za-z]/; i < len; i++) {
            if (test_pat.test(a_conclusion[i])) {
                sub_index.push(i);
            }
        }
    }
    
    this.substitute = function (var_map) {
        var a_conclusion = conclusion.split("");
        for (var i = 0, len = sub_index.length; i < len; i++) {
            a_conclusion[sub_index[i]] = var_map
        }
    }
}