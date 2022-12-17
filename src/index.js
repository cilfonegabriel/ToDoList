import './style.css';
import ToDoList from './modules/ToDoList.js';
import Task from './modules/Task.js';
import createTaskDOM from './modules/taskEvents.js';
import * as storage from './modules/localStorageFunctions.js';

const toDoList = new ToDoList();
toDoList.taskList = storage.load('tasks');

const taskList = document.querySelector('.to-do-list');

function addtrashlistenner() {
  const trashCans = document.querySelectorAll('#trash');
  trashCans.forEach((bin) => {
    bin.addEventListener('click', () => {
      const index = (Array.prototype.indexOf.call(
        bin.parentElement.parentElement.children, bin.parentElement,
      ));
      toDoList.removeTask(index);
      storage.save('tasks', toDoList.taskList);
      bin.parentElement.remove();
    });
    bin.addEventListener('mousedown', (evt) => evt.preventDefault());
  });
}

function addCheckBoxListener(checkbox) {
  const checkboxes = document.querySelectorAll('.checkbox');
  checkbox.addEventListener('change', () => {
    const boxIndex = Array.prototype.indexOf.call(checkboxes, checkbox);
    toDoList.taskList[boxIndex].completed = !toDoList.taskList[boxIndex].completed;
    storage.save('tasks', toDoList.taskList);
  });
}

function populateList(emptyList) {
  emptyList.sortTasks();
  for (let i = 0; i < emptyList.taskList.length; i += 1) {
    const temp = createTaskDOM(emptyList.taskList[i].description, emptyList.taskList[i].completed);
    taskList.appendChild(temp);
    addCheckBoxListener(temp.children[0]);
    temp.children[1].addEventListener('blur', () => {
      emptyList.taskList[i].description = temp.children[1].value;
      temp.children[3].classList.remove('hidden');
      temp.children[2].classList.add('hidden');
      temp.classList.toggle('focus');
      storage.save('tasks', toDoList.taskList);
    });
  }
}

populateList(toDoList);
storage.save('tasks', toDoList.taskList);
const form = document.querySelector('form');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const desc = form.children[0].value;
  if (!desc) return;
  const newTaskDOM = createTaskDOM(desc, false);
  taskList.appendChild(newTaskDOM);
  addCheckBoxListener(newTaskDOM.children[0]);
  form.children[0].value = '';
  const newTask = new Task(desc, toDoList.taskList.length);
  toDoList.addTask(newTask);
  toDoList.updateTaskIndex();
  storage.save('tasks', toDoList.taskList);
  addtrashlistenner();
});

const clearAll = document.querySelector('.clear-all');
clearAll.addEventListener('click', () => {
  const len = taskList.children.length;
  for (let i = len - 1; i >= 0; i -= 1) {
    if (taskList.children[i].children[0].checked) {
      taskList.removeChild(taskList.children[i]);
    }
  }
  toDoList.removeCompleted();
  toDoList.sortTasks();
  toDoList.updateTaskIndex();
  storage.save('tasks', toDoList.taskList);
});

addtrashlistenner();

const reload = document.querySelector('.reload');
reload.addEventListener('click', () => {
  taskList.innerHTML = '';
  populateList(toDoList);
});