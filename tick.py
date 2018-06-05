import MySQLdb
import sys
from database import *
db = MySQLdb.connect(host="localhost",  # your host
						 user="root",  # username
						 passwd="p2950",  # password
						 db="test_dwarven")  # name of the database
cur = db.cursor()

#CONST
playerID = 0
playerX = 1
playerY = 2
newX = 3
newY = 4

sqlCommand = "SELECT * FROM playerPos;"
cur.execute(sqlCommand)
posTable = cur.fetchall()

def checkDistance(x, y):
	z = abs(x - y)
	return z
def calculateLine(x, y, Nx, Ny):
	global diagonals, lines
	Nx = abs(Nx)
	Ny = abs(Ny)

	dx = checkDistance(x, Nx)
	dy = checkDistance(y, Ny)

	if x == Nx:
		diagonals = 0
		lines = abs(y - Ny)
	elif y == Ny:
		diagonals = 0
		lines = abs(x - Nx)
	
	i = 0
	while x != Nx and y != Ny and i != 100:
		if dx > dy:
			if x < Nx:
				x += 1
			elif x > Nx:
				x -= 1
			dx = checkDistance(x, Nx)
			dy = checkDistance(y, Ny)
			lines += 1
		
		elif dx < dy:
			if y < Ny:
				y += 1
			elif y > Ny:
				y -= 1
			dx = checkDistance(x, Nx)
			dy = checkDistance(y, Ny)
			lines += 1
		
		elif dx == dy:
			if x < Nx:
				x += 1
			elif x > Nx:
				x -= 1
			if y < Ny:
				y += 1
			elif y > Ny:
				y -= 1
			dx = checkDistance(x, Nx)
			dy = checkDistance(y, Ny)
			diagonals += 1
		
		i += 1

	print("diagLines: " + str(diagonals) + " " + str(lines))

def calculateNextXY(playerX, playerY, newX, newY, typeX, typeY, diffX, diffY, lines, diagonals, playerID):
	print("diffX: " + str(diffX))
	print("diffY: " + str(diffY))
	print("playerX: " + str(playerX))
	print("playerY: " + str(playerY))
	print("newX: " + str(newX))
	print("newY: " + str(newY))
	if diffX == 0 and diffY != 0:
		if typeY == "negative": 
			collumm = "yPos = yPos"
			value = " - 1"
		else:
			collumm = "yPos = yPos"
			value = " - 1"
	
	elif diffY == 0 and diffX != 0:
		if typeX == "negative":
			collumm = "xPos = xPos"
			value = " - 1"
		else:
			collumm = "xPos = xPos"
			value = " + 1"

	elif playerX != newX and playerY != newY:
		if lines != 0:
			if diffX > diffY:
				if typeX == "negative":
					collumm = "xPos = xPos"
					value = " - 1"
				else:
					collumm = "xPos = xPos"
					value = " + 1"
			
			elif diffX < diffY:
				if typeY == "negative":
					collumm = "yPos = yPos"
					value = " - 1"
				
				else:
					collumm = "yPos = yPos"
					value = " + 1"
			lines -= 1
	
		elif diagonals != 0:
			if typeX == "negative" and typeY == "negative":
				collumm = "xPos = xPos - 1, "
				value = "yPos = yPos - 1"
			elif typeX == "negative":
				collumm = "xPos = xPos - 1, "
				value = "yPos = yPos + 1"
			elif typeY == "negative":
				collumm = "xPos = xPos + 1, "
				value = "yPos = yPos - 1"
			else:
				collumm = "xPos = xPos + 1, "
				value = "yPos = yPos + 1"
		diagonals -= 1;

	elif playerX == newX and playerY == newY:
		print("travel complete")
		collumm = "NewXPos = NULL, "
		value = "NewYPos = NULL"
	
	sqlCommand = "UPDATE playerPos SET " + str(collumm) + str(value) + " where playerID = " + str(playerID) + ";"
	print(sqlCommand)
	cur.execute(sqlCommand)


for i in posTable:
	if i[newX] != None or i[newY] != None:
		typeX = ""
		typeY = ""
		if i[newX] < 0:
			typeX = "negative"
		if i[newY] < 0:
			typeY = "negative"
		
		diffX = abs(i[playerX] - i[newX])
		diffY = abs(i[playerY] - i[newY])
		
		diagonals = 0
		lines = 0
		calculateLine(i[playerX], i[playerY], i[newX], i[newY])
		calculateNextXY(
			i[playerX], i[playerY], i[newX], i[newY], 
			typeX, typeY, diffX, diffY, lines, diagonals, i[playerID]
			)

#move calculation t pyhton
print("commit update")
db.commit();
print("close")
db.close();

