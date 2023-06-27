var equalsPressed = false;
var decimalPressed = false;
var shiftKeyPressed = false;
var originalOperators = ['+', '−', '×', '÷', '±'];
var shiftOperators = ['℃', '℉', '^', 'ln', '𝝅'];

function handleOperator(operator) {
    if (shiftKeyPressed) {
    switch (operator) {
        case '+':
        appendToResult('F');
        calculateShiftResult();
        break;
        case '-':
        appendToResult('C');
        calculateShiftResult();
        break;
        case '*':
        appendToResult('^');
        break;
        case '/':
        appendToResult('L');
        calculateShiftResult();
        break;
        case '±':
        appendToResult('3.1415926355');
        break;
        default:
        break;
    }
    } else {
    if (operator =='±') {
        invert();
    }
    appendToResult(operator);
    }
}

function appendToResult(value) {
    if (decimalPressed && value == '.') {
        return;
    }
    if (!decimalPressed && value == '.') {
        decimalPressed = true;
    } 
    var operators = ['+', '-', '*', '/'];
    if (operators.includes(value)) {
        decimalPressed = false;
    }
    if (equalsPressed) {
        document.getElementById('result').value = value;
        equalsPressed = false;
    } else {
        document.getElementById('result').value += value;
    }   
}

function invert() {
    var result = document.getElementById('result').value;
    result = 0 - result;
    document.getElementById('result').value = result;

}

function root() {
    var result = document.getElementById('result').value;
    if (result < 0) {
        result = 0 - result;
    }
    result = Math.sqrt(result);
    document.getElementById('result').value = result;
    equalsPressed = true;

}
function calculateResult() {
    if (shiftKeyPressed) {
        calculateShiftResult();
        return;
    }
    var result = document.getElementById('result').value;
    var finalResult = calculateResultHelper(result);
    document.getElementById('result').value = finalResult;

}
function calculateResultHelper(result) {
    equalsPressed = true;  
    var operators = ['+', '-', '*', '/'];
    var currentOperator;
    var split;
    
    // Find the operator in the result string
    var operatorFound = false;
    for (let i = 0; i < result.length; i++) {
    var c = result[i];
    if (c == '+' || c == '-'  || c == '*' || c == '/') {
        currentOperator = c;
        operatorFound = true;
        split = i;
        break;
    }
    }
    if (!operatorFound) {
    return result;
    }
    
    // Split the result string into operands
    var operand1 = result.substring(0,split);
    var operand2 = result.substring(split+1);
    var finalResult;
    
    // Perform the corresponding operation

    switch (currentOperator) {
    case '+':
        finalResult = parseInt(operand1) + parseInt(calculateResultHelper(operand2));
        break;
    case '-':
        finalResult = operand1 - calculateResultHelper(operand2);
        break;
    case '*':
        finalResult = operand1 * calculateResultHelper(operand2);
        break;
    case '/':
        finalResult = operand1 / calculateResultHelper(operand2);
        break;
    default:
        break;
    }

    decimalPressed = false;
    return finalResult;
    //document.getElementById('result').value = finalResult;
}

function calculateShiftResult() {
    var result = document.getElementById('result').value;
    var operatorFound = false;
    for (let i = 0; i < result.length; i++) {
    var c = result[i];
    if (c == 'C' || c == 'F'  || c == '^' || c == 'L' || c =='') {
        currentOperator = c;
        operatorFound = true;
        split = i;
        break;
    }
    }
    if (!operatorFound) {
    return;
    }
    equalsPressed = true;
    decimalPressed = false;
    var operand = result.substring(0,split);

    switch (currentOperator) {
    case 'C':
        document.getElementById('result').value = (operand * 1.8 + 32);
        break;
    case 'F':
        document.getElementById('result').value = (operand - 32) * 5 / 9;
        break;
    case '^':
        var right = result.substring(split+1);
        document.getElementById('result').value = Math.pow(operand,right);
        break;
    case 'L':
        document.getElementById('result').value = Math.log(operand);
        break;
    case '':
        appendToResult(3.1415926535);
        break;
        
    }

}

function clearResult() {
    document.getElementById('result').value = '';
}

function backspace() {
    var currentValue = document.getElementById('result').value;
    document.getElementById('result').value = currentValue.slice(0, -1);
}

function showHelp() {
    var helpMessage = "This is a simple calculator.\n"
                    + "Use the number buttons to enter digits.\n"
                    + "Press the operator buttons to perform calculations.\n"
                    + "Hold down the Shift key to access additional operators.\n"
                    + "Press the 'C' button to clear the input.\n"
                    + "Press the '⌫' button to delete the last digit.\n"
                    + "Press the '=' button or Enter key to calculate the result.";
    alert(helpMessage);
}

function calculateExpression(expression) {
    // Remove any whitespace from the expression
    expression = expression.replace(/\s/g, '');
  
    // Helper function to perform arithmetic operations
    function performOperation(operator, operand1, operand2) {
      switch (operator) {
        case '+':
          return operand1 + operand2;
        case '-':
          return operand1 - operand2;
        case '*':
          return operand1 * operand2;
        case '/':
          return operand1 / operand2;
        default:
          return NaN; // Invalid operator
      }
    }
  
    // Helper function to evaluate subexpressions within parentheses
    function evaluateSubexpression(subexpression) {
      // Remove parentheses from the subexpression
      subexpression = subexpression.slice(1, -1);
  
      // Evaluate the subexpression recursively
      return evaluateExpression(subexpression);
    }
  
    // Helper function to evaluate the expression recursively
    function evaluateExpression(expression) {
      let operandStack = [];
      let operatorStack = [];
  
      let currentNumber = '';
      for (let i = 0; i < expression.length; i++) {
        const char = expression[i];
  
        if (!isNaN(char) || char === '.') {
          currentNumber += char;
  
          // Check if it's the last character in the expression
          if (i === expression.length - 1) {
            operandStack.push(parseFloat(currentNumber));
          }
        } else {
          if (currentNumber !== '') {
            operandStack.push(parseFloat(currentNumber));
            currentNumber = '';
          }
  
          if (char === '(') {
            // Find the closing parenthesis and evaluate the subexpression
            let openCount = 1;
            let closeCount = 0;
            let subexpression = '';
            i++;
            while (openCount !== closeCount) {
              if (expression[i] === '(') {
                openCount++;
              } else if (expression[i] === ')') {
                closeCount++;
              }
              if (openCount !== closeCount) {
                subexpression += expression[i];
                i++;
              }
            }
            operandStack.push(evaluateSubexpression(subexpression));
          } else {
            if (operatorStack.length > 0) {
              const topOperator = operatorStack[operatorStack.length - 1];
              if (
                (char === '+' || char === '-') &&
                (topOperator === '*' || topOperator === '/')
              ) {
                while (operatorStack.length > 0) {
                  const operator = operatorStack.pop();
                  const operand2 = operandStack.pop();
                  const operand1 = operandStack.pop();
                  operandStack.push(
                    performOperation(operator, operand1, operand2)
                  );
                }
              }
            }
            operatorStack.push(char);
          }
        }
      }
  
      // Perform the remaining operations in the stacks
      while (operatorStack.length > 0) {
        const operator = operatorStack.pop();
        const operand2 = operandStack.pop();
        const operand1 = operandStack.pop();
        operandStack.push(performOperation(operator, operand1, operand2));
      }
  
      return operandStack[0];
    }
  
    return evaluateExpression(expression);
  }
  
document.addEventListener('keydown', function(event) {
    var key = event.key;
        // Handle Shift key
    if (key === 'Shift') {
    if (!shiftKeyPressed) {
        shiftKeyPressed = true;
        
        // Change operator buttons' text
        var operatorButtons = document.getElementsByClassName('operator');
        for (var i = 0; i < operatorButtons.length; i++) {
        operatorButtons[i].textContent = shiftOperators[i];
        }
    } else {
    shiftKeyPressed = false;
    
    // Restore operator buttons' text
    var operatorButtons = document.getElementsByClassName('operator');
    for (var i = 0; i < operatorButtons.length; i++) {
        operatorButtons[i].textContent = originalOperators[i];
    }
    }
}
    
    // Handle numbers
    if (!isNaN(key)) {
    appendToResult(key);
    }
    
    // Handle operators
    if (key === '+' || key === '-' || key === '*' || key === '/') {
    appendToResult(key);
    }
    
    // Handle equal sign (=)
    if (key === '=') {
    calculateResult();
    }
    
    // Handle backspace
    if (key === 'Backspace') {
    backspace();
    }

    if (key === 'c' || key === 'C') {
    clearResult();
    }
    
    if (key ==='.') {
    appendToResult('.');
    }



});
