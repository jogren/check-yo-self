class ToDoList {
  constructor(title, tasks, id, urgency) {
    this.title = title;
    this.tasks = tasks;
    this.id = id;
    this.urgency = urgency || false;
  }

  saveToStorage(toDoListArray) {
    localStorage.setItem('toDoListArray',JSON.stringify(toDoListArray));
  }

  deleteFromStorage(targetToDo) {
    var updatedArray = toDoListArray.filter(function(arrayItem){
      if(arrayItem.id !== targetToDo.id) {
        return arrayItem;
      }
    })
    toDoListArray = updatedArray;
    this.saveToStorage(toDoListArray);
  }

  updateToDo() {
    this.urgency = !this.urgency;

    this.saveToStorage(toDoListArray);

  }

  updateTask(id) {
  var task = this.tasks.find(function(item) {
      return item.taskId === id;
    })
  task.checked = !task.checked;

  this.saveToStorage(toDoListArray);
  }

}
