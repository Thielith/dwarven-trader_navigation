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
		var newButton = "<p class='button attack stayCenter' onclick='addToQueue(" + 
		storage[i].xPos + ", " + storage[i].yPos + ", " + i + ")'>" + storage[i].name + ": " + storage[i].type + "</p>"
		if(locationList.includes(newButton) == false){
			locationList.push(newButton)
		}
	}
	loadButtons(locationList, "e")
})
socket.on('getYourPos', function(){
	socket.emit('getPlayerPos', playerID)
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

function addToQueue(newX, newY){
	socket.emit('newPosPlayer', {newX: newX, newY: newY, playerID: playerID})
}