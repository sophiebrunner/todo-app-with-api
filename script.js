function renderToDoApp() {
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
          console.warn("404. That's an error");
        }
      })
      .then((data) => {
        toDos = data;
        renderToDos();
      });
  }

  function renderToDos() {
    toDoList.innerHTML = "";
    toDos.forEach((toDo) => {
      renderToDo(toDo);

      // newLi.todo = toDo;
    });
  }

  function renderToDo(toDo) {
    const newLi = document.createElement("li");
    newLi.classList.add("to-dos");
    toDoList.appendChild(newLi);

    const checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    checkbox.checked = toDo.done;
    newLi.appendChild(checkbox);

    const toDotxt = document.createTextNode(toDo.description);
    newLi.append(toDotxt);
    newLi.setAttribute("data-id", toDo.id);
  }

  toDoList.addEventListener("change", (e) => {
    const currentId = e.target.parentElement.getAttribute("data-id");
    const updatedToDo = {
      description: e.target.nextSibling.textContent,
      done: e.target.checked,
    };

    fetch("http://localhost:4730/todos/" + currentId, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(updatedToDo),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          console.warn("404. That's an error");
        }
      })
      .then((updatedData) => {
        loadToDos();
        console.log(updatedData);
      });
  });

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
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          console.warn("404. That's an error");
        }
      })
      .then((newToDoFromApi) => {
        toDos.push(newToDoFromApi);

        renderToDo(newToDoFromApi);

        // renderToDos();
      });
  });

  dltBtn.addEventListener("click", () => {
    toDos.forEach((toDo) => {
      const currentId = toDo.id;
      if (toDo.done === true) {
        fetch("http://localhost:4730/todos/" + currentId, {
          method: "DELETE",
        })
          .then((res) => res.json())
          .then((res) => {
            console.log(currentId);
          });
      }
    });
  });

  loadToDos();
}
renderToDoApp();
