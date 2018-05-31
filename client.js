var socket = io.connect('http://192.168.10.206:33333');
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
		var newButton = "<p class='button attack stayCenter' onclick='calculateDiagLine(" + 
		playerX + ", " + playerY + ", " + storage[i].xPos + ", " + storage[i].yPos + ")'>" + storage[i].name + ": " + storage[i].type + "</p>"
		if(locationList.includes(newButton) == false){
			locationList.push(newButton)
		}
	}
	loadButtons(locationList, "e")
})



function loadButtons(list, direction){
	
	if(list.length > buttonMax){
		document.getElementById('rightButton').style.display = "inline"
	}
	if(direction == "left"){
		buttonX -= buttonMax
		buttonY -= buttonMax
		document.getElementById('rightButton').style.display = "inline"
	}
	else if(direction == "right"){
		buttonX += buttonMax
		buttonY += buttonMax
		document.getElementById('leftButton').style.display = "inline"
	}
	var currentButtons = list.slice(buttonX, buttonY)
	document.getElementById('menu').innerHTML = currentButtons[0]
	
	if(buttonX <= 0){
		document.getElementById('leftButton').style.display = "none"
	}
	else if(buttonY >= list.length){
		document.getElementById('rightButton').style.display = "none"
	}	
}

var dx, dy, typeX, typeY;
function checkDistance(x, y, Nx, Ny){
	dx = Nx - x;
	dy = Ny - y;
	if(dx < 0){dx = -dx}
    if(dy < 0){dy = -dy}
}
function calculateDiagLine(x, y, Nx, Ny){
	var diagonals = 0, lines = 0;

	if(Nx < 0){Nx = -Nx; typeX = "negative"}
	if(Ny < 0){Ny = -Ny; typeY = "negative"}

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

	console.log(diagonals, lines);
}



