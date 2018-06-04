var mysql = require('mysql'); 
var io = require('socket.io').listen(33333);
const {exec} = require('child_process');

var con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "p2950",
	database: "test_dwarven"
})

var playerX, newX, typeX, diffX, playerY, newY, typeY, diffY, lines, diagonals
function tick(){
	if(diffX === 0){
		playerY += 1;
		console.log("playerX Y: " + playerX, playerY);
	}
	else if(diffY === 0){
		playerX += 1;
		console.log("playerX Y: " + playerX, playerY);
	}

	else if(playerX != newX && playerY != newY){
		if(lines !== 0){
			if(diffX > diffY){
				if(typeX == "negative"){
					 playerX -= 1;
				}
				else{
					playerX += 1;
				}
			}  
			else if(diffX < diffY){
				if(typeY == "negative"){
					playerY -= 1;
				}
				else{
					playerY += 1;
				}
			}
			lines -= 1;
		}
		else if(diagonals !== 0){
			if(diffX > diffY){
				if(typeY == "negative"){
					playerY -= 1;
				}
				else{
					playerY += 1;
				}
			}
			else if(diffX < diffY){
				if(typeX == "negative" && typeY == "negative"){
					playerX -= 1;
					playerY -= 1;
				}
				else if(typeX == "negative"){
					playerX -= 1;
					playerY += 1;
				}
				else if(typeY == "negative"){
					playerX += 1;
					playerY -= 1;
				}
				else{
					playerX += 1;
					playerY += 1;
				}
			}
			diagonals -= 1;
		}
		console.log("playerX Y: " + playerX, playerY);
	}

	else{
		console.log("travel complete")
	}

}

function loopDelay(){
	setTimeout(function () {
		console.log("e")
		if(playerX, newX, typeX, diffX, playerY, newY, typeY, diffY, lines, diagonals != undefined){
			console.log(tick)
			tick() 
		}
		loopDelay()
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
	
	socket.on('travel', function(info){
		console.log(info)
		playerX = info[0].playerX
		playerY = info[0].playerY
		newX = info[0].newX 
		newY = info[0].newY
		typeX = info[0].typeX
		typeY = info[0].typeY
		lines = info[0].lines 
		diagonals = info[0].diagonals
		diffX = Math.abs(playerX - newX);
		diffY = Math.abs(playerY - newY);
	})
	
	socket.on('disconnect', function(){
		console.log("Someone From " + clientIp + " disconnected")
	})
});