const body = document.body;

// GET buttons 
const labelAdd = document.getElementById('js-label-add');
const taskInput = document.getElementById('js-new-task');
const buttonAdd = document.getElementById('js-add-button');

// GET the lists
const todoList = document.getElementById('js-incomplete-tasks');
const todoHeader = document.getElementById('js-todo');
const doneList = document.getElementById('js-completed-tasks');
const doneHeader = document.getElementById('js-completed');

// GET checkboxes (using let, because checkboxes can change state from checked to unchecked)
let uncheckedTasks = todoList.querySelectorAll('input[type=checkbox]');
let checkedTasks = doneList.querySelectorAll('input[type=checkbox]');

// GET action-buttons
const saveButton = document.getElementById("js-save");
const deleteButtonTODO = document.getElementById("js-delete-todo");
const deleteButtonDONE = document.getElementById("js-delete-done");
const deleteButtonEveryTime = document.getElementById("js-delete-all"); 

// Number of items in the list
var numTasks = 0; 


// function that gets a random "compliment" from "complimentr.com" using its API
function getCompliments()
{
  let requestURL = 'https://complimentr.com/api';
  let request = new XMLHttpRequest();
  request.open('GET', requestURL);
  request.responseType = 'json';
  request.send();

  request.onload = function() 
  {
    var jsoncompliment = request.response;
    // the phrase is then set in the webpage
    document.getElementById('motivational').innerHTML = jsoncompliment.compliment.toUpperCase();
  }
}

// counts the new length of the TODO list, we have two lengths: 1. TO-DO length (activities not done yet), and DONE length (activities done)
function setNewLength()
{
  var todoListL = todoList.querySelectorAll('input[type=checkbox]').length;
  var doneListL = doneList.querySelectorAll('input[type=checkbox]').length; 

  // SETS a message that contains the number of elements in the two different lists 
  switch(todoListL)
  {
    // we have different phrases, depending on the number of items in the list 
    case 0: 
      document.getElementById('todo-counter').innerHTML = "You have completed every activity, GOOD JOB!";
      break; 
    case 1: 
      document.getElementById('todo-counter').innerHTML = "You are one activity behind. Keep it up!";
      break; 
    default: 
      document.getElementById('todo-counter').innerHTML = "You haven't done " + todoListL + " activities yet. Keep it up!";
  }

  switch(doneListL)
  {
    // we have different phrases, depending on the number of items in the list 
    case 0: 
    document.getElementById('done-counter').innerHTML = "You haven't completed any activities!";
      break; 
    case 1: 
    document.getElementById('done-counter').innerHTML = "You have completed one activity! That's good!";
      break; 
    default: 
      document.getElementById('done-counter').innerHTML = "You have completed " + doneListL + " activities so far.";
  }

  numTasks = todoListL + doneListL; 
}

// function to get the current date, returns a different output depending on the time of the day
// OUTPUT example: [Name of the day of the week] at [hour:minute:second]
function getDate()
{
  var today = new Date(); 
  var h = today.getHours(); 
  var m = today.getMinutes(); 
  var s = today.getSeconds(); 

  h = checkTime(h); 
  m = checkTime(m); 
  s = checkTime(s); 

  var daysOftheWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]; 
  console.log(daysOftheWeek[today.getDay()]); 

  var date = daysOftheWeek[today.getDay()] + " at " + h + ":" + m + ":" + s; 
  return date; 
}

// function used to create clock that updates automatically. Depending on the time of the day, we have different outputs
// OUTPUT example: Good evening, it's [hour:minute:second] 
function startTime()
{
  var today = new Date(); 
  var h = today.getHours(); 
  var m = today.getMinutes(); 
  var s = today.getSeconds(); 

  h = checkTime(h); 
  m = checkTime(m); 
  s = checkTime(s); 

  // if the hour is lower than 12 but greater than 0 that we write "Good morning" 
  if(h >= 0 && h < 12)
  {
      document.getElementById('time').innerHTML = "Good morning, it's: " + h + ":" + m + ":" + s;
  }
  // if the hour is lower than 18 but greater than 1 that we write "Good afternoon" 
  if(h >= 12 && h < 18)
  {
      document.getElementById('time').innerHTML = "Good afternoon, it's: " + h + ":" + m + ":" + s;
  }
  // if the hour is greater of equal to 18 we write "Good evening"
  if(h >= 18)
  {
      document.getElementById('time').innerHTML = "Good evening, it's: " + h + ":" + m + ":" + s;
  }
  // the functions call itself with a timeout
  var t = setTimeout(startTime, 500);
}

// Simple function that corrects the date in case it's formed just by one digit. This way the time looks like a clock
// OUTPUT example: input is "2" -> output is "02"
function checkTime(time)
{
  if(time < 10)
  {
    time = "0" + time; 
  }
  return time; 
}

// function that is loaded "onLoad" in the body tag 
function start()
{
  startTime(); // stars the clock
  setNewLength(); // counts the length of the items in the list
  getCompliments(); // get a new compliment from complimentr.com
  setChecked();  // set checkboxs checked if the activity has been done
  setUnchecked(); // sets checkboxs unchecked if the activity hasn't been done yet 
}

// Checkboxes always checked/unchecked depending on the list
function setChecked()
{ 
  let checkedTasks = doneList.querySelectorAll('input[type=checkbox]');   // gets the input checkboxes
  for(let i = 0; i < checkedTasks.length; i++) 
  {
    checkedTasks[i].checked = true; // sets checked if the item has been already completed
  }
}

// Checkboxes always checked/unchecked depending on the list
function setUnchecked()
{
  let uncheckedTasks = todoList.querySelectorAll('input[type=checkbox]');   // gets the input checkboxes
  for(let i = 0; i < uncheckedTasks.length; i++) 
  {
    uncheckedTasks[i].checked = false; // sets unchecked if the item hasn't been completed yet
  }
}

// Adding new task
const addTask = () => {
  let taskName = taskInput.value;
  let taskDate = getDate(); 

  // checks that taskName isn't null
  if (taskName !== '' && taskName !== ' ') 
  {
    // creates a new task
    let newTask = createNewTask(taskName, taskDate);

    // appends the new child
    todoList.appendChild(newTask); // APPEND the newer child

    setNewLength(); // sets a new length 
    todoList.classList.toggle('show');  
    taskInput.value = '';
  }
}; 

// function made to create a new task, two attributes to pass: 
// 1. taskTitle is the title, the name of the element to add
// 2. datetoappend is the date on which the element was created
const createNewTask = (taskTitle, datetoappend) => {
  let listItem = document.createElement('li');
  let checkBox = document.createElement('input');
  let label = document.createElement('label');
  let labelData = document.createElement('label'); 
  let editInput = document.createElement('input');
  let editButton = document.createElement('button');
  let iconEdit = document.createElement('i');
  let iconDelete = document.createElement('i');
  let deleteButton = document.createElement('button');

  // add the checkbox, the label, the labeldata, and the button to edit
  listItem.className = 'task';
  checkBox.type = 'checkbox';
  checkBox.className = 'task__checkbox';
  editInput.type = 'text';
  editInput.className = 'text-input task__input';
  label.textContent = taskTitle;
  label.className = 'task__title';
  labelData.textContent = datetoappend; 
  labelData.className = 'date'; 
  listItem.appendChild(checkBox);
  listItem.appendChild(label);
  listItem.appendChild(labelData); 
  listItem.appendChild(editInput);

  // adds material icons to the every item 
  iconDelete.className = 'material-icons icon__delete';
  iconDelete.textContent = 'delete';
  deleteButton.className = 'button task__delete';
  deleteButton.appendChild(iconDelete);
  listItem.appendChild(deleteButton);
  iconEdit.className = 'material-icons icon__edit';
  iconEdit.textContent = 'mode_edit';
  editButton.className = 'button task__edit';
  editButton.appendChild(iconEdit);
  listItem.appendChild(editButton);
  return listItem;
};

// Editing task
const editTask = (taskToEdit) => 
{
  let listItem = taskToEdit;
  let editInput = listItem.querySelector('input[type=text]');
  let checkBox = listItem.querySelector('input[type=checkbox]');
  let iconEdit = listItem.getElementsByTagName('i')[1];
  let label = listItem.querySelector('label');
  let containsClass = listItem.classList.contains('is-editing');
  
  if (containsClass) 
  {
    label.innerText = editInput.value;
    iconEdit.innerText = 'mode_edit';
    checkBox.disabled = false;
  } 
  
  else 
  {
    editInput.value = label.innerText;
    iconEdit.innerText = 'playlist_add_check';
    checkBox.disabled = true;
  }

  editInput.addEventListener('keyup', function (e) {
    if (e.which === 13) //enter
    {
      label.innerText = editInput.value;
      iconEdit.innerText = 'mode_edit';
      checkBox.disabled = false;
      listItem.classList.toggle('is-editing');
    }
  });
  listItem.classList.toggle('is-editing');
};

// MOVES an item to the other list (ex. TODO -> DONE, DONE -> TODO)
// we need to pass 
              //  -> 1. listItem: which is the item to move
              //  -> 2. currentList: which is the list in which the item is currently staying in 
const moveToOtherList = (listItem, currentList) => {
  let label = listItem.getElementsByTagName('label')[0];  
  label.classList.toggle('is-done');

  switch (currentList) 
  {
    // In case the item is in the "TO-DO list" which is the incompleted, we then move it to the DONE LIST
    case 'js-incomplete-tasks':
      doneList.appendChild(listItem);
      setNewLength(); 
      break;
    // In case the item is in the "DONE list" which is the completed, we then move it to the TO-DO LIST
    case 'js-completed-tasks':
      todoList.appendChild(listItem);
      setNewLength(); 
      break;
  }
};


// ADD EVENT LISTENERS TO EDIT/DELETE BUTTONS
const whatToDo = (e) => 
{
  let listItem = e.target.parentNode;
  // EDIT-ICON
  if (e.target.classList.contains('icon__edit'))
  {
    listItem = e.target.parentNode.parentNode;
    editTask(listItem);
  } 
  // EDIT-TITLE
  else if (e.target.classList.contains('task__title')) 
  {
    editTask(listItem);
  }
  // DELETE BUTTON
  else if (e.target.classList.contains('icon__delete')) 
  {
    let buttonClicked = e.target.parentNode;
    confirmDialogue(buttonClicked);
  } 
  // CHECKBOX
  else if (e.target.type === 'checkbox') 
  {
    let currentList = listItem.parentNode.id;
    moveToOtherList(listItem, currentList);
  }
};

todoList.addEventListener('click', whatToDo);
doneList.addEventListener('click', whatToDo);
// Accordion
todoHeader.addEventListener('click', () => todoList.classList.toggle('is-hidden'));
doneHeader.addEventListener('click', () => doneList.classList.toggle('is-hidden'));
labelAdd.addEventListener('click', () => 
{
  buttonAdd.classList.toggle('is-hidden');
  taskInput.classList.toggle('is-hidden');
});

// LISTENERS 
// -> 1. ADD A NEW TASK (pressing enter)
taskInput.addEventListener('keydown', function (e) {
  if (e.which === 13) //enter
  {
    addTask(); // calls the method to add a task
  }
});
buttonAdd.addEventListener('click', addTask);

// -> 2. DELETE TO-DO ITEMS LIST 
deleteButtonTODO.addEventListener('click', () =>
    {
      confirmDialogueDeleteAllTODO(deleteButtonTODO); // calls the method that pops the message to confirm action

      setNewLength(); // After we delete all the list, we need to check the new length
    }
); 

// -> 3. DELETE DONE ITEMS LIST 
deleteButtonDONE.addEventListener('click', () =>
    { 
      confirmDialogueDeleteAllDone(deleteButtonDONE); // calls the method that pops the message to confirm action
      setNewLength(); // After we delete all the list, we need to check the new length
    }
); 

// -> 4. DELETE ALL THE LISTS
deleteButtonEveryTime.addEventListener('click', () =>
{ 
  confirmDialogueDeleteAll(deleteButtonEveryTime); // calls the method that pops the message to confirm action
  setNewLength(); // After we delete all the list, we need to check the new length
}
); 

// LOCAL STORAGE -> whenever the user presses "save", all the items get saved in localStorage 
saveButton.addEventListener('click', () => 
{ 
    console.log(todoList.innerHTML.length > 0 ? true : false); // check if length is > 0 (fixing a bug that doesn't allow to save if == 0)

    localStorage.incompleteContent = todoList.innerHTML;   // saves the inner HTML "todolist" into localstorage
    localStorage.completedContent = doneList.innerHTML; // saves the inner HTML "donelist" into localstorage
});

if (localStorage.getItem('incompleteContent')) // gets the content
{
  todoList.innerHTML = localStorage.getItem('incompleteContent'); // sets the list with the old content
}
else
{
  todoList.innerHTML = ""; // in case "incompleteContent" is empty we just set the inner HTML emtpy  
}

if (localStorage.getItem('completedContent')) // gets the content
{
  doneList.innerHTML = localStorage.getItem('completedContent');  // sets the list with the old content
}
else
{
  doneList.innerHTML = "";  // in case "incompleteContent" is empty we just set the inner HTML emtpy  
}

// funtion creates a pop-up when the "DELETE TO-DO" button is pressed
const confirmDialogue = function (buttonClicked) {
  let listItem = buttonClicked.parentNode;
  let ul = listItem.parentNode;
  let noButton = document.createElement('button');
  let yesButton = document.createElement('button');
  let divContainer = document.createElement('div');
  let alertContainer = document.createElement('div');
  alertContainer.className = 'alert';
  noButton.textContent = 'No';
  noButton.setAttribute('class', 'button alert__button alert__button--no');
  yesButton.setAttribute('class', 'button alert__button alert__button--yes');
  yesButton.textContent = 'Yes';
  alertContainer.innerHTML = '<p>Delete this item?</p>';
  alertContainer.appendChild(noButton);
  alertContainer.appendChild(yesButton);
  divContainer.className = 'overlay';
  divContainer.appendChild(alertContainer);
  body.appendChild(divContainer);

  yesButton.addEventListener('click', function () 
  {
    deleteTask(ul, listItem, divContainer);
    setNewLength(); 
  });

  noButton.addEventListener('click', function () 
  {
    body.removeChild(divContainer);
  });
};

const deleteTask = function (ul, listItem, divContainer,) {
  ul.removeChild(listItem);
  body.removeChild(divContainer);
};

// funtion creates a pop-up when the "DELETE TO-DO" button is pressed
const confirmDialogueDeleteAllTODO = function (buttonClicked) {
  let listItem = buttonClicked.parentNode;
  let ul = listItem.parentNode;
  let noButton = document.createElement('button');
  let yesButton = document.createElement('button');
  let divContainer = document.createElement('div');
  let alertContainer = document.createElement('div');
  alertContainer.className = 'alert';
  noButton.textContent = 'No';
  noButton.setAttribute('class', 'button alert__button alert__button--no');
  yesButton.setAttribute('class', 'button alert__button alert__button--yes');
  yesButton.textContent = 'Yes';
  alertContainer.innerHTML = '<p>Are you sure you want to delete every item in the list TO DO?</p>';
  alertContainer.appendChild(noButton);
  alertContainer.appendChild(yesButton);
  divContainer.className = 'overlay';
  divContainer.appendChild(alertContainer);
  body.appendChild(divContainer);

  // IF YES -> 
  yesButton.addEventListener('click', function () 
  {
    // the content of the ul gets deleted
    document.getElementById("js-incomplete-tasks").innerHTML = "";
    body.removeChild(divContainer);
    setNewLength(); 
  });

  // IF NO -> 
  noButton.addEventListener('click', function () 
  {
    // the pop-up gets removed from the screen 
    body.removeChild(divContainer);
  });
};

// funtion creates a pop-up when the "DELETE DONE" button is pressed
const confirmDialogueDeleteAllDone = function (buttonClicked) {
  let listItem = buttonClicked.parentNode;
  let ul = listItem.parentNode;
  let noButton = document.createElement('button');
  let yesButton = document.createElement('button');
  let divContainer = document.createElement('div');
  let alertContainer = document.createElement('div');
  alertContainer.className = 'alert';
  noButton.textContent = 'No';
  noButton.setAttribute('class', 'button alert__button alert__button--no');
  yesButton.setAttribute('class', 'button alert__button alert__button--yes');
  yesButton.textContent = 'Yes';
  alertContainer.innerHTML = '<p>Are you sure you want to delete every item in the list DONE?</p>';
  alertContainer.appendChild(noButton);
  alertContainer.appendChild(yesButton);
  divContainer.className = 'overlay';
  divContainer.appendChild(alertContainer);
  body.appendChild(divContainer);

  // IF YES -> 
  yesButton.addEventListener('click', function () 
  {
    document.getElementById("js-completed-tasks").innerHTML = "";
    body.removeChild(divContainer);
    setNewLength(); 
  });

  // IF NO -> 
  noButton.addEventListener('click', function () 
  {
    // the pop-up gets removed from the screen 
    body.removeChild(divContainer);
  });
};


// funtion creates a pop-up when the "DELETE ALL" button is pressed
const confirmDialogueDeleteAll = function (buttonClicked) {
  let listItem = buttonClicked.parentNode;
  let ul = listItem.parentNode;
  let noButton = document.createElement('button');
  let yesButton = document.createElement('button');
  let divContainer = document.createElement('div');
  let alertContainer = document.createElement('div');
  alertContainer.className = 'alert';
  noButton.textContent = 'No';
  noButton.setAttribute('class', 'button alert__button alert__button--no');
  yesButton.setAttribute('class', 'button alert__button alert__button--yes');
  yesButton.textContent = 'Yes';
  alertContainer.innerHTML = '<p>Are you sure you want to delete every item in the list?</p>';
  alertContainer.appendChild(noButton);
  alertContainer.appendChild(yesButton);
  divContainer.className = 'overlay';
  divContainer.appendChild(alertContainer);
  body.appendChild(divContainer);

  yesButton.addEventListener('click', function () 
  {
    document.getElementById("js-completed-tasks").innerHTML = "";
    document.getElementById("js-incomplete-tasks").innerHTML = "";
    body.removeChild(divContainer);
    setNewLength(); 
  });

  noButton.addEventListener('click', function () 
  {
    body.removeChild(divContainer);
  });
};