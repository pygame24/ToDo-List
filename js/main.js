// Находим элементы на странице
const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');

let tasks = [];

if (localStorage.getItem('tasks')) {
	tasks = JSON.parse(localStorage.getItem('tasks')); // получаем из строки массив
	tasks.forEach(task => renderTask(task));
}

checkEmptyList();

// Submit — это событие в JavaScript, которое 
// возникает, когда пользователь отправляет валидную форму.

form.addEventListener('submit', addTask); // не ставим скобки, () - потому что сразу будет выполняться

tasksList.addEventListener('click', deleteTask);

tasksList.addEventListener('click', doneTask);


function addTask(event) {
    // Отменяем отправку формы
    event.preventDefault();

    // Достаем текст задачи из поля ввода
    const taskText = taskInput.value;

	// Описываем задачу в виде объекта

	const newTask = {
		id: Date.now(), // сфомированная за милисекнду
		text: taskText,
		done: false,
	};

	// Добавляем задачу в массив
	tasks.push(newTask);

	renderTask(newTask);

	// Очищаем поле ввода и возвращаем фокус на него

	taskInput.value = "";
	taskInput.focus();

	checkEmptyList();
	saveToLocalStorage();
}

function deleteTask(event) {
	// Проверяем что клик был по кнопке "удалить задачу"
	if (event.target.dataset.action !== 'delete') return;

	const parentNode = event.target.closest('li');

	// Определяем ID задачи
	const id = Number(parentNode.id);

	tasks = tasks.filter((task) => task.id !== id);

	parentNode.remove();

	checkEmptyList();
	saveToLocalStorage();
};

function doneTask(event) {
	if (event.target.dataset.action !== "done") return;
	
	const parentNode = event.target.closest('li');

	const id = Number(parentNode.id);
	const task = tasks.find((task) => task.id === id);
	task.done = !task.done;

	const spanTitle = parentNode.querySelector('.task-title');
	spanTitle.classList.toggle('task-title--done');

	saveToLocalStorage();
}


function checkEmptyList() {
	if (tasks.length === 0) {
		const emptyListHTML = `
			<li id="emptyList" class="list-group-item empty-list">
				<img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
				<div class="empty-list__title">Список дел пуст</div>
			</li>
		`;
		tasksList.insertAdjacentHTML('afterbegin', emptyListHTML);
	}
	if (tasks.length > 0) {
		const emptyListEl = document.querySelector('#emptyList');
		emptyListEl ? emptyListEl.remove() : null;
	}
}


function saveToLocalStorage() {
	localStorage.setItem('tasks', JSON.stringify(tasks));
}


function renderTask(task) {
	// Формируем css класс
	const cssClass = task.done 
	? "task-title task-title--done" : "task-title";

	// Формируем разметку для новой задачи

	const taskHTML = `
			<li id="${task.id}"class="list-group-item d-flex justify-content-between task-item">
				<span class="${cssClass}">${task.text}</span>
				<div class="task-item__buttons">
					<button type="button" data-action="done" class="btn-action">
						<img src="./img/tick.svg" alt="Done" width="18" height="18">
					</button>
					<button type="button" data-action="delete" class="btn-action">
						<img src="./img/cross.svg" alt="Done" width="18" height="18">
					</button>
				</div>
			</li>`;

	// Добавляем задачу на страницу
	tasksList.insertAdjacentHTML('beforeend', taskHTML);
}