/* Calculator script - script.js */

/* DOM Elements */
const display = document.getElementById('display');
const buttons = document.querySelectorAll('.calc-button');

/**
 * Append a character/value to the calculator display.
 * Handles leading zero logic for numeric input.
 *
 * @param {string} value - The character to append (digit or operator).
 */
function appendToDisplay(value) {
    // If the display is currently empty, just set the value
    if (display.value === '') {
        // Prevent starting expression with an operator (except minus)
        if (['+', '*', '/', '.'].includes(value)) return;
        display.value = value;
        return;
    }

    // Handle leading zero for numeric entry
    if (display.value === '0' && /[0-9]/.test(value)) {
        // Replace the leading zero unless the new digit is also zero
        display.value = value === '0' ? '0' : value;
        return;
    }

    // Prevent multiple consecutive operators (except for minus which can denote negative)
    const lastChar = display.value.slice(-1);
    const operators = ['+', '-', '*', '/', '.'];
    if (operators.includes(lastChar) && operators.includes(value) && !(value === '-' && lastChar !== '-')) {
        // Replace the last operator with the new one
        display.value = display.value.slice(0, -1) + value;
        return;
    }

    // Normal concatenation
    display.value += value;
}

/**
 * Clear the calculator display.
 */
function clearDisplay() {
    display.value = '';
}

/**
 * Evaluate the arithmetic expression shown in the display.
 * Handles division by zero and malformed expressions safely.
 */
function evaluateExpression() {
    const expr = display.value;

    // Simple detection of division by zero (e.g., "/0", "/0 ", "/0+")
    const divisionByZeroPattern = /\/\s*0(?!\d)/;
    if (divisionByZeroPattern.test(expr)) {
        display.value = 'Error';
        return;
    }

    try {
        // Using Function constructor for evaluation (safer than eval)
        const result = Function('return ' + expr)();

        // Handle cases where result is undefined, null, or NaN
        if (result === undefined || result === null || Number.isNaN(result)) {
            display.value = 'Error';
        } else {
            display.value = result;
        }
    } catch (e) {
        display.value = 'Error';
    }
}

/**
 * Click handler for calculator buttons.
 *
 * @param {MouseEvent} event
 */
function handleButtonClick(event) {
    const value = event.target.dataset.value;
    if (!value) return; // Ignore clicks without a data-value attribute

    switch (value) {
        case 'C':
            clearDisplay();
            break;
        case '=':
            evaluateExpression();
            break;
        default:
            // Digits and operators
            appendToDisplay(value);
            break;
    }
}

/**
 * Keyboard handler to map key presses to calculator actions.
 *
 * @param {KeyboardEvent} event
 */
function handleKeyboard(event) {
    const key = event.key;

    // Allow numeric keys and basic operators
    if (/[0-9]/.test(key) || ['+', '-', '*', '/', '.'].includes(key)) {
        event.preventDefault();
        appendToDisplay(key);
        return;
    }

    // Enter or '=' key triggers evaluation
    if (key === 'Enter' || key === '=') {
        event.preventDefault();
        evaluateExpression();
        return;
    }

    // Backspace or Escape clears the display
    if (key === 'Backspace' || key === 'Escape') {
        event.preventDefault();
        clearDisplay();
        return;
    }
}

/* Attach event listeners */
buttons.forEach(btn => btn.addEventListener('click', handleButtonClick));
document.addEventListener('keydown', handleKeyboard);

/* Export functions for potential unit testing (attached to window) */
window.appendToDisplay = appendToDisplay;
window.clearDisplay = clearDisplay;
window.evaluateExpression = evaluateExpression;
window.handleButtonClick = handleButtonClick;
window.handleKeyboard = handleKeyboard;