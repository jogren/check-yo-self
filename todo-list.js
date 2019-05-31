class ToDoList {
  constructor(title, id) {
    this.title = title;
    this.tasks = [];
    this.id = id;
    this.urgency = false;
  }

  saveToStorage(toDoListArray) {
    localStorage.setItem('toDoListArray',JSON.stringify(toDoListArray));

  }

  deleteFromStorage() {

  }

  updateToDo() {

  }

  updateTask(newTask) {
    this.tasks.push(newTask);
  }
}