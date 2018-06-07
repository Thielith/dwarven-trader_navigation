var mysql = require('mysql'); 
var io = require('socket.io').listen(33333);
const {exec} = require('child_process');

var con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "p2950",
	database: "test_dwarven"
})

function updateDatabase(){
	var e = "python tick.py"
	exec(e);
}

function loopDelay(){
	setTimeout(function () {
		console.log("------------------")
		updateDatabase()
		loopDelay()
		io.local.emit('getYourPos')
	}, 3000)
}
loopDelay()

io.sockets.on('connection', function (socket) {
	var clientIp = socket.request.connection.remoteAddress;
	console.log("Someone From " + clientIp + " Connected")
	
	socket.on('locations', function(){
		var sql = "SELECT * FROM locations;"
		con.query(sql, function(err, result){
			if (err) throw err;
			socket.emit('locations', result);
		})
	})
	
	socket.on('getPlayerPos', function(info){
		var sql = "SELECT * FROM playerPos where playerID = " + info + ";"
		con.query(sql, function(err, result){
			if (err) throw err;
			socket.emit('getPlayerPos', result)
		})
	})
	
	socket.on('locationNames', function(info){
		var sql = "SELECT * FROM locations_e"
		con.query(sql, function(err, result){
			if (err) throw err;
			socket.emit('locationNames', result)
		})
	})
	
	socket.on('newPosPlayer', function(info){
		var sql = "UPDATE playerPos SET NewXPos = " + info.newX + ", NewYPos = " + info.newY + " WHERE playerID = " + info.playerID
		con.query(sql, function(err, result){
			if (err) throw err;
			console.log(result.affectedRows + " record(s) updated");
		})
	})
	
	socket.on('disconnect', function(){
		console.log("Someone From " + clientIp + " disconnected")
	})
});