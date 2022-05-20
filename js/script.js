'use strict';

const light = document.querySelector('.light');
const dark = document.querySelector('.dark');
const header = document.querySelector('.header');
const form = document.querySelector('.form');
const inputTask = document.querySelector('.form__input');
const taskList = document.querySelector('.main__list--tasks');
const taskLeft = document.querySelector('.tasks-left');
const allBtn = document.querySelector('.all-tasks');
const activeBtn = document.querySelector('.active-tasks');
const completeBtn = document.querySelector('.completed-tasks');
const clearBtn = document.querySelector('.clear');
const mainListSort = document.querySelector('.main__list--sort');

//handling the task

let allTasks = [];

// generate id for the task
const generateId = function () {
  const randomId = Math.random().toString(36).slice(2);
  return randomId;
};

const checkValue = function (value) {
  if (!value || value === ' ') return;
  createObjectTask(value);
};

const createObjectTask = function (value) {
  const task = {
    title: value,
    id: generateId(),
    completed: false,
  };

  allTasks.push(task);
};

//items left in tasks
const showItemsLeft = function (tasks) {
  taskLeft.textContent = `${tasks.length} items left`;
};

const showTasksToUi = function (tasks) {
  taskList.innerHTML = '';
  tasks.forEach((task) => {
    const html = `
    <li data-id = ${task.id} class="item ${task.completed ? 'task-done' : ''}">
    
    <button class="done-btn">
      </button>
    <h2 class="item__title">${task.title}</h2>
      
      <span class="delete pointer">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
        >
          <path
            fill="#494C6B"
            fill-rule="evenodd"
            d="M16.97 0l.708.707L9.546 8.84l8.132 8.132-.707.707-8.132-8.132-8.132 8.132L0 16.97l8.132-8.132L0 .707.707 0 8.84 8.132 16.971 0z"
          />
        </svg>
      </span>
      </li>`;
    taskList.insertAdjacentHTML('afterbegin', html);
  });
  filtered(tasks);
};

//filter the tasks

function filtered(tasks) {
  const filteredTasks = tasks.filter((task) => task.completed === false);
  showItemsLeft(filteredTasks);
}

const taskActiveAndComplete = function (tasks, boolean) {
  const filteredTasks = tasks.filter((task) => task.completed === boolean);
  showTasksToUi(filteredTasks);
};

//prevent default to avoid reload

const preventDefault = function (e) {
  e.preventDefault();
};

// remove active class
const removeActive = function () {
  allBtn.classList.remove('active');
  activeBtn.classList.remove('active');
};

const allBtnActive = function () {
  activeBtn.classList.remove('active');
  completeBtn.classList.remove('active');
  allBtn.classList.add('active');
};
// completed tasks

const handleComplete = function (e, tasks) {
  const item = e.target.closest('.item');
  if (!item) return;
  const itemId = item.getAttribute('data-id');
  if (e.target.parentElement.classList.contains('item')) {
    toggleStatusTaskWith(itemId);
    item.classList.toggle('task-done');
  }

  filtered(tasks);
};

function toggleStatusTaskWith(taskId) {
  for (let i = 0; i < allTasks.length; i++) {
    if (allTasks[i].id == taskId) {
      allTasks[i].completed == false
        ? (allTasks[i].completed = true)
        : (allTasks[i].completed = false);
    }
  }

  setLocalStorage();
}

//delete the object from the array

const deleteTaskObj = function (id) {
  allTasks.forEach((task, i) => {
    if (task.id === id) {
      allTasks.splice(i, 1);
    }
  });
  //load local storage
  setLocalStorage();
};

//delete the task from ui
const deleteTaskUi = function (e) {
  const delBtn = e.target.closest('.delete');
  if (!delBtn) return;
  const item = e.target.closest('.item');
  if (!item) return;
  item.remove();
  deleteTaskObj(item.getAttribute('data-id'));
  showItemsLeft(allTasks);
};

const clearAll = function (tasks) {
  tasks.length = 0;
  showItemsLeft(tasks);
  taskList.innerHTML = '';
  setLocalStorage();
};

form.onsubmit = function (e) {
  preventDefault(e);
  checkValue(inputTask.value);
  inputTask.value = '';
  allBtnActive();
  showTasksToUi(allTasks);
  setLocalStorage();
};

activeBtn.onclick = function (e) {
  preventDefault(e);
  removeActive();
  completeBtn.classList.remove('active');
  activeBtn.classList.add('active');
  taskActiveAndComplete(allTasks, false);
};

completeBtn.onclick = function (e) {
  preventDefault(e);
  removeActive();
  completeBtn.classList.add('active');
  taskActiveAndComplete(allTasks, true);
};

allBtn.onclick = function (e) {
  preventDefault(e);
  allBtnActive();
  showTasksToUi(allTasks);
};

taskList.onclick = function (e) {
  preventDefault(e);
  handleComplete(e, allTasks);
  setLocalStorage();
  deleteTaskUi(e);
};

clearBtn.onclick = function (e) {
  preventDefault(e);
  allBtnActive();
  clearAll(allTasks);
};

getLocalStorage();

function setLocalStorage() {
  localStorage.setItem('tasks', JSON.stringify(allTasks));
}

function getLocalStorage() {
  const data = JSON.parse(localStorage.getItem('tasks'));
  if (!data) return;
  allTasks = data;
  showTasksToUi(allTasks);
}

//getting the root from css
const getAndSetRoot = function () {
  const root = document.querySelector(':root');
  root.style.setProperty('--bg-color', 'hsl(236, 33%, 92%)');
  root.style.setProperty('--task-bg-color', 'hsl(0, 0%, 98%)');
  root.style.setProperty('--text-color-task', 'hsl(235, 19%, 35%)');
  root.style.setProperty('--text-color-sort', 'hsl(235, 19%, 35%)');
};

const getAndSetRootDark = function () {
  const root = document.querySelector(':root');
  root.style.setProperty('--bg-color', 'hsl(235, 21%, 11%)');
  root.style.setProperty('--task-bg-color', 'hsl(235, 24%, 19%)');
  root.style.setProperty('--text-color-task', 'hsl(234, 39%, 85%)');
  root.style.setProperty('--text-color-normal', 'hsl(234, 11%, 52%)');
  root.style.setProperty('--text-color-sort', 'hsl(236, 33%, 92%)');
};

// handle the theme

const theme = function (device) {
  if (dark.classList.contains('hidden')) {
    header.style.backgroundImage = `url('images/bg-${device}-dark.jpg')`;
  }
  dark.onclick = function () {
    if (!dark.classList.contains('hidden')) {
      header.style.backgroundImage = `url('images/bg-${device}-dark.jpg')`;
      dark.classList.add('hidden');
      light.classList.remove('hidden');
      getAndSetRootDark();
    }
  };
  if (light.classList.contains('hidden')) {
    header.style.backgroundImage = `url('images/bg-${device}-light.jpg')`;
  }
  light.onclick = function () {
    if (!light.classList.contains('hidden')) {
      header.style.backgroundImage = `url('images/bg-${device}-light.jpg')`;
      dark.classList.remove('hidden');
      light.classList.add('hidden');
      getAndSetRoot();
    }
  };
};

function responsive(media) {
  if (media.matches) {
    // If media query matches
    theme('mobile');
  } else {
    theme('desktop');
  }
}

const media = window.matchMedia('(max-width: 600px)');
responsive(media);
media.addListener(responsive);
