const form = document.getElementById('form');
const input = document.getElementById('input');
const status = document.getElementById('done');
const list = document.getElementById('todos-list');
const todosNodes = document.querySelectorAll('.todo');
let todos = []
let inputValue;

// CRUD functions
async function App () {
    todos = await getTodos()
    renderTodos()
    renderDoneStatus()
}

async function getTodos() {
    try {
        const response = await fetch('https://6ace3a4af338359cf1c34b0b.mockapi.io/todos');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Сталася помилка під час завантаження:", error);
    }
}

async function postTodo(todo) {
    try {
        await fetch('https://6ace3a4af338359cf1c34b0b.mockapi.io/todos', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(todo)
        });
    } catch (error) {
        console.error("Сталася помилка під час завантаження:", error);
    }
}

async function updateTodo(id, done) {
    try {
        await fetch(`https://6ace3a4af338359cf1c34b0b.mockapi.io/todos/${id}`, {
            method: 'PUT',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({ done: done })
        });
    } catch (error) {
        console.error("Сталася помилка під час завантаження:", error);
    }
}

async function deleteTodo(id) {
    try {
        await fetch(`https://6ace3a4af338359cf1c34b0b.mockapi.io/todos/${id}`, {
            method: 'DELETE'
        });
    } catch (error) {
        console.error("Сталася помилка під час завантаження:", error);
    }
}


// DOM manipulations
function createDomElement(elementName, className, content, dataName, dataValue) {
    const domElement = document.createElement(elementName);
    domElement.classList.add(className);
    domElement.innerText = content;
    if (dataName) domElement.setAttribute(dataName, dataValue);
    return domElement;
}

function insertTodosToList(todo, ...childNodes) {
    childNodes.forEach(item => todo.insertAdjacentElement("beforeend", item))
    list.insertAdjacentElement("beforeend", todo);
}

function renderTodos() {
    if (inputValue) {
        const li = createDomElement('li', 'todo', inputValue, 'data-done', false);
        const btnDelete = createDomElement('button', 'todo__btn--delete', 'X');
        insertTodosToList(li, btnDelete)
    } else if (todos.length) {
        todos.forEach(({
            id,
            text,
            done
        }) => {
            const li = createDomElement(
                'li', 
                'todo',
                text, 
                'data-done',
                done
            );
            const button = createDomElement('button', 'todo__btn--delete', 'X');
            li.id = id;
            insertTodosToList(li, button);
        })
    }
}

function renderDoneStatus() {
    const doneTodosNodes = document.querySelectorAll('[data-done="true"]');
    const todosNodes = document.querySelectorAll('.todo');
    status.innerText = `Виконано: ${doneTodosNodes.length}/${todosNodes.length}`;
}


// Handlers and Listeners
function handleSumbitForm() {
    if (!inputValue) return null;
    
    renderTodos()
    renderDoneStatus()
    postTodo({
        text: inputValue, 
        done: false
    }) 
    form.reset();
}
input.addEventListener('input', (e) => inputValue = e.target.value.trim());
form.addEventListener('submit', (e) => {
    e.preventDefault()
    handleSumbitForm()
});
list.addEventListener('click', (e) => {
    if( e.target.closest('button')) { 
        e.target.closest('li').remove();
        deleteTodo(e.target.closest('li').id);
    }
    if (e.target.closest('li') && !e.target.closest('button')) {
        let doneStatus = e.target.closest('li').dataset.done;
        doneStatus = doneStatus === 'true' ? false : true;
        e.target.closest('li').dataset.done = doneStatus;
        updateTodo(e.target.closest('li').id, doneStatus);
    }
    renderDoneStatus()
})


App()

