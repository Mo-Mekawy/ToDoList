# Todo List App Documentation

This is a simple todo list app that allows users to add, edit, and delete tasks. The app is built using HTML, CSS, and JavaScript.

## HTML

The HTML file (index.html) contains the structure of the todo list app.
It consists of the following elements:

A header element that contains the title of the app.

A form element that allows users to add tasks to the list.

An input element that accepts the name of the task.
A button element that adds the task to the list.

A button element that allows users to delete all tasks from the list.

An unordered list element that contains the tasks.
Each task is represented by a list item element .

A checkbox element that allows users to mark the task as completed.

A div element that displays the name of the task.

A div element that contains the options for the task (delete and edit buttons).

A button element that allows users to delete the task.

A button element that allows users to edit the task.

A span element that displays the date and time the task was added.

## CSS

The CSS file (style.css) contains the styles for the todo list app.

## JavaScript

The JavaScript file (script.js) contains the functionality for the todo list app. It consists of the following functions:

### Getting Last ID from Local Storage

- **idCount**: variable to store the last ID from local storage.

- gets the tasks from local storage then parse it.

- create an empty tasks key if not existing.

### Getting User's Language

- **lang**: variable to store the user's language.

- Setting Direction and Font Family for Arabic Language :

  - Sets the direction of the HTML element to right-to-left for Arabic language.
  - Sets the font family of the body to "Cairo, sans-serif" for Arabic language.
  - Updates placeholder and button text for Arabic.
  - Updates button styles for Arabic.
  - Updates task header text for Arabic.
  - Updates section title for Arabic.

### Creating Completed Checkbox

create a checkbox for the status of the task.

event listener to update the task's completed status.

### Creating Delete Button

deleteTask: function to delete the task element and remove it from local storage.

add an event listener to delete the task element.

### Creating Edit Button

editTask: function to edit the task element.

add an event listener to edit the task element and show a popup.

### Creating Task Element

creates the task element and adds delete and edit buttons, a completed state checkbox and the date the task was last modified.

**taskObj** _`parameter`_ : contains this elements' info

sets the task ID as a data attribute.

adds the "done" class to the task element if it's completed.

### Creating Task Object

createTask: function to create a task object.

**txt** _`parameter`_ : task text.

Returns an object with the task ID, name, completed status, and last-modified-date.

### Adding Task to Local Storage

AddToLocalStorage: function to add a task to local storage.

**task** _`parameter`_ : task object containing needed information.

Gets tasks from local storage, adds the new task, and updates local storage tasks.

### Moving Completed Tasks to the Bottom

Loops through all completed tasks and appends them to the end of the tasks container.

### Adding Event Listeners

- add an event listener to add a new task.

- add an event listener to delete a task.

- add an event listener to edit a task.

- add an event listener to delete all tasks and clear local storage.
