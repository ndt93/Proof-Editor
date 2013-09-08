var builtin_rules = { //Fundamental Logical Rules
                      "&I" : new Rule("Conjunction Introduction", ["A", "B"], "A & B"),
                      "&I1": new Rule("Conjunction Ellimination", ["A & B"], "A"),
                      "&I2": new Rule("Conjunction Ellimination", ["A & B"], "B"),
                      "vI1": new Rule("Disjunction Introduction", ["A"], "A v B"),
                      "vI2": new Rule("Disjunction Introduction", ["A"], "B v A"),
                      "vE" : new Rule("Disjunction Ellimination", ["A v B", "A => C", "B => C"], "C"),
                      "~~E": new Rule("Double Negation Ellimination", ["~~A"], "A"),
                      "~I" : new Rule("Negation Introduction", ["A => (B v ~B)"], "~A"),
                      "=>I": new Rule("Implication Introduction", ["A |- B"], "A => B"),
                      //Extra Logical Rules
                      "~~I": new Rule("Double Negation Introduction", ["A"], "~~A"),
                      "MP" : new Rule("Modus Ponens", ["A", "A => B"], "B"),
                      "MT" : new Rule("Modus Tollens", ["A => B", "~B"], "~A"),
                      "DS" : new Rule("Disjunctive Syllogism", ["A v B", "~A"], "~B"),
                    };
var added_rules = {};