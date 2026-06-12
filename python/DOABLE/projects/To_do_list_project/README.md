# Todo List App

A simple, responsive web application for managing daily tasks. Add, edit, delete, and filter tasks with persistence using the browser's **localStorage**.

---

## Tech Stack
- **HTML5**
- **CSS3**
- **JavaScript (ES6+)**

---

## Features
- Create new tasks with a title and optional description.
- Mark tasks as completed/incomplete.
- Edit and delete existing tasks.
- Filter tasks by *All*, *Active*, or *Completed*.
- Persist tasks across sessions using `localStorage`.
- Responsive layout for desktop, tablet, and mobile devices.
- Keyboard shortcuts for quick task entry.

---

## Installation / Usage

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/todo-list-app.git
   cd todo-list-app
   ```

2. **Open the app**
   - No build step is required. Simply open `index.html` in any modern browser:
   ```bash
   open index.html   # macOS
   # or double‑click the file in your file explorer
   ```

3. **Start managing tasks!**  
   The app will automatically store your tasks in `localStorage`.

---

## File Structure

```
todo-list-app/
│
├── index.html          # Main HTML markup, loads CSS & JS
├── styles.css          # Global styling and responsive media queries
├── script.js           # Core JavaScript: Task class, storage, UI rendering
├── assets/
│   ├── screenshots/    # Placeholder for screenshots
│   └── demo.gif        # Placeholder for a usage GIF
└── README.md           # Project documentation (this file)
```

- **index.html** – Sets up the UI skeleton (header, input form, task list, footer) and links to the stylesheet and script.
- **styles.css** – Handles layout, theming, and responsiveness. Includes media queries for mobile view.
- **script.js** – Implements the `Task` class, manages `localStorage` CRUD operations, and drives the rendering pipeline.
- **assets/** – Holds visual assets used in the README (screenshots, demo GIF).

---

## How It Works

### JavaScript Architecture
1. **`Task` Class**  
   ```js
   class Task {
       constructor(id, title, description = '', completed = false) { … }
       toggleComplete() { … }
       update({title, description}) { … }
   }
   ```
   - Encapsulates task data and behavior (toggle, update).

2. **LocalStorage Flow**  
   - On app start, `loadTasks()` reads the JSON string from `localStorage`, parses it, and creates `Task` instances.  
   - Any change (add, edit, delete, toggle) triggers `saveTasks()` which serializes the current task array back to `localStorage`.

3. **Rendering Pipeline**  
   - `renderTasks(filter)` clears the task list container and appends HTML for each task that matches the current filter (`all`, `active`, `completed`).  
   - Event listeners on the UI (form submit, button clicks, checkbox changes) call the appropriate model methods, then re‑render.

4. **Event Delegation**  
   - A single listener on the task list container captures clicks for edit, delete, and toggle actions, reducing the number of attached listeners.

---

## Responsive Design
- Uses flexible grid and media queries to adapt the layout:
  - **Desktop** – Two‑column layout with a wide task list.
  - **Tablet** – Stacked layout with larger touch targets.
  - **Mobile** – Full‑width inputs and buttons, optimized for touch navigation.

---

## Contributing

1. **Fork the repository** and create a new branch for your feature or bug fix.
2. Follow the existing code style (ES6 classes, `const`/`let`, semicolons).
3. Add or update unit tests if applicable.
4. Ensure the UI remains responsive and passes linting (`npm run lint` if a linter is added later).
5. Submit a Pull Request with a clear description of changes.

*Future extensions ideas*: dark mode, drag‑and‑drop reordering, integration with external APIs (e.g., Todoist), unit tests with Jest.

---

## License

[MIT License] – *Replace with actual license file when ready.*

---

## Screenshots & Demo

| Desktop View | Mobile View |
|--------------|-------------|
| ![Desktop Screenshot](assets/screenshots/desktop.png) | ![Mobile Screenshot](assets/screenshots/mobile.png) |

**Demo GIF**  
![Todo List Demo](assets/demo.gif)  
*A quick walkthrough showing task creation, editing, filtering, and persistence.*

---

*Happy task managing!*