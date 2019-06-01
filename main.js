var toDoListArray =[];
var taskItems = [];
var formInputTitle = document.getElementById('form__input--title');
var taskItemInput = document.getElementById('form__input--item');
var taskItemBtn = document.getElementById('form__button--plus');
var formOutput = document.getElementById('form__ul--output');
var makeListBtn = document.getElementById('form__button--make-list')
var clearBtn = document.getElementById('form__button--clear');
var outputField = document.getElementById('output')

window.addEventListener('load', refillArray);
window.addEventListener('load', repopulateToDoLists);
taskItemBtn.addEventListener('click', appendTaskItems);
formOutput.addEventListener('click', deletePreviewTask)
makeListBtn.addEventListener('click', createToDo);
clearBtn.addEventListener('click', clearAll);
formInputTitle.addEventListener('keyup', handleBtns);
taskItemInput.addEventListener('keyup', handleBtns);
outputField.addEventListener('click', deleteToDoLists);


function refillArray() {
  if (JSON.parse(localStorage.getItem('toDoListArray')) === null) {
    return;
  } else {
    var newArray = JSON.parse(localStorage.getItem('toDoListArray')).map(function(array) {
      return new ToDoList(array.title, array.tasks, array.id);
    });
    toDoListArray = newArray
  }
}

function createToDo() {
  var toDo = new ToDoList(formInputTitle.value, taskItems, Date.now());
  toDoListArray.push(toDo);
  toDo.saveToStorage(toDoListArray);
  displayToDoList(toDo);
  clearAll();
  formInputTitle.value = "";
}

function displayToDoList(toDo) {
  outputField.insertAdjacentHTML('afterbegin',
    `<article class="article__toDoList" data-id=${toDo.id}>
      <header>
        <h2>${toDo.title}</h2>
      </header>
      <section class="section--container">
        <ul class="section__ul--populate">
          ${appendTaskToCard(toDo)}
        </ul>
      </section>
      <footer>
        <div class="footer--containers">
          <input type="image" class="footer__images footer__image--urgent"src="images/urgent.svg">
          <p>URGENT</p>
        </div>
        <div class="footer--containers">
          <input type="image" class="footer__images footer__image--delete"src="images/delete.svg">
          <p>DELETE</p>
        </div>
      </footer>   
    </article>`)
  taskItems = [];
}

function repopulateToDoLists() {
    console.log(toDoListArray)
  for (var i = 0; i < toDoListArray.length; i++) {
    displayToDoList(toDoListArray[i]);
  }
}

function appendTaskToCard(toDo) {
  var tasksIteration = '';
  for (var i = 0; i < toDo.tasks.length; i++){
    tasksIteration += `
      <li class="section__li--populate">
        <input type="image" src="images/checkbox.svg" class="article__image--checkbox">
        <p class="section__text--populate">${toDo.tasks[i].task}</p>
      </li>
      `
  } return tasksIteration;
}

function appendTaskItems(e) {
  e.preventDefault();
  var taskId = Date.now()
  var listItem = `
  <li class="form__list" data-id=${taskId}>
    <input type="image" src="images/delete.svg" class="form__button--delete-task">
    ${taskItemInput.value}
  </li>`
  formOutput.innerHTML += listItem;
  var taskObject = {
    task: taskItemInput.value,
    taskId: taskId,
    checked: false
  }
  taskItems.push(taskObject);
  console.log(taskObject);
  taskItemInput.value = "";
}

function deletePreviewTask(e) {
  if (e.target.classList.contains('form__button--delete-task')) {
    e.target.closest('.form__list').remove();
  }
}

function deleteToDoLists(e) {
  if (e.target.classList.contains('footer__image--delete')) {
    e.target.closest('.article__toDoList').remove();
    var targetToDo = getToDoFromArray(e);
    targetToDo.deleteFromStorage(targetToDo);
  }
}

function getToDoFromArray(e) {
  var toDoId = e.target.closest('.article__toDoList').getAttribute('data-id');
  var targetToDo = findToDo(toDoId);
  return targetToDo;
}

function findToDo(id) {
  return toDoListArray.find(function(toDo) {
    return toDo.id == id;
  });
}

function handleBtns() {
  makeListBtn.disabled = !formInputTitle.value && !formOutput.innerHTML === ""; 
  clearBtn.disabled = !formInputTitle.value && !taskItemInput.value;
  taskItemBtn.disabled = !taskItemInput.value;
}

function clearAll() {
  console.log('test')
  formInputTitle.value = "";
  taskItemInput.value = ""
  formOutput.innerHTML = "";
  handleBtns();
}