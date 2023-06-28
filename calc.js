var equalsPressed = false;
var decimalPressed = false;
var shiftKeyPressed = false;
var originalOperators = ['+', '-', '×', '÷', '±'];
var shiftOperators = ['°C', '°F', '^', 'ln', '𝝅'];

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
          case '×':
            appendToResult('^');
            break;
          case '÷':
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
          return;
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
    var operators = ['+', '-', '×', '÷'];
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
    var operatorFound = false;
    var split;
    for (let i = result.length-1; i >= 0; i--) {
      var c = result[i];
      if (c == '+' || c == '-'  || c == '×' || c == '÷' || c == '^' || c == '-') {
        operatorFound = true;
        console.log("operator found " + c);
        split = i;
        break;
      }
    }

    if (operatorFound) {
      var newResult = result.substring(split+1);
      console.log(newResult);

      newResult = 0 - newResult;
      result = result.substring(0,split+1) + newResult;
      console.log(result);

    } else {
      result = 0 - result;
      console.log(result);
    }
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
    var currentOperator;
    var split;
    
    // Find the operator in the result string
    var operatorFound = false;
    for (let i = 0; i < result.length; i++) {
      var c = result[i];
      if (c == '+' || c == '-'  || c == '×' || c == '÷' || c == '^') {
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
        finalResult = parseFloat(operand1) + parseFloat(calculateResultHelper(operand2));
        break;
    case '-':
        finalResult = parseFloat(operand1) - parseFloat(calculateResultHelper(operand2));
        break;
    case '×':
        finalResult = parseFloat(operand1) * parseFloat(calculateResultHelper(operand2));
        break;
    case '÷':
        finalResult = parseFloat(operand1) / parseFloat(calculateResultHelper(operand2));
        break;
    case '^':
        finalResult = Math.pow(parseFloat(operand1),parseFloat(operand2));
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
    if (c == 'C' || c == 'F'  || c == '^' || c == 'L' || c =='' || c == '=') {
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
    case '=':
        var result = document.getElementById('result').value;
        var finalResult = calculateResultHelper(result);
        document.getElementById('result').value = finalResult;
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
