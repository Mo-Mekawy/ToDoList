const header = document.querySelector("#section-title");
const taskNameField = document.querySelector("[data-field=taskName]");
const addBtn = document.querySelector("[data-field=addTask]");
const delAllBtn = document.querySelector("[data-field=DelAll]");
const tasksContainer = document.querySelector(".tasks");
const tasksHeader = document.querySelector(".tasks__header");
// get last id .so, you can add the next element with the 'id' value of id+1
let idCount;

// get user's language
const lang = navigator.language.includes("ar") ? "ar" : "en";

if (lang === "ar") {
  document.documentElement.style.direction = "rtl";
  document.body.style.fontFamily = "Cairo, sans-serif";

  taskNameField.placeholder = "أكتب مهمتك هنا";

  addBtn.value = "أضف المهمة";
  addBtn.style.fontSize = ".9rem";
  addBtn.style.fontWeight = "700";

  delAllBtn.value = "احذف جميع المهام";
  delAllBtn.style.fontSize = ".9rem";
  delAllBtn.style.fontWeight = "700";

  tasksHeader.children[0].textContent = "المهمة";
  tasksHeader.children[1].textContent = "الخيارات";

  header.textContent = "قائمة المهام";
}

const deleteTask = (e) => {
  const taskToDel = e.target.closest(".task");
  const id = +taskToDel.getAttribute("data-id");
  let tasks = JSON.parse(localStorage.getItem("tasks"));

  tasks = tasks.filter((task) => task.id !== id);

  localStorage.setItem("tasks", JSON.stringify(tasks));

  taskToDel.remove();
};

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

const editTask = (e) => {
  const createTextField = (el) => {
    const newTextField = document.createElement("input");

    newTextField.setAttribute("type", "text");
    newTextField.setAttribute("placeholder", "Write the new task");
    newTextField.classList.add("text-field", "pop-up__input");

    const oldValue = el
      .closest(".task")
      .querySelector(".task__text").textContent;
    newTextField.value = oldValue;

    return newTextField;
  };

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

  const createConfirmBtn = (el) => {
    const confirmBtn = document.createElement("button");
    confirmBtn.setAttribute("type", "submit");
    confirmBtn.className = "confirm edit-btn";

    if (lang === "ar") confirmBtn.textContent = "حفظ";
    else confirmBtn.textContent = "Save";

    confirmBtn.addEventListener("click", (e) => {
      const task = el.closest(".task");
      const tasks = JSON.parse(localStorage.getItem("tasks"));
      const taskObj = tasks.filter((obj) => obj.id === +task.dataset.id)[0];

      const newValue = e.target
        .closest(".pop-up")
        .querySelector(".pop-up__input").value;

      if (taskObj.text !== newValue) {
        taskObj.text = newValue;
        taskObj.date = Date.now();
        localStorage.setItem("tasks", JSON.stringify(tasks));

        task.querySelector(".task__text").textContent = taskObj.text;
        task.querySelector(".task__date").textContent = new Date(
          taskObj.date
        ).toLocaleString();
      }

      e.target.parentElement.remove();
      document.body.classList.remove("blur");
    });

    return confirmBtn;
  };

  const popUp = document.createElement("div");
  popUp.classList.add("pop-up");

  popUp.append(createCloseBtn());
  popUp.append(createTextField(e.target));
  popUp.append(createConfirmBtn(e.target));

  document.body.append(popUp);
  document.body.classList.add("blur");
};

const createEditBtn = () => {
  const editBtn = document.createElement("button");
  editBtn.setAttribute("aria-roledescription", "Edit Task");
  editBtn.setAttribute("type", "button");
  editBtn.setAttribute("title", "Edit Task");
  editBtn.className = "edit";
  editBtn.innerHTML = `<i class="fa fa-edit"></i>`;
  editBtn.addEventListener("click", editTask);
  return editBtn;
};

const createCompletedCheckbox = () => {
  const frag = document.createDocumentFragment();

  const checkbox = document.createElement("input");
  checkbox.setAttribute("type", "checkbox");
  checkbox.setAttribute("name", "isCompleted");
  checkbox.className = "task__checkbox";

  const label = document.createElement("label");
  label.addEventListener("click", (e) => {
    checkbox.click();
  });

  checkbox.addEventListener("click", (e) => {
    const task = e.target.closest(".task");
    const tasks = JSON.parse(localStorage.getItem("tasks"));
    const taskObj = tasks.filter((obj) => obj.id === +task.dataset.id)[0];

    taskObj.completed = e.target.checked;
    localStorage.setItem("tasks", JSON.stringify(tasks));
    task.classList.toggle("done");
  });

  frag.append(checkbox);
  frag.append(label);

  return frag;
};

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

const createTask = (txt) => {
  return {
    id: ++idCount,
    text: txt,
    completed: false,
    date: Date.now(),
  };
};

const AddToLocalStorage = (task) => {
  const tasks = JSON.parse(localStorage.getItem("tasks"));

  tasks.push(task);

  localStorage.setItem("tasks", JSON.stringify(tasks));
};

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

addBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const taskName = taskNameField.value;
  taskNameField.value = "";

  if (!taskName) {
    return;
  }

  const task = createTask(taskName);

  AddToLocalStorage(task);

  tasksContainer.append(createTaskElement(task));
});

const delBtns = document.querySelectorAll(".task > .del");
delBtns.forEach((btn) => {
  btn.addEventListener("click", deleteTask);
});

const editBtns = document.querySelectorAll(".task > .edit");
editBtns.forEach((btn) => {
  btn.addEventListener("click", editTask);
});

delAllBtn.addEventListener("click", (e) => {
  e.preventDefault();
  localStorage.setItem("tasks", JSON.stringify([]));
  const header = tasksContainer.querySelector(".tasks__header");
  tasksContainer.replaceChildren(header);
});
