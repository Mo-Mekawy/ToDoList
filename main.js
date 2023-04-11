// Select elements from the DOM
const header = document.querySelector("#section-title");
const taskNameField = document.querySelector("[data-field=taskName]");
const addBtn = document.querySelector("[data-field=addTask]");
const delAllBtn = document.querySelector("[data-field=DelAll]");
const tasksContainer = document.querySelector(".tasks");
const tasksHeader = document.querySelector(".tasks__header");

// Get last id from local storage
let idCount;

// Get user's language
const lang = navigator.language.includes("ar") ? "ar" : "en";

// If user's language is Arabic, set direction and font family
if (lang === "ar") {
  document.documentElement.style.direction = "rtl";
  document.body.style.fontFamily = "Cairo, sans-serif";

  // Update placeholder and button text for Arabic
  taskNameField.placeholder = "أكتب مهمتك هنا";
  addBtn.value = "أضف المهمة";
  delAllBtn.value = "احذف جميع المهام";

  // Update button styles for Arabic
  addBtn.style.fontSize = ".9rem";
  addBtn.style.fontWeight = "700";
  delAllBtn.style.fontSize = ".9rem";
  delAllBtn.style.fontWeight = "700";

  // Update task header text for Arabic
  tasksHeader.children[0].textContent = "المهمة";
  tasksHeader.children[1].textContent = "الخيارات";

  // Update section title for Arabic
  header.textContent = "قائمة المهام";
}

// Delete task function
const deleteTask = (e) => {
  const taskToDel = e.target.closest(".task");
  const id = +taskToDel.getAttribute("data-id");
  let tasks = JSON.parse(localStorage.getItem("tasks"));

  tasks = tasks.filter((task) => task.id !== id);

  localStorage.setItem("tasks", JSON.stringify(tasks));

  taskToDel.remove();
};

// Create delete button element
const createDelBt = () => {
  const delBtn = document.createElement("button");
  delBtn.setAttribute("aria-roledescription", "Delete Task");
  delBtn.setAttribute("type", "button");
  delBtn.setAttribute("title", "delete task");
  delBtn.className = "del";
  delBtn.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
  delBtn.addEventListener("click", deleteTask);
  return delBtn;
};

// Edit task function
const editTask = (e) => {
  // Create text field element for editing task
  const createTextField = (el) => {
    const newTextField = document.createElement("input");

    newTextField.setAttribute("type", "text");
    newTextField.setAttribute("placeholder", "Write the new task");
    newTextField.classList.add("text-field", "pop-up__input");

    // Get current task text value
    const oldValue = el
      .closest(".task")
      .querySelector(".task__text").textContent;
    newTextField.value = oldValue;

    return newTextField;
  };

  // Create close button element for editing task
  const createCloseBtn = () => {
    const closeBtn = document.createElement("button");
    closeBtn.setAttribute("title", "close pop up");
    closeBtn.className = "closeBtn";

    closeBtn.addEventListener("click", (e) => {
      e.target.parentElement.remove();
      document.body.classList.remove("blur");
    });

    return closeBtn;
  };

  // Create confirm button element for editing task
  const createConfirmBtn = (el) => {
    const confirmBtn = document.createElement("button");
    confirmBtn.setAttribute("type", "submit");
    confirmBtn.className = "confirm edit-btn";

    // Update button text for Arabic
    if (lang === "ar") confirmBtn.textContent = "حفظ";
    else confirmBtn.textContent = "Save";

    confirmBtn.addEventListener("click", (e) => {
      const task = el.closest(".task");
      const tasks = JSON.parse(localStorage.getItem("tasks"));
      const taskObj = tasks.filter((obj) => obj.id === +task.dataset.id)[0];

      // Get new task text value
      const newValue = e.target
        .closest(".pop-up")
        .querySelector(".pop-up__input").value;

      // Update task object and local storage
      if (taskObj.text !== newValue) {
        taskObj.text = newValue;
        taskObj.date = Date.now();
        localStorage.setItem("tasks", JSON.stringify(tasks));

        // Update task text and date in DOM
        task.querySelector(".task__text").textContent = taskObj.text;
        task.querySelector(".task__date").textContent = new Date(
          taskObj.date
        ).toLocaleString();
      }

      // Remove pop-up and blur effect
      e.target.parentElement.remove();
      document.body.classList.remove("blur");
    });

    return confirmBtn;
  };

  // create edit task pop up
  const popUp = document.createElement("div");
  popUp.classList.add("pop-up");

  popUp.append(createCloseBtn());
  popUp.append(createTextField(e.target));
  popUp.append(createConfirmBtn(e.target));

  document.body.append(popUp);
  document.body.classList.add("blur");
};

// Function to create an edit button
const createEditBtn = () => {
  const editBtn = document.createElement("button");
  // Set attributes for accessibility and styling
  editBtn.setAttribute("aria-roledescription", "Edit Task");
  editBtn.setAttribute("type", "button");
  editBtn.setAttribute("title", "Edit Task");

  editBtn.className = "edit";
  editBtn.innerHTML = `<i class="fa fa-edit"></i>`; // Add a font-awesome icon to the button

  editBtn.addEventListener("click", editTask);

  return editBtn;
};

// Function to create a checkbox for completed tasks
const createCompletedCheckbox = () => {
  // Create a document fragment to hold the checkbox and label
  const frag = document.createDocumentFragment();

  const checkbox = document.createElement("input");
  // Set attributes for accessibility and styling
  checkbox.setAttribute("type", "checkbox");
  checkbox.setAttribute("name", "isCompleted");
  checkbox.className = "task__checkbox";

  const label = document.createElement("label");
  label.addEventListener("click", (e) => {
    checkbox.click();
  });

  checkbox.addEventListener("click", (e) => {
    const task = e.target.closest(".task"); // Get the task element that the checkbox belongs to

    const tasks = JSON.parse(localStorage.getItem("tasks"));
    // Find the task object that matches the task element
    const taskObj = tasks.filter((obj) => obj.id === +task.dataset.id)[0];

    taskObj.completed = e.target.checked; // Update the completed status of the task object
    localStorage.setItem("tasks", JSON.stringify(tasks)); // Save the updated tasks to local storage

    task.classList.toggle("done");
    // If the task is completed, move it to the end of the list else add it in its id place
    if (task.classList.contains("done")) tasksContainer.append(task);
    else {
      const allTasks = Array.from(tasksContainer.querySelectorAll(".task"));
      let added = false;

      for (let i = 0, n = allTasks.length; i < n; i++) {
        // only if this to-be-added task comes after current looping task in index add it
        if (+allTasks[i].dataset.id !== +task.dataset.id - 1) continue;

        // if this task is not completed then add the task before it
        if (!allTasks[i].classList.contains("done")) {
          allTasks[i].after(task);
          added = true;
          break;
        }
      }

      if (!added) tasksContainer.querySelector(".done")?.before(task);
    }
  });

  frag.append(checkbox);
  frag.append(label);

  return frag;
};

// This function creates a date info element
const createDateInfo = (dateInMs) => {
  const date = document.createElement("span");
  date.className = "task__date";
  if (lang === "ar")
    date.textContent = new Date(dateInMs)
      .toLocaleString("ar-EG")
      .replace(" ", " - ");
  else date.textContent = new Date(dateInMs).toLocaleString();

  return date;
};

// This function creates a task element
const createTaskElement = (taskObj) => {
  const task = document.createElement("li");
  task.classList.add("task");

  task.append(createCompletedCheckbox());

  const text = document.createElement("div");
  text.textContent = taskObj.text;
  text.className = "task__text";
  task.append(text);

  const options = document.createElement("div");
  options.className = "options";
  options.append(createDelBt());
  options.append(createEditBtn());

  task.append(options);

  task.append(createDateInfo(taskObj.date));

  if (taskObj.completed) {
    task.classList.add("done");
    task.querySelector("[name=isCompleted]").checked = true;
  }

  task.setAttribute("data-id", taskObj.id);

  if (lang === "ar") task.style.setProperty("--counter-lang", "arabic-indic");
  else task.style.setProperty("--counter-lang", "decimal");

  return task;
};

// This function creates a task object
const createTask = (txt) => {
  return {
    id: ++idCount,
    text: txt,
    completed: false,
    date: Date.now(),
  };
};

// This function adds a task to the local storage
const AddToLocalStorage = (task) => {
  const tasks = JSON.parse(localStorage.getItem("tasks"));

  tasks.push(task);

  localStorage.setItem("tasks", JSON.stringify(tasks));
};

// Check if there are any tasks in the local storage and display them
if (
  !localStorage.getItem("tasks") ||
  JSON.parse(localStorage.getItem("tasks")).length === 0
) {
  localStorage.setItem("tasks", JSON.stringify([]));
  idCount = 0;
} else {
  const tasks = JSON.parse(localStorage.getItem("tasks"));
  for (let i = 0; i < tasks.length; i++) {
    tasksContainer.append(createTaskElement(tasks[i]));
    idCount = +tasks[i].id;
  }
}

// Move Completed Tasks To The Bottom
tasksContainer.querySelectorAll(".done").forEach((task) => {
  tasksContainer.appendChild(task);
});

// Add event listener to the add button
addBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const taskName = taskNameField.value;
  taskNameField.value = "";

  if (!taskName) {
    return;
  }

  const task = createTask(taskName);

  AddToLocalStorage(task);

  tasksContainer.querySelector(".done").before(createTaskElement(task));
});

// Add event listeners to the delete buttons
const delBtns = document.querySelectorAll(".task > .del");
delBtns.forEach((btn) => {
  btn.addEventListener("click", deleteTask);
});

// Add event listeners to the edit buttons
const editBtns = document.querySelectorAll(".task > .edit");
editBtns.forEach((btn) => {
  btn.addEventListener("click", editTask);
});

// Add event listener to the delete all button
delAllBtn.addEventListener("click", (e) => {
  e.preventDefault();
  localStorage.setItem("tasks", JSON.stringify([]));
  const header = tasksContainer.querySelector(".tasks__header");
  tasksContainer.replaceChildren(header);
});
