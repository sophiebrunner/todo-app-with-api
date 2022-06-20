function renderToDoApp() {
  const userInput = document.querySelector("#new-todo");
  const addBtn = document.querySelector("#btn-add");
  const dltBtn = document.querySelector("#btn-delete");
  const toDoList = document.querySelector("#todo-list");

  toDoList.addEventListener("change", updateToDo);
  addBtn.addEventListener("click", addToDo);
  dltBtn.addEventListener("click", deleteDoneToDos);

  let toDos = [];
  loadToDos();

  function loadToDos() {
    fetch("http://localhost:4730/todos")
      .then((res) => resBackend(res))
      .then((toDosFromApi) => {
        toDos = toDosFromApi;
        renderToDos();
      });
  }

  function resBackend(res) {
    if (res.ok) {
      return res.json();
    } else {
      console.warn("404. That's an error");
    }
  }

  function renderToDos() {
    toDoList.innerHTML = "";
    toDos.forEach((toDo) => {
      renderSingleToDo(toDo);
      // newLi.todo = toDo;
    });
  }

  function renderSingleToDo(toDo) {
    const newLi = document.createElement("li");
    newLi.classList.add("to-dos");
    toDoList.appendChild(newLi);

    const checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    checkbox.checked = toDo.done;
    newLi.appendChild(checkbox);

    const label = document.createElement("label");
    label.setAttribute("for", toDo.id);

    const toDotxt = document.createTextNode(toDo.description);
    label.appendChild(toDotxt);

    newLi.appendChild(label);
    newLi.setAttribute("id", toDo.id);
  }

  function addToDo() {
    const newToDo = new toDo();

    fetch("http://localhost:4730/todos", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(newToDo),
    })
      .then((res) => resBackend(res))
      .then((newToDoFromApi) => {
        toDos.push(newToDoFromApi);
        renderSingleToDo(newToDoFromApi);
      });
  }
  class toDo {
    constructor(description, done) {
      this.description = userInput.value;
      this.done = false;
    }
  }

  function updateToDo(e) {
    const currentId = e.target.parentElement.getAttribute("id");
    const updatedToDo = {
      description: e.target.nextSibling.textContent,
      done: e.target.checked,
    };

    fetch("http://localhost:4730/todos/" + currentId, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(updatedToDo),
    })
      .then((res) => resBackend(res))
      .then(() => {
        loadToDos();
      });
  }

  function deleteDoneToDos() {
    toDos.forEach((toDo) => {
      const currentId = toDo.id;
      if (toDo.done === true) {
        fetch("http://localhost:4730/todos/" + currentId, {
          method: "DELETE",
        }).then((res) => resBackend(res));
      }
    });
  }
}
renderToDoApp();
