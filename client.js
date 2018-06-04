var socket = io.connect('http://192.168.6.43:33333');
var storage = [], locationList = [], currentList = locationList
var buttonMax = 1, buttonX = 0, buttonY = 1
var playerID = 0, playerX, playerY
socket.emit('getPlayerPos', playerID)
socket.on('getPlayerPos', function(data){
	playerX = data[0].xPos
	playerY = data[0].yPos
	document.getElementById('position').innerHTML = "Position: " + playerX + ", " + playerY
	socket.emit('locations')
})
socket.on('locations', function(data){
	for(i = 0; i < data.length; i++){
		var something = {name: undefined, xPos: undefined, yPos: undefined, type: undefined}
		something.name = data[i].name
		something.xPos = data[i].xPos
		something.yPos = data[i].yPos
		something.type = data[i].type
		storage.push(something)
	}
	socket.emit('locationNames')
})
socket.on('locationNames', function(data){
	for(i = 0; i < data.length; i++){
		for(j = 0; j < storage.length; j++){
			if(data[i].id == storage[j].type){
				storage[j].type = data[i].typeName
			}
		}
	}
	
	for(i = 0; i < storage.length; i++){
		var newButton = "<p class='button attack stayCenter' onclick='calculateLine(" + 
		playerX + ", " + playerY + ", " + storage[i].xPos + ", " + storage[i].yPos + ", " + i + ")'>" + storage[i].name + ": " + storage[i].type + "</p>"
		if(locationList.includes(newButton) == false){
			locationList.push(newButton)
		}
	}
	loadButtons(locationList, "e")
})

function loadButtons(list, direction){
	
	if(list.length > buttonMax){
		document.getElementById('rightButton').style.display = "inline";
	}
	if(direction == "left"){
		buttonX -= buttonMax;
		buttonY -= buttonMax;
		document.getElementById('rightButton').style.display = "inline";
	}
	else if(direction == "right"){
		buttonX += buttonMax;
		buttonY += buttonMax;
		document.getElementById('leftButton').style.display = "inline";
	}
	var currentButtons = list.slice(buttonX, buttonY);
	document.getElementById('menu').innerHTML = currentButtons[0];
	
	if(buttonX <= 0){
		document.getElementById('leftButton').style.display = "none";
	}
	else if(buttonY >= list.length){
		document.getElementById('rightButton').style.display = "none";
	}	
}

var dx, dy, typeX, typeY, newX, newY;
var diagonals = 0, lines = 0;
function checkDistance(x, y, Nx, Ny){
	dx = Nx - x;
	dy = Ny - y;
	if(dx < 0){dx = -dx; typeX = "negative"}
	if(dy < 0){dy = -dy; typeY = "negative"}
	
}
function calculateLine(x, y, Nx, Ny){
	typeX = "", typeY = "";
	newX = Nx, newY = Ny;
	Nx = Math.abs(Nx);
	Ny = Math.abs(Ny);

	checkDistance(x, y, Nx, Ny);

	if(x == Nx){
		diagonals = 0;
		if(y > Ny){lines = y - Ny}
		else if(y < Ny){lines = Ny - y}
	}
	else if(y == Ny){
		diagonals = 0;
		if(x > Nx){lines = x - Nx}
		else if(x < Nx){lines = Nx - x}
	}

	for(i = 0; x != Nx && y != Ny && i != 100; i++){
		if(dx > dy){
			if(x < Nx){x += 1}
			else if(x > Nx){x -= 1}
			checkDistance(x, y, Nx, Ny);
			lines += 1;
		}
		else if(dx < dy){
			if(y < Ny){y += 1}
			else if(y > Ny){y -= 1}
			checkDistance(x, y, Nx, Ny);
			lines += 1;
		}
		else if(dx == dy){
			if(x < Nx){x += 1}
			else if(x > Nx){x -= 1}
			if(y < Ny){y += 1}
			else if(y > Ny){y -= 1}
			checkDistance(x, y, Nx, Ny);
			diagonals += 1;
		}
	}

	console.log("diagLines: " + diagonals, lines);
}

function sendTravelInfo(){
	var packet = {
		playerX: playerX, playerY: playerY,
		newX: newX, newY: newY,
		typeX: typeX, typeY: typeY,
		lines: lines, diagonals: diagonals
	}
	
	socket.emit(
		'travel', packet
	)
}
//----server code------
var playerX, newX, typeX, playerY, newY, typeY, lines, diagonals
var diffX = playerX - newX, diffY = playerY - newY;
diffX = Math.abs(diffX);
diffY = Math.abs(diffY);

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
