var mysql = require('mysql'); 
var io = require('socket.io').listen(33333);
const {exec} = require('child_process');

var con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "p2950",
	database: "test_dwarven"
})

var e = 0
function loopDelay(){
	setTimeout(function () {
      console.log(e)
      i++;
	  loopDelay()
   }, 3000)
}

io.sockets.on('connection', function (socket) {
	loopDelay()
	e += 1
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
	
	socket.on('disconnect', function(){
		console.log("Someone From " + clientIp + " disconnected")
	})
});