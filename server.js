var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextID = 1;

app.use(bodyParser.json());



app.get('/', function(req, res){
	res.send('Todo API Root' + todos.length.toString());

});

app.get('/todos', function(req, res){
	res.json(todos);
});

app.get('/todos/:id', function(req, res){

	var todoId = parseInt(req.params.id, 10);
	var result;
	
	//interate over the todos. find match
	todos.forEach(function(todo){
		if(todoId === todo.id){
			result = todo;		
		}
	});

	if(result){
		res.json(result);
		}else{
		res.status(404).send();
		}

});

//Post /todos

app.post('/todos', function(req, res){
	var body = req.body;
	//add id field
	body.id = todoNextID;
	todoNextID++;
	todos.push(body);


	//push body into array
	
//	console.log('description: ' + body.description);

	res.json(body);
});

app.listen(PORT, function(){

	console.log('express listening on port' + PORT + '!');
});