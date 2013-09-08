/* Convert a proposition to regex for pattern matching
 * The pattern is identified by a <tag>
 * link the variables position in the compiled pattern to a
 * variable name in the <link> dictionary
 */
function compileAndLinkPattern(pattern_string, link, tag) {
    var trimmed_pattern = trim(pattern_string);
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
    return new RegExp("^" + divided_pattern.join("") + "$");
}

/* Generate a variable_name -> variable value map
 * from a dictionary of tagged matches' variable values
 * using a rule's link dictionary
 */
function generateVarMap(taggedMatches, rule) {
    var var_map = {};
    for (var var_name in rule.link) {
        var premises_set = rule.link[var_name];
        var variable_value = "";
        for (var tag in premises_set) {
            var value_pos = premises_set[tag];
            if (variable_value == "") {
                variable_value = taggedMatches[tag][value_pos];
            } else if (taggedMatches[tag][value_pos] != variable_value) {
                return null;
            }
        }
        var_map[var_name] = variable_value;
    }
    return var_map;
}

/* Match an array of expressions with a Rule object's premises
 * return a variables map for conclusion substituion or null if cannot match
 */
function matchWithRule(expressions, rule) {
    if (expressions.length < rule.premises.length) {
        return null;
    }
    var matched = arrayInit(false, expressions.length)
    var taggedMatches = {}; //{premise_tag: [match, matched_variables]}
    for (var i = 0; i < expressions.length; i++) {
        var expr = trim(expressions[i]);
        var j = 0;
        for (;j < rule.premises.length; j++) {
            if (!matched[j]) {
                var match = rule.premises[j].exec(expr);
                if (match) {
                    taggedMatches[rule.premises[j].tag] = match;
                    matched[j] = true;
                    break;
                }   
            }
        }
        if (j >= rule.premises.length) {
            return null;
        }
    }
    return generateVarMap(taggedMatches, rule);
}

/* Rule function constructor
 * params: premises: string array; conclusion: string
 */
function Rule(name, premises, conclusion) {
    this.name = name;
    this.premises = [];
    this.conclusion = trim(conclusion);
    this.sub_index = []; //index of substition slots in conclusion
    this.link = {}; //link structure: {variable_name : {premise_tag: var_position_in premise,...},...}
    
    this.compile_and_link = function () {
        //compile regex for each premise (identified by a unique tag)
        //and link variable's name in each premise with corresponding matched position
        for (var i = 0, len = premises.length; i < len; i++) {
            this.premises[i] = compileAndLinkPattern(premises[i], this.link, i);
            this.premises[i].tag = i;
        }
        //find index for substitution slot in conclusion
        var a_conclusion = conclusion.split("");
        for (var i = 0, len = a_conclusion.length, test_pat = /[A-Za-z]/; i < len; i++) {
            if (test_pat.test(a_conclusion[i])) {
                this.sub_index.push(i);
            }
        }
    };
    
    this.substitute = function (var_map) {
        var a_conclusion = conclusion.split("");
        for (var i = 0, len = this.sub_index.length; i < len; i++) {
            if (var_map[a_conclusion[this.sub_index[i]]]) {
                a_conclusion[this.sub_index[i]] = var_map[a_conclusion[this.sub_index[i]]];
            }
        }
        return a_conclusion.join("");
    };
    
    this.compile_and_link();
}