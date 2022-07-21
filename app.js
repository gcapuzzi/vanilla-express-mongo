/**this is the entry point
 * Example of todo app: uses MongoDB
 * example of todo item: {
    "id": 11,
    "title": "test",
    "description": "test",
    "completed": true,
    "_id": "ObjectId('...')"
}
*/

const http = require("http");
const Todo = require("./controller");
const { getReqData } = require("./utils");
const express = require('express');
const app = express();

const PORT = process.env.PORT || 9000;

async function handleGetRequest(req, res){
    // /api/todos : GET
    if ((req.url === "/api/todos")) {
        // get the todos.
        const todos = await new Todo().getTodos();
        // set the status code, and content-type
        res.writeHead(200, { "Content-Type": "application/json" });
        // send the data
        res.end(JSON.stringify(todos));
    }

    // /api/todos/:id : GET
    else if (req.url.startsWith('/api/todos/')) {
        try {
            // get id from url
            const id = req.url.split("/")[3];
            // get todo
            const todo = await new Todo().getTodo(id);
            // set the status code and content-type
            res.writeHead(200, { "Content-Type": "application/json" });
            // send the data
            res.end(JSON.stringify(todo));
        } catch (error) {
            // set the status code and content-type
            res.writeHead(404, { "Content-Type": "application/json" });
            console.log(error);
            // send the error
            res.end(JSON.stringify({ message: error }));
        }
    }else{
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Route not found" }));
    }
}

async function handleDeleteRequest(req, res){
    if(req.url.startsWith('/api/todos/')){
        try {
            // get the id from url
            const id = req.url.split("/")[3];

            // delete todo
            let message = await new Todo().deleteTodo(id);
            // set the status code and content-type
            res.writeHead(200, { "Content-Type": "application/json" });
            // send the message
            res.end(JSON.stringify({ message }));
        } catch (error) {
            // set the status code and content-type
            res.writeHead(404, { "Content-Type": "application/json" });
            console.log(error);
            // send the error
            res.end(JSON.stringify({ message: error }));
        }
    }else{
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Route not found" }));
    }
}

async function handlePostRequest(req, res){
    if (req.url === "/api/todos"){
        // get the data sent along
        let todo_data = await getReqData(req);
        // create the todo
        let todo = await new Todo().createTodo(JSON.parse(todo_data));
        // set the status code and content-type
        res.writeHead(200, { "Content-Type": "application/json" });
        //send the todo
        res.end(JSON.stringify(todo));
    }else{
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Route not found" }));
    }
}

async function handlePutRequest(req, res){
    if (req.url.startsWith("/api/todos")){
        try {
            // get the id from the url
            const id = req.url.split("/")[3];
            let todo_data = await getReqData(req);
            // update todo
            let updated_todo = await new Todo().updateTodo(id, todo_data);
            // set the status code and content-type
            res.writeHead(200, { "Content-Type": "application/json" });
            // send the message
            res.end(JSON.stringify(updated_todo));
        } catch (error) {
            // set the status code and content type
            res.writeHead(404, { "Content-Type": "application/json" });
            console.log(error);
            // send the error
            res.end(JSON.stringify({ message: error }));
        }
    }else{
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Route not found" }));
    }
}

app.get('/api/todos(/*)?', function (req, res) {
    return handleGetRequest(req, res);
});

app.post('/api/todos', function (req, res) {
    return handlePostRequest(req, res);
});

app.put('/api/todos/*', function (req, res) {
    return handlePutRequest(req, res);
});

app.delete('/api/todos/*', function (req, res) {
    return handleDeleteRequest(req, res);
});

app.listen(PORT, () => {
    console.log(`server started on port: ${PORT}`);
});