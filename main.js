var toDoListArray = [];
var formInputTitle = document.getElementById('form__input--title');
var taskItemInput = document.getElementById('form__input--item');
var taskItemBtn = document.getElementById('form__button--plus');
var formOutput = document.getElementById('form__ul--output');
var makeListBtn = document.getElementById('form__button--make-list')


taskItemBtn.addEventListener('click', appendTaskItems);
formOutput.addEventListener('click', deletePreviewTask)
makeListBtn.addEventListener('click', createToDo);


function createToDo() {
  var toDo = new ToDoList(formInputTitle.value, Date.now());
  toDoListArray.push(toDo);
  toDo.saveToStorage(toDoListArray);
  formInputTitle.value = "";
  // displayToDoList(toDo);
  // handleSaveBtn();
}

// function displayToDoList({title, id}) {
//   formOutput.insertAdjacentHTML('afterbegin',  
//     `
//     `

function appendTaskItems(e) {
  e.preventDefault();
  var taskId = Date.now()
  var listItem = `
  <li class="form__list" id=${taskId}>
    <input type="image" src="images/delete.svg" class="form__button--delete-task">
    ${taskItemInput.value}
  </li>`
  formOutput.innerHTML += listItem;
  var taskObject = {
    task: taskItemInput.value,
    taskId: taskId
  }
  // updateTask(taskObject);
  console.log(taskObject);
  taskItemInput.value = "";
}

function deletePreviewTask(e) {
  if (e.target.classList.contains('form__button--delete-task')) {
    e.target.closest('.form__list').remove();
  }
}