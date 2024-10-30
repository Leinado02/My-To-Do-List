const taskInput = document.querySelector(".task-input input");
const addTaskBtn = document.querySelector(".add-task-btn");
const filters = document.querySelectorAll(".filters span");
const clearAll = document.querySelector(".clear-btn");
const taskBox = document.querySelector(".task-box");

let editId;
let isEditedTask = false;

// getting localstorage todo-list
let todos = JSON.parse(localStorage.getItem("todo-list"));
filters.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector("span.active").classList.remove("active");
    btn.classList.add("active");
    showTodo(btn.id);
  });
});

function showTodo(filter) {
  let li = "";
  if (todos) {
    todos.forEach((todo, id) => {
      //if todo satus is completed set the isCompleted value to checked
      let isCompleted = todo.status == "completed" ? "checked" : "";
      if (filter == todo.status || filter == "all") {
        li += ` <li class="task">
          <label for="${id}">
             <input onclick = "updateStatus(this)" type="checkbox" id="${id}" ${isCompleted} />
             <p class="${isCompleted}">${todo.name}</p>
          </label>
          <div class="settings">
             <i  onclick ="showMenu(this)" class="fa fa-ellipsis-h" aria-hidden="true"></i>
          <ul class="task-menu">
             <li onclick = "editTask(${id}, '${todo.name}')"><i class="fa fa-pencil" aria-hidden="true"></i>Edit</li>
             <li onclick = "deleteTask(${id})"><i class="fa fa-trash" aria-hidden="true"></i>Delete</li> 
          </ul>
        </div>
      </li>`;
      }
    });
  }
  // if li isn't empty insert this value inside textbox else insert span
   taskBox.innerHTML = li || `<span>You don't have any task here</span>`;
}
showTodo("all");

function showMenu(selectedTask) {
  // Getting taskMenu div
    let taskMenu = selectedTask.parentElement.lastElementChild;
    taskMenu.classList.add("show");
    document.addEventListener("click", (e) => {
    //Removing show class from the menu on the document click
    if (e.target.tagName != "I" || e.target != selectedTask) {
      taskMenu.classList.remove("show");
    }
  });
}

function editTask(taskId, taskName) {
    editId = taskId;
    isEditedTask = true;
    taskInput.value = taskName;
}

function deleteTask(deleteId) {
  //Removing selected task from the array/todos
  todos.splice(deleteId, 1);
  localStorage.setItem("todo-list", JSON.stringify(todos));
  showTodo();
}

clearAll.addEventListener("click", () => {
  //Removing all items of array/todos
  todos.splice(0, todos.length);
  localStorage.setItem("todo-list", JSON.stringify(todos));
  showTodo();
});

function updateStatus(selectedTask) {
  // Getting paragragh that contain task name
  let taskName = selectedTask.parentElement.lastElementChild;
  if (selectedTask.checked) {
    taskName.classList.add("checked");
    // Updating the status of selected task to completed

    todos[selectedTask.id].status = "completed";
  } else {
    taskName.classList.remove("checked");
    // Updating the status of selected task to pending
    todos[selectedTask.id].status = "pending";
  }
  localStorage.setItem("todo-list", JSON.stringify(todos));
}

// Event Listeners
addTaskBtn.addEventListener("click", () => {
  let userTask = taskInput.value.trim();
  if (taskInput.value !== "") {
    if (userTask) {
      if (!isEditedTask) {
        // if isEditedTask isn't true
        if (!todos) {
          // if todos is doesn't exist, pass an empty array to todos
          todos = [];
        }
        let taskInfo = { name: userTask, status: "pending" };
        todos.push(taskInfo); // adding new task to todos
      } else {
        isEditedTask = false;
        todos[editId].name = userTask;
      }
    }
    const taskText = taskInput.value;
    const listItem = document.createElement("li");
    taskBox.appendChild(listItem);
    listItem.innerHTML = `
                         ${taskText}`;

    taskInput.value = "";
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo("all");
  }
});

taskInput.addEventListener("keyup", (e) => {
  let userTask = taskInput.value.trim();
  if (e.key == "Enter" && userTask) {
    if (!isEditedTask) {
      // if isEditedTask isn't true
      if (!todos) {
        // if todos is doesn't exist, pass an empty array to todos
        todos = [];
      }
      let taskInfo = { name: userTask, status: "pending" };
      todos.push(taskInfo); // adding new task to todos
    } else {
      isEditedTask = false;
      todos[editId].name = userTask;
    }
    taskInput.value = "";
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo("all");
  }
});
