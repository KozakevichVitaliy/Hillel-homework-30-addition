const form = document.getElementById('form');
const input = document.getElementById('input');
const status = document.getElementById('done');
const list = document.getElementById('todos-list');
let todos = []
let inputValue;

// CRUD functions
async function App () {
    todos = await getTodos()
    renderTodo()
    countDoneStatus()
}

async function getTodos() {
    try {
        let response = await fetch('https://6ace3a4af338359cf1c34b0b.mockapi.io/todos');
        let data = await response.json();
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
function createDomElement(elementName, className, dataName, dataValue) {
    const domElement = document.createElement(elementName);
    domElement.classList.add(className);
    if (dataName) domElement.setAttribute(dataName, dataValue);
    return domElement;
}

function insertToList(elem1, elem2) {
    elem2.innerText = 'X'
    elem1.insertAdjacentElement("beforeend", elem2);
    list.insertAdjacentElement("beforeend", elem1);
}

function renderTodo({ li, button } = {}) {
    if (li && button) {
        li.innerText = inputValue;
        insertToList(li, button)
    } else if (todos.length) {
        todos.forEach(({
            id,
            text,
            done
        }) => {
            const li = createDomElement('li', 'todo');
            const button = createDomElement('button', 'todo__btn--delete');
            li.id = id;
            li.innerText = text;
            li.setAttribute('data-done', done);
            insertToList(li, button);
        })
    }
}

function countDoneStatus() {
    const doneStatusCount = document.querySelectorAll('[data-done="true"]');
    const todosCount = document.querySelectorAll('.todo');
    
    status.innerText = `Виконано: ${doneStatusCount.length}/${todosCount.length}`;
}


// Handlers and Listeners
function handleSumbitForm() {
    if (!inputValue) return null;
    
    renderTodo({
        li: createDomElement('li', 'todo', 'data-done', false),
        button: createDomElement('button', 'todo__btn--delete')
    })
    postTodo({
        text: inputValue, 
        done: false
    }) 
    countDoneStatus()
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
    countDoneStatus()
})


App()

