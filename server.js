var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [{
			id: 1, 
	description: 'Meet mom for lunch',
	completed: false
},
			{
		id: 2,
		description: "Go to market",
		completed: false

},
{
	id: 3,
	description: 'Take the do for a walk',
	completetd: false
}];

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

app.listen(PORT, function(){

	console.log('express listening on port' + PORT + '!');
});