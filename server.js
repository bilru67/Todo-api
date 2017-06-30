var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');

var app = express();
var PORT = process.env.PORT || 3000;
//var todos = [];
//var todoNextID = 1;

app.use(bodyParser.json());



app.get('/', function(req, res) {
	res.send('Todo API Root' + todos.length.toString());

});

app.get('/todos', function(req, res) {

//	var filteredTodos = todos;
	var query = req.query;
	var where = {};

	if(query.hasOwnProperty('completed') && query.completed === 'true'){

		where.completed = true;
	}else if (query.hasOwnProperty('completed') && query.completed === 'false'){
		where.completed = false;
	}

	if(query.hasOwnProperty('q') && query.q.length > 0){
		where.description = {
			$like : '%' + query.q + '%'
		};


	}


	db.todo.findAll({where: where}).then(function (todos){
			res.json(todos);
		    },function(e){
		res.status(500).send();
	});

/*	if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
		filteredTodos = _.where(filteredTodos, {
			completed: true
		});

	} else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
		filteredTodos = _.where(filteredTodos, {
			completed: false
		});

	}
	if (queryParams.hasOwnProperty('description') && queryParams.description.length > 0) {
		filteredTodos = _.filter(filteredTodos, function(todo) {
			return todo.description.toLowerCase().indexOf(queryParams.description.toLowerCase()) > -1;
		});
	}



		filteredTodos.forEach(function(todo){queryParmas.query
			if(todo.description.indexOf(work) > 0){
				todos.push(todo);
			}



	res.json(filteredTodos);
*/

	//need to determine if querry contains filer string
	//req.query will equaly the query string
	//set the query string to a string 
	//need to us sting.indexof(string) and return on element of the array greater than zero
	//foreach through filerted todos
	//call string.indexof on each of the filtered elements
	//add them to a newfiltered todolist

});

app.get('/todos/:id', function(req, res) {

	var todoId = parseInt(req.params.id, 10);

	db.todo.findById(todoId).then(function(todo){
		if(!!todo){
		res.json(todo.toJSON());
	}else{
		res.status(404).send();
	}
	}).catch(function(e){
		res.status(500).send();
	});






/*
	var result = _.findWhere(todos, {
		id: todoId
	});
	var result;
		
		//interate over the todos. find match
		todos.forEach(function(todo){
			if(todoId === todo.id){
				result = todo;		
			}
		});
	
	if (result) {
		res.json(result);
	} else {
		res.status(404).send();
	}

*/


});

app.post('/todos', function(req, res) {
	var body = req.body;

	body = _.pick(body, "description", "completed");

	db.todo.create(body).then(function(todo){
	return res.json(todo.toJSON());
	}, function(e){
	res.status(400).json(e);
	});

});




//Delete todos

app.delete('/todos/:id', function(req, res) {

	var todoId = parseInt(req.params.id, 10);
	var result = _.findWhere(todos, {
		id: todoId
	});

	if (!result) {
		res.status(404).json({
			"error": "no todo found to delete"
		});
	} else {

		todos = _.without(todos, result);
		res.json(result);
	}

});

//Put /todo/:id

app.put('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {
		id: todoId
	});
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

db.sequelize.sync().then(function(){
	app.listen(PORT, function() {
	console.log('express listening on port' + PORT + '!');
	});
});


/*db.sequelize.sync().then(app.listen(PORT, function() {

	console.log('express listening on port' + PORT + '!');
});
*/


