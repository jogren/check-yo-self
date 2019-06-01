var toDoListArray = [];
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
formInputTitle.addEventListener('keyup', handleBtns);
taskItemInput.addEventListener('keyup', handleBtns);
outputField.addEventListener('click', deleteToDoLists);


function refillArray() {
  if (JSON.parse(localStorage.getItem('toDoListArray')) === null) {
    return;
  } else {
    var newArray = JSON.parse(localStorage.getItem('toDoListArray')).map(function(array) {
      return new ToDoList(array.title, array.id);
    });
    toDoListArray = newArray
  }
}

function createToDo() {
  var toDo = new ToDoList(formInputTitle.value, Date.now());
  toDoListArray.push(toDo);
  toDo.saveToStorage(toDoListArray);
  formInputTitle.value = "";
  displayToDoList(toDo);
}

function displayToDoList({title, id}) {
  outputField.insertAdjacentHTML('afterbegin',
    `<article class="article__toDoList" data-id=${id}>
      <header>
        <h2>${title}</h2>
      </header>
      <section class="article__section">
        <ul>
          <li class="article__list">
            <input type="image" src="images/checkbox.svg" class="article__image--checkbox">
          Don't ever play yourself.
          </li>
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
}

function repopulateToDoLists() {
    console.log(toDoListArray)
  for (var i = 0; i < toDoListArray.length; i++) {
    displayToDoList(toDoListArray[i]);
  }
}

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

function deleteToDoLists(e) {
  if (e.target.classList.contains('footer__image--delete')) {
    e.target.closest('.article__toDoList').remove();
  }
}

function handleBtns() {
  makeListBtn.disabled = !formInputTitle.value
  clearBtn.disabled = !formInputTitle.value && !taskItemInput.value;
  taskItemBtn.disabled = !taskItemInput.value;
}

// function handleBtns() {
//   if (formInputTitle.value || taskItemInput !== "") {
//     makeListBtn.disabled = false;
//     clearBtn.disabled = false;
//     taskItemBtn.disabled = false;
//     disableBtns();
//   }
// }

// function disableBtns() {
//   if (formInputTitle.value || taskItemInput === "") {
//     makeListBtn.disabled = true;
//     clearBtn.disabled = true;
//     taskItemBtn.disabled = true;
//   }
// }