Proof-Editor
============
A Fitch's Style Proof Editor for Natural Deduction
The application is written entirely in Javascript and can be used offline without any server-side code

How to Use
------------
Type in proposition in Proposition Box. Logical Connectives: &, v, ~, => are allowed.
Variables can be any combination of characters and parentheses except characters reserved for
logical connectives. Some mismatched and invalid syntax can be resolved by the application but
not all cases are guaranteed

Press "Premise" or "Assumption" button to add the proposition to the editing area

Select relevant propositions in the editing area and press targeted rule in the rule box.
A conclusion will be generated in the proposition box according to the rule and propositions selected.
Make changes to the conclusion if any and press Conclude Button to add conclusion to the editing area
or Clear Button to remove it.

Any error in matching or parsing process will be displayed above editing area. Hovering mouse over a rule
button will also display a summary of the corresponding rule in the summary box

Press Clear Button to clear the Proposition box and remove any error message
Press Undo Button to remove last added proposition
Press Printable Button to generate a text formatted version of the current proof

Click "Add Rule" Button to add new Rule. Enter required information accordingly. These added rules
are not permanent. Refreshing the page will remove any custom rule.
