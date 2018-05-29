var mysql = require('mysql'); 
var io = require('socket.io').listen(33333);
const {exec} = require('child_process');

var con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "p2950",
	database: "test_dwarven"
})


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
	
	socket.on('disconnect', function(){
		console.log("Someone From " + clientIp + " disconnected")
	})
});