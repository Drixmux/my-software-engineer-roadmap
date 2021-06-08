class Todo {
  constructor(description) {
    this.id = 0;
    this.description = description;
    this.completed = false;
  }
}

class TodoAPI {
  constructor() { }

  /**
   * Sends a request to create a new Todo record in server
   * @param {Todo} todo - Todo record.
   */  
  createTodo(todo) {
    new Promise(function (resolve, reject) {
      var xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/todos");
      xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      
      xhr.onload = function () {
        if (this.status >= 200 && this.status < 300) {
          var response = JSON.parse(xhr.responseText);
          resolve(xhr.response);
        } else {
          // In the reject method, you can send anything related to the error.
          reject({});
        }
      };

      xhr.onerror = function () {
        // In the reject method, you can send anything related to the error.
        reject({});
      };

      xhr.send(JSON.stringify(todo));
    });
  }

  /**
   * Send a request to complete an existing Todo record.
   * @param {number} itemId - Id of the Todo item.
   */  
  completeItem(itemId) {
    new Promise(function (resolve, reject) {
      var xhr = new XMLHttpRequest();

      xhr.open("PATCH", "/api/todos/" + itemId + "/complete");
      xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

      xhr.onload = function () {
        if (this.status >= 200 && this.status < 300) {
          var response = JSON.parse(xhr.responseText);
          resolve(xhr.response);
        } else {
          // In the reject method, you can send anything related to the error.
          reject({});
        }
      };

      xhr.onerror = function () {
        // In the reject method, you can send anything related to the error.
        reject({});
      };

      xhr.send();
    });
  }
}

class TodoManager {
  constructor() {
    this.items = [];
    this.todoAPI = new TodoAPI();
  }

  /**
   * Add a new Todo item to the list of items.
   * @param {string} description - Description of the new item.
   */  
  addItem(description) {
    var todoItem = new Todo(description);

    this.todoAPI.createTodo(todoItem)
      .then(function(response) {
        if (response.id) {
          todoItem.id = response.id;
          this.items.push(todoItem);
        }
      })
      .catch(function (err) {
        // Right here we can handle the error.
      });
  }

  /**
   * Mark the Todo item as completed.
   * @param {number} itemId - Id of the Todo item.
   */  
  completeItem(itemId) {
    this.todoAPI.completeItem(itemId)
      .then(function(response) {
        this.items
          .filter(function(item) {
            return item.id == itemId;
          })
          .map(function(item) {
            item.completed = response.completed;
          });
      })
      .catch(function (err) {
        // Right here we can handle the error.
      });
  }
}

var todoManager = new TodoManager();

todoManager.addItem("Todo 1");
todoManager.addItem("Todo 2");
todoManager.addItem("Todo 3");

todoManager.completeItem(2);
todoManager.completeItem(3);