var toDoListArray =[];
var taskItems = [];
var formInputTitle = document.getElementById('form__input--title');
var taskItemInput = document.getElementById('form__input--item');
var taskItemBtn = document.getElementById('form__button--plus');
var formOutput = document.getElementById('form__ul');
var makeListBtn = document.getElementById('form__button--make-list')
var clearBtn = document.getElementById('form__button--clear');
var searchInput = document.getElementById('nav__input');
var outputField = document.getElementById('output');
var placeholderText = document.querySelector('.output__p');
var urgencyPlaceholderText = document.querySelector('.output__p--urgency');
var urgencyFilterBtn = document.getElementById('form__button--filter');

window.addEventListener('load', handleLoad);
taskItemBtn.addEventListener('click', appendTaskItems);
formOutput.addEventListener('click', deletePreviewTask);
makeListBtn.addEventListener('click', createToDo);
clearBtn.addEventListener('click', clearAll);
formInputTitle.addEventListener('keyup', handleBtns);
taskItemInput.addEventListener('keyup', handleBtns);
urgencyFilterBtn.addEventListener('click', handleUrgencyBtn);
searchInput.addEventListener('keyup', handleSearch);
outputField.addEventListener('click', handleCardBtns);

function handleLoad() {
  refillArray();
  repopulateToDoLists();
  urgentPlaceholderOnLoad();
}

function handleCardBtns(e) {
  deleteToDoLists(e);
  togglecheckbox(e);
  toggleUrgency(e);
}

function refillArray() {
  if (JSON.parse(localStorage.getItem('toDoListArray')) === null) {
    return;
  } else {
    var newArray = JSON.parse(localStorage.getItem('toDoListArray')).map(function(array) {
      return new ToDoList(array.title, array.tasks, array.id, array.urgency);
    });
    toDoListArray = newArray
  }
}

function createToDo() {
  // var tasksOnDOM = document.querySelectorAll('.form__list');
  // Create helper function to make task object, pass through tasksOnDOM - Use map
  var toDo = new ToDoList(formInputTitle.value, taskItems, Date.now(), false);
  toDoListArray.push(toDo);
  toDo.saveToStorage(toDoListArray);
  displayToDoList(toDo);
  clearAll();
  formInputTitle.value = "";
}

function displayToDoList(toDo) {
  placeholderText.classList.add('hidden');
  var urgency = toDo.urgency ? 'urgent-active.svg' : 'urgent.svg';
  var urgencyText = toDo.urgency ? 'active' : 'inactive';
  var urgencyBackground = toDo.urgency ? 'background-active' : 'background-inactive';
  var urgencyBorders = toDo.urgency ? 'border-active' : 'border-inactive';
  outputField.insertAdjacentHTML('afterbegin',
    `<article class="article ${urgencyBackground}" data-id=${toDo.id}>
      <header>
        <h2>${toDo.title}</h2>
      </header>
      <section class="section--container ${urgencyBorders}">
        <ul class="section__ul">
          ${appendTaskToCard(toDo)}
        </ul>
      </section>
      <footer>
        <div class="footer__div">
          <input type="image" class="footer__image footer__image--urgent"src="images/${urgency}">
          <p class="footer__p--urgent ${urgencyText}">URGENT</p>
        </div>
        <div class="footer__div">
          <input type="image" class="footer__image footer__image--delete"src="images/delete.svg" disabled>
          <p class="footer__p--delete">DELETE</p>
        </div>
      </footer>   
    </article>`)
  taskItems = [];
}

function repopulateToDoLists() {
  for (var i = 0; i < toDoListArray.length; i++) {
    displayToDoList(toDoListArray[i]);
  }
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
  taskItemInput.value = "";
  handleBtns();
}

// function appendTaskItems(e) {
//   e.preventDefault();
//   var taskId = Date.now()
//   var listItem = `
//   <li class="form__list" data-id=${taskId}>
//     <input type="image" src="images/delete.svg" class="form__button--delete-task">
//     ${taskItemInput.value}
//   </li>`
//   formOutput.innerHTML += listItem;
//   createTaskObject(taskId);
// }

// function createTaskObject(taskId) {
//   var taskObject = {
//     task: taskItemInput.value,
//     taskId: taskId,
//     checked: false
//   }
//   taskItems.push(taskObject);
//   taskItemInput.value = "";
//   handleBtns();
// }

function deletePreviewTask(e) {
  if (e.target.classList.contains('form__button--delete-task')) {
    e.target.closest('.form__list').remove();
    deletePreviewTaskFromArray(e);
  }
  handleBtns();
}

function deletePreviewTaskFromArray(e) {
  var itemId = e.target.closest('.form__list').getAttribute('data-id');
  var filteredArray = taskItems.filter(function(item) {
    if (item.taskId != itemId) {
      return item;
    }
  })
  taskItems = filteredArray;
}

function appendTaskToCard(toDo) {
  var tasksIteration = '';
  for (var i = 0; i < toDo.tasks.length; i++){
  var checkbox = toDo.tasks[i].checked ? 'checkbox-active.svg' : 'checkbox.svg'
  var checkboxText = toDo.tasks[i].checked ? 'checkbox-text-active' : 'checkbox-text-inactive';
    tasksIteration += `
      <li class="section__li" data-id=${toDo.tasks[i].taskId}>
        <input type="image" src="images/${checkbox} " class="section__image--checkbox">
        <p class="section__p--populate ${checkboxText}">${toDo.tasks[i].task}</p>
      </li>
      `
  } 
  return tasksIteration;
}

function togglecheckbox(e) {
  if (e.target.classList.contains('section__image--checkbox')) {
    var targetTodo = getToDoFromArray(e);
    var targetTaskArray = getToDoFromArray(e).tasks;
    var targetTaskId = getTaskFromArray(e);
    var taskObject = findTask(targetTaskId, targetTaskArray);
    targetTodo.updateTask(taskObject.taskId);
    var checkboxPath = taskObject.checked ? 'images/checkbox-active.svg' : 'images/checkbox.svg'
    e.target.setAttribute('src', checkboxPath)
    togglecheckboxStyle(e);
    var article = e.target.closest('article');
    enableDeleteBtn(targetTaskArray, article);
  }
}

function getTaskFromArray(e) {
  var taskId = e.target.closest('li').getAttribute('data-id')
  return taskId;
}

function findTask(targetTaskId, targetTaskArray) {
  return targetTaskArray.find(function(task) {
    return task.taskId == targetTaskId;
  });
}

function togglecheckboxStyle(e) {
  var checkboxText = e.target.closest('li').querySelector('.section__p--populate')
  checkboxText.classList.toggle('checkbox-text-active');
  checkboxText.classList.toggle('checkbox-text-inactive');
}

function toggleUrgency(e) {
  if (e.target.classList.contains('footer__image--urgent')) {
  var targetToDo = getToDoFromArray(e);
  targetToDo.updateToDo(); 
  var urgencyPath = targetToDo.urgency ? 'images/urgent-active.svg' : 'images/urgent.svg'
  e.target.setAttribute('src', urgencyPath)
  toggleUrgencyStyle(e, targetToDo);
  }
}

function toggleUrgencyStyle(e, targetToDo) {
  var urgencyText = e.target.closest('article').querySelector('.footer__p--urgent')
  var urgencyCard = e.target.closest('article')
  var urgencySection = e.target.closest('article').querySelector('.section--container');
    urgencyText.classList.toggle('active');
    // urgencyText.classList.toggle('inactive');
    urgencyCard.classList.toggle('background-active');
    // urgencyCard.classList.toggle('background-inactive');
    urgencySection.classList.toggle('border-active');
    // urgencySection.classList.toggle('border-inactive');
}

function enableDeleteBtn(targetTaskArray, article) {
  var completedArray = targetTaskArray.filter(function(task) {
    if(task.checked === true) {
      return task;
    }
  })
  if(targetTaskArray.length === completedArray.length) {
    article.querySelector('.footer__image--delete').disabled = false;
  }
}

function deleteToDoLists(e) {
  if (e.target.classList.contains('footer__image--delete')) {
    e.target.closest('.article').remove();
    var targetToDo = getToDoFromArray(e);
    targetToDo.deleteFromStorage(targetToDo);
  }
  placeholder();
}

function getToDoFromArray(e) {
  var toDoId = e.target.closest('.article').getAttribute('data-id');
  var targetToDo = findToDo(toDoId);
  return targetToDo;
}

function findToDo(id) {
  return toDoListArray.find(function(toDo) {
    return toDo.id == id;
  });
}

function handleSearch() {
  outputField.innerHTML = '';
  var searchText = searchInput.value.toLowerCase();
  if(urgencyFilterBtn.classList.contains('filter-btn-active')) {
    searchUrgentToDos(searchText)
  } else {
    searchAllFilter(searchText);
  }
}

function searchAllFilter(searchText) {
  var filteredToDos = toDoListArray.filter(function(toDo) {
    return (toDo.title.toLowerCase().includes(searchText)
  );
  });
  filteredToDos.forEach(function(toDo) {
    displayToDoList(toDo);
  });
};

function searchUrgentToDos(searchText) {
  var filteredUrgentToDos = toDoListArray.filter(function(toDo) {
    return (toDo.title.toLowerCase().includes(searchText) && toDo.urgency === true);
  });
  filteredUrgentToDos.forEach(function(toDo) {
    displayToDoList(toDo);
  });
}

function handleUrgencyBtn() {
  outputField.innerHTML = '';
  if(urgencyFilterBtn.classList.contains('filter-btn-active')) {
    repopulateToDoLists();
    urgencyFilterBtn.classList.remove('filter-btn-active');
    // outputField.removeChild(urgencyPlaceholderText);;
  } else {
    showUrgentToDos();
    urgentPlaceholder();
    // urgencyPlaceholder();
  }
}

function showUrgentToDos() {
  var filteredUrgentToDos = toDoListArray.filter(function(toDo) {
    return toDo.urgency === true;
  })
  filteredUrgentToDos.forEach(function(toDo) {
    displayToDoList(toDo);
  })
  urgencyFilterBtn.classList.add('filter-btn-active');
}

function handleBtns() {
  var listItems = document.querySelectorAll('.form__list');
  makeListBtn.disabled = !formInputTitle.value || !listItems.length; 
  clearBtn.disabled = !formInputTitle.value && !taskItemInput.value && !listItems.length; 
  taskItemBtn.disabled = !taskItemInput.value;
}

function clearAll() {
  formInputTitle.value = "";
  taskItemInput.value = "";
  formOutput.innerHTML = "";
  handleBtns();
}

function placeholder() {
  if (toDoListArray.length === 0) {
    placeholderText.classList.remove('hidden');
  }
}

function urgentPlaceholderOnLoad() {
  outputField.removeChild(urgencyPlaceholderText);
}

function urgentPlaceholder() {
  var filteredToDos = toDoListArray.filter(function(toDo) {
    return (toDo.urgency === true)
  });
  if (filteredToDos.length == 0) {
    outputField.appendChild(urgencyPlaceholderText);
  }
}