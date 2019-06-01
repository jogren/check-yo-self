class ToDoList {
  constructor(title, tasks, id) {
    this.title = title;
    this.tasks = tasks;
    this.id = id;
    this.urgency = false;
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
  }

  updateTask() {
  }
}



// class Items {
//   constructor(content) {
//     this.content = content;
//     this.done = false;
//     this.id = Date.now();
//     this.doneImg;
//   }
// }