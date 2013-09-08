var modus_ponens;

function main() {
    modus_ponens = compilePattern("(A => B) & A");
    setupListeners();
}

function setupListeners() {
    var test_button = document.getElementById("test");
    
    test_button.addEventListener("click", test);
}

function test() {
    var input = document.getElementById("input").value;
    var output = document.getElementById("output1");
    
    output1.innerHTML = testExpression(input, modus_ponens);
}

window.addEventListener("load", main);