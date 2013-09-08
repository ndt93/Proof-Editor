var builtin_rules = { //Fundamental Logical Rules
                      "&I" : new Rule("Conjunction Intro", ["A", "B"], "A & B"),
                      "&I1": new Rule("Conjunction Elim 1", ["A & B"], "A"),
                      "&I2": new Rule("Conjunction Elim 2", ["A & B"], "B"),
                      "vI1": new Rule("Disjunction Intro 1", ["A"], "A v B"),
                      "vI2": new Rule("Disjunction Intro 2", ["A"], "B v A"),
                      "vE" : new Rule("Disjunction Elim", ["A v B", "A => C", "B => C"], "C"),
                      "~~E": new Rule("Double Negation Ellim", ["~~A"], "A"),
                      "~I" : new Rule("Negation Intro", ["A => (B v ~B)"], "~A"),
                      "=>I": new Rule("Implication Intro", ["A |- B"], "A => B"),
                      //Extra Logical Rules
                      "~~I": new Rule("Double Negation Intro", ["A"], "~~A"),
                      "MP" : new Rule("Modus Ponens", ["A", "A => B"], "B"),
                      "MT" : new Rule("Modus Tollens", ["A => B", "~B"], "~A"),
                      "DS" : new Rule("Disjunctive Syllogism", ["A v B", "~A"], "~B"),
                    };
var added_rules = {};

//Constants
var EXPR_STRING_CLASS_NAME = "expression_string";
var EXPR_MODIFIER_CLASS_NAME = "expression_modifier";
var EXPR_ITEM_CLASS_NAME = "expression_content";
var EXPR_ITEM_SELECTED_CLASS_NAME = "expression_content_selected";
var EXPR_PREFIX = "expr_";
var SCOPE_PREFIX = "scope_";