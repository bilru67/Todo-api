var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextID = 1;

app.use(bodyParser.json());



app.get('/', function(req, res){
	res.send('Todo API Root' + todos.length.toString());

});

app.get('/todos', function(req, res){
	var queryParams = req.query;
	var filteredTodos = todos;
	
	
	if(queryParams.hasOwnProperty('completed') && queryParams.completed === 'true'){
		filteredTodos = _.where(filteredTodos, {completed : true});
		
	}else if(queryParams.hasOwnProperty('completed') && queryParams.completed === 'false'){
		filteredTodos = _.where(filteredTodos, {completed :false});
		

	}
	res.json(filteredTodos);

});

app.get('/todos/:id', function(req, res){

	var todoId = parseInt(req.params.id, 10);
	var result = _.findWhere(todos, {id: todoId});
/*	var result;
	
	//interate over the todos. find match
	todos.forEach(function(todo){
		if(todoId === todo.id){
			result = todo;		
		}
	});
*/
	if(result){
		res.json(result);
		}else{
		res.status(404).send();
		}

});



//Post /todos

app.post('/todos', function(req, res){
	var body = req.body;

	body = _.pick(body, "description", "completed");

	body.description = body.description.trim();

	//add id field

	if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0){
		return res.status(400).send();
	}
	body.id = todoNextID;
	todoNextID++;
	todos.push(body);


	//push body into array
	
//	console.log('description: ' + body.description);

	res.json(body);
});

//Delete todos

app.delete('/todos/:id', function(req, res){

	var todoId = parseInt(req.params.id, 10);
	var result = _.findWhere(todos, {id: todoId});

	if(!result){
				res.status(404).json({"error": "no todo found to delete"});
		}else{

				todos = _.without(todos, result);
				res.json(result);
				}

});

//Put /todo/:id

app.put('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {id: todoId});
	var body = _.pick(req.body, 'description', 'completed');
	var validAttributes = {};

	if (!matchedTodo) {
		return res.status(404).send();
	}

	if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
		validAttributes.completed = body.completed;
	} else if (body.hasOwnProperty('completed')) {
		return res.status(400).send();
	}

	if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
		validAttributes.description = body.description;
	} else if (body.hasOwnProperty('description')) {
		return res.status(400).send();
	}

	_.extend(matchedTodo, validAttributes);
	res.json(matchedTodo);
});

app.listen(PORT, function(){

	console.log('express listening on port' + PORT + '!');
});