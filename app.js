const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const databasePath = path.join(__dirname, "todoApplication.db");

const app = express();

app.use(express.json());

let database = null;

const initializeDbAndServer = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });

    app.listen(3000, () =>
      console.log("Server Running at http://localhost:3000/")
    );
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

app.get("/todos/", async (request, response) => {
  const { search_q = "", priority, status } = request.query;

  if (priority === "HIGH") {
    const getAllTodos = `
           SELECT 
             * 
           FROM 
           todo 
           WHERE 
           priority = '${priority}';`;

    const allTodos = await database.all(getAllTodos);
    response.send(allTodos);
  } else if (status === "TO DO") {
    const getAllTodos = `
           SELECT 
             * 
           FROM 
           todo 
           WHERE 
           status = '${status}';`;

    const allTodos = await database.all(getAllTodos);
    response.send(allTodos);
  } else if (status === "HIGH" && priority === "IN PROGRESS") {
    const getAllTodos = `
           SELECT 
             * 
           FROM 
           todo 
           WHERE 
           status = '${status}'
           AND priority = '${priority}';`;

    const allTodos = await database.all(getAllTodos);
    response.send(allTodos);
  } else {
    const getAllTodos = `
           SELECT 
             * 
           FROM 
           todo 
           WHERE 
           todo LIKE '%${search_q}%'`;

    const allTodos = await database.all(getAllTodos);
    response.send(allTodos);
  }
});

app.get("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;

  const getTodo = `
  SELECT
  *
  FROM 
  todo
  WHERE 
  id = ${todoId};`;

  const todoList = await database.get(getTodo);
  response.send(todoList);
});

app.post("/todos/", async (request, response) => {
  const { id, todo, priority, status } = request.body;

  const addTodo = `
  INSERT INTO todo (id, todo, priority, status)
  VALUES ('${id}', '${todo}', '${priority}', '${status}');`;

  await database.run(addTodo);
  response.send("Todo Successfully Added");
});

app.put("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const { status, priority, todo } = request.body;

  if (status === "DONE") {
    const updateTodo = `
    SELECT
    *
    FROM 
    todo 
    WHERE 
    id = ${todoId};`;
    const updatedTodo = await database.run(updateTodo);
    response.send("Status Updated");
  } else if (priority === "HIGH") {
    const updateTodo = `
    SELECT
    *
    FROM 
    todo 
    WHERE 
    id = ${todoId};`;
    const updatedTodo = await database.run(updateTodo);
    response.send("Priority Updated");
  } else {
    const updateTodo = `
    SELECT
    *
    FROM 
    todo 
    WHERE 
    id = ${todoId};`;
    const updatedTodo = await database.run(updateTodo);
    response.send("Todo Updated");
  }
});

app.delete("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;

  const deleteTodo = `
  DELETE FROM todo 
  WHERE 
  id = ${todoId};`;
  const deletedTodo = await database.run(deleteTodo);
  response.send("Todo Deleted");
});

module.exports = app;
