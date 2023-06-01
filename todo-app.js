(function () {
  //создаем и возвращаем заголовок приложения
  function createAppTitle(title) {
    let appTitle = document.createElement("h2");
    appTitle.innerHTML = title;
    return appTitle;
  }

  //создаем и возвращаем форму для создания дела
  function createTodoItemForm() {
    let form = document.createElement("form");
    let input = document.createElement("input");
    let buttonWrapper = document.createElement("div");
    let button = document.createElement("button");

    form.classList.add("input-group", "mb-3");
    input.classList.add("form-control");
    input.placeholder = "Введите название нового дела";
    buttonWrapper.classList.add("input-group-append");
    button.classList.add("btn", "btn-primary");
    button.textContent = "Добавить дело";

    input.setAttribute("id", "input");
    button.setAttribute("id", "button");

    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper);

    button.disabled = true;
    input.addEventListener("input", function () {
      button.disabled = input.value === "";
    });

    // <form class="input-group mb-3">
    //  <input class="form-control" placeholder="Введите название дела">
    //     <div class="input-group-append">
    //         <button class="btn btn-primary">Добавить дело</button>
    //     </div>
    // </form>

    return {
      form,
      input,
      button,
    };
  }

  //создаем и возвращаем список элементов
  function createTodoList() {
    let list = document.createElement("ul");
    list.classList.add("list-group");
    return list;
  }

  function createTodoItem(name) {
    let item = document.createElement("li");
    //кнопки помещаем в элемент, который красиво покажет их в одной группе
    let buttonGroup = document.createElement("div");
    let doneButton = document.createElement("button");
    let deleteButton = document.createElement("button");

    //устанавливаем стили для элементов списка, а также для размещения кнопок
    //в его правой части с помощью flex
    item.classList.add(
      "list-group-item",
      "d-flex",
      "justify-content-between",
      "align-items-center"
    );
    item.textContent = name;

    buttonGroup.classList.add("btn-group", "btn-group-sm");
    doneButton.classList.add("btn", "btn-success", "mr-2");
    doneButton.textContent = "Готово";
    deleteButton.classList.add("btn", "btn-danger");
    deleteButton.textContent = "Удалить";

    //вкладываем кнопки в отдельный элемент чтобы они объеденились в однин блок
    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);

    //приложению нужен доступ к самому элементу и иконкам, чтобы обрабатывать события нажатия
    return {
      item,
      doneButton,
      deleteButton,
    };
  }

  function createTodoApp(
    container,
    title = "Список дел",
    arrayTasks = [],
    keyTodo
  ) {
    let todoAppTitle = createAppTitle(title);
    let todoItemForm = createTodoItemForm();
    let todoList = createTodoList();

    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);

    let todosFromStorage = JSON.parse(localStorage.getItem(keyTodo));

    if (todosFromStorage === null) {
      todosFromStorage = arrayTasks;
    }
    let todos = [];

    if (todosFromStorage) {
      todos = todosFromStorage;
    } else {
      todos = arrayTasks;
      localStorage.setItem(keyTodo, JSON.stringify(arrayTasks));
    }

    // создание задач по-умолчанию
    for (const todo of todos) {
      let todoDefaultTask;
      let taskString = JSON.stringify(todo.name);
      todoDefaultTask = createTodoItem(taskString);

      // обработчики для задач по-умолчанию
      todoDefaultTask.doneButton.addEventListener("click", function () {
        todoDefaultTask.item.classList.toggle("list-group-item-success");

        for (let i = 0; i < todosFromStorage.length; i++) {
          if (todo.name === todosFromStorage[i].name) {
            if (todosFromStorage[i].done === true) {
              todosFromStorage[i].done = false;
            } else {
              todosFromStorage[i].done = true;
            }
          }
        }
        localStorage.setItem(keyTodo, JSON.stringify(todosFromStorage));
      });
      todoDefaultTask.deleteButton.addEventListener("click", function () {
        if (confirm("Вы уверены?")) {
          todoDefaultTask.item.remove();
          for (let i = 0; i < todosFromStorage.length; i++) {
            if (todo.name === todosFromStorage[i].name) {
              todosFromStorage.splice(i, 1);
              localStorage.setItem(keyTodo, JSON.stringify(todosFromStorage));
            }
          }
        }
      });

      todoDefaultTask.item.classList.toggle(
        "list-group-item-success",
        todo.done
      );
      todoList.append(todoDefaultTask.item);
    }
    //браузер создаёт событие sibmit на форме по нажатию на Enter или на кнопку создания дела
    todoItemForm.form.addEventListener("submit", function (e) {
      // удаление фокуса с button
      button.blur();

      //эта строчка необходима, чтобы предотвратить стандартное действие браузера
      //в данном случае мы не хотим, чтобы страница не перезагружалась при отправке формы
      e.preventDefault();

      //игнорируем создание элемента, если пользователь ничего не ввёл в поле
      if (!todoItemForm.input.value) {
        return;
      }

      let todoItem = createTodoItem(`"${todoItemForm.input.value}"`);

      let obj = { name: todoItemForm.input.value, done: false };
      todosFromStorage.push(obj);
      localStorage.setItem(keyTodo, JSON.stringify(todosFromStorage));

      console.log(obj);
      //добавляем обработчики на кнопки
      todoItem.doneButton.addEventListener("click", function () {
        todoItem.item.classList.toggle("list-group-item-success");
        if (obj.done === true) {
          obj.done = false;
        } else {
          obj.done = true;
        }
        localStorage.setItem(keyTodo, JSON.stringify(todosFromStorage));
      });

      todoItem.deleteButton.addEventListener("click", function () {
        if (confirm("Вы уверены?")) {
          todoItem.item.remove();
          for (let i = 0; i < todosFromStorage.length; i++) {
            if (obj.name === todosFromStorage[i].name) {
              todosFromStorage.splice(i, 1);
              localStorage.setItem(keyTodo, JSON.stringify(todosFromStorage));
            }
          }
        }
      });

      //создаём и добавляем в список новое дело с названием из поля для ввода
      todoList.append(todoItem.item);

      //обнуляем значение в поле, чтобы не пришлось стирать его в ручную
      todoItemForm.input.value = "";
    });
  }

  window.createTodoApp = createTodoApp;
})();
