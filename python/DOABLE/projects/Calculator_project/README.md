# SimpleWebCalculator

A lightweight, browser‑based calculator that provides a clean user interface for performing basic arithmetic operations. It runs entirely on the client side using HTML, CSS, and JavaScript, requiring no server or build steps.

## Features

- **Intuitive UI** – Simple button layout with a display area for input and results.  
- **Basic Operators** – Supports addition (`+`), subtraction (`-`), multiplication (`*`), and division (`/`).  
- **Clear & Equals** – `C` button to reset the calculator and `=` button to evaluate the expression.  
- **Keyboard Support** – Users can type numbers and operators directly from the keyboard; `Enter` triggers evaluation and `Esc` clears the display.  
- **Responsive Design** – Layout adapts to various screen sizes, making it usable on desktop and mobile browsers.  
- **Error Handling** – Graceful handling of invalid expressions (e.g., division by zero) with user‑friendly error messages displayed in the output area.

## Tech Stack

- **HTML5** – Structure of the calculator and its controls.  
- **CSS3** – Styling, layout, and responsive behavior.  
- **JavaScript (ES6)** – Core logic for input handling, expression evaluation, and UI updates.

## Setup Instructions

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/simple-web-calculator.git
   cd simple-web-calculator
   ```

2. **Open the application**

   Open `index.html` in any modern web browser (Chrome, Firefox, Edge, Safari, etc.). No additional build steps, package managers, or server configuration are required.

## Usage

- **Button Layout**

  | Button | Function |
  |--------|----------|
  | `0‑9`  | Input digits |
  | `+`, `-`, `*`, `/` | Arithmetic operators |
  | `C`    | Clear the current input |
  | `=`    | Evaluate the expression |

- **Keyboard Shortcuts**

  | Key | Action |
  |-----|--------|
  | `0‑9` | Input digits |
  | `+`, `-`, `*`, `/` | Input operators |
  | `Enter` | Same as clicking `=` |
  | `Esc` | Same as clicking `C` |
  | `Backspace` | Delete the last character |

- **Error Handling**

  - If the expression is syntactically invalid or results in an error (e.g., division by zero), the display shows `Error` and the calculator is ready for a new input after pressing `C` or any new key.

## Folder Structure

```
simple-web-calculator/
│
├─ index.html          # Main HTML page containing the calculator UI
├─ styles.css          # CSS file for styling and responsive layout
├─ script.js           # JavaScript file handling calculator logic
└─ README.md           # Project documentation (this file)
```

## License

This project is licensed under the **MIT License** – see the `LICENSE` file for details.

--- 

*Happy calculating!*