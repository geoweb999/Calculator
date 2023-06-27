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
  