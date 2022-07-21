const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

// database
const database = client.db('node_database');
// collection of documents
let todos = database.collection('todos');

class Controller {
    // getting all todos
    async getTodos() {
        // return all todos
        const data = await todos.find({}).toArray();
        return new Promise((resolve, _) => resolve(data));
    }

    // getting a single todo
    async getTodo(countid) {
        // get the todo
        const query = {id: parseInt(countid)};
        const todo = await todos.findOne(query);
        return new Promise((resolve, reject) => {
            if (todo) {
                // return the todo
                resolve(todo);
            } else {
                // return an error
                reject(`Todo with id ${id} not found `);
            }
        });
    }

    // creating a todo
    async createTodo(todo) {
        // get the todo
        const result = await todos.insertOne(todo);
        return new Promise((resolve, reject) => {
            if(result){
                // return the todo
                resolve(todo);
                
            }else{
                reject(`cannot insert item ${result}`);
            }
        });
    }

    // updating a todo
    async updateTodo(countid, todo_data) {
        // get the todo
        const query = {id: parseInt(countid)};
        const todo = await todos.updateOne(query, {$set: JSON.parse(todo_data)});
        return new Promise((resolve, reject) => {
            // if no todo, return an error
            if (!todo) {
                reject(`No todo with id ${id} found`);
            }else{
                // return the updated todo
                resolve(todo);
            }
        });
    }

    // deleting a todo
    async deleteTodo(countid) {
        // get the todo
        const query = {id: parseInt(countid)};
        const todo = await todos.deleteOne(query)
        return new Promise((resolve, reject) => {
            // if no todo, return an error
            if (!todo) {
                reject(`No todo with id ${id} found`);
            }
            // else, return a success message
            resolve(`Todo deleted successfully`);
        });
    }
}
module.exports = Controller;