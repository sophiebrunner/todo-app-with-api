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
    const checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    const toDotxt = document.createTextNode(toDo.description);

    newLi.appendChild(checkbox);
    newLi.appendChild(toDotxt);
    toDoList.appendChild(newLi);

    if (toDo.done === true) {
      checkbox.checked = true;
    } else {
      checkbox.checked = false;
    }

    newLi.addEventListener("click", () => {
      let currentId = toDo.id;
      if (checkbox.checked === true) {
        toDo.done = true;
        uptdatedToDo = {
          id: currentId,
          description: toDo.description,
          done: true,
        };
        fetch("http://localhost:4730/todos/" + currentId, {
          method: "PUT",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(uptdatedToDo),
        })
          .then((res) => res.json())
          .then((uptdatedToDoFromApi) => {
            console.log(uptdatedToDoFromApi);
          });
      } else {
        toDo.done = false;
        uptdatedToDo = {
          id: currentId,
          description: toDo.description,
          done: false,
        };
        fetch("http://localhost:4730/todos/" + currentId, {
          method: "PUT",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(uptdatedToDo),
        })
          .then((res) => res.json())
          .then((uptdatedToDoFromApi) => {
            console.log(uptdatedToDoFromApi);
          });
      }
    });
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

dltBtn.addEventListener("click", () => {
  toDos.forEach((toDo) => {
    let currentId = toDo.id;
    if (toDo.done === true) {
      fetch("http://localhost:4730/todos/" + currentId, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then(() => {
          console.log("All Done To Dos deleted.");
        });
    }
  });
});

loadToDos();
