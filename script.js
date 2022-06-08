const userInput = document.querySelector("#new-todo");
const addBtn = document.querySelector("#btn-add");
const dltBtn = document.querySelector("#btn-delete");
const toDoList = document.querySelector("#todo-list");

let toDos = [];

function loadToDos() {
  fetch("http://localhost:4730/todos")
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        console.warn("404 - resource not found");
      }
    })
    .then((toDosFromApi) => {
      toDos = toDosFromApi;
      renderToDos();
    });
}

function renderToDos() {
  toDoList.innerHTML = "";
  toDos.forEach((toDo) => {
    const newLi = document.createElement("li");
    const toDotxt = document.createTextNode(toDo.description);

    newLi.appendChild(toDotxt);
    toDoList.appendChild(newLi);
  });
}

addBtn.addEventListener("click", () => {
  const newToDoTxt = userInput.value;
  const newToDo = {
    description: newToDoTxt,
    done: false,
  };

  fetch("http://localhost:4730/todos", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(newToDo),
  })
    .then((res) => res.json())
    .then((newToDoFromApi) => {
      toDos.push(newToDoFromApi);
      renderToDos();
    });
});

loadToDos();
