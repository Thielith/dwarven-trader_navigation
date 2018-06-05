import MySQLdb
import sys
from database import *
db = MySQLdb.connect(host="localhost",  # your host
						 user="root",  # username
						 passwd="p2950",  # password
						 db="test_dwarven")  # name of the database
cur = db.cursor()

#CONST
playerX = 1
playerY = 2
newX = 3
newY = 4
#playerX e, playerY e, newX e, newY e, typeX e, typeY e, diffX e, diffY e, lines, diagonals, playerID
sqlCommand = "SELECT * FROM playerPos;"
cur.execute(sqlCommand)
posTable = cur.fetchall()

if posTable[1][newX] < 0:
	typeX = "negative"
if posTable[1][newY] < 0:
	typeY = "negative"

diffX = abs(posTable[0][playerX] - posTable[0][newX])
diffY = abs(posTable[0][playerY] - posTable[0][newY])

print("playerX: " + str(posTable[0][playerX]))
print("playerY: " + str(posTable[0][playerY]))
print("newX: " + str(posTable[0][newX]))
print("newY: " + str(posTable[0][newY]))

dx = 0
dy = 0
def checkDistance(x, y):
	z = abs(x - y)
	return z

diagonals = 0
lines = 0
def calculateLine(x, y, Nx, Ny):
	global diagonals
	global lines
	Nx = abs(Nx)
	Ny = abs(Ny)

	dx = checkDistance(x, Nx)
	dy = checkDistance(y, Ny)
	print("dx" + str(dx))
	print("dy" + str(dy))

	if x == Nx:
		diagonals = 0
		lines = abs(y - Ny)
	elif y == Ny:
		diagonals = 0
		lines = abs(x - Nx)
	
	i = 0
	while x != Nx and y != Ny and i != 100:
		print(i)
		if dx > dy:
			if x < Nx:
				x += 1
			elif x > Nx:
				x -= 1
			dx = checkDistance(x, Nx)
			dy = checkDistance(y, Ny)
			print("lines x + 1")
			lines += 1
		
		elif dx < dy:
			if y < Ny:
				y += 1
			elif y > Ny:
				y -= 1
			dx = checkDistance(x, Nx)
			dy = checkDistance(y, Ny)
			print("lines y + 1")
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
			print("diagonals + 1")
			diagonals += 1
		
		i += 1

	print("diagLines: " + str(diagonals) + " " + str(lines))



calculateLine(posTable[0][playerX], posTable[0][playerY], posTable[0][newX], posTable[0][newY])
print("playerX: " + str(posTable[0][playerX]))
print("playerY: " + str(posTable[0][playerY]))
print("newX: " + str(posTable[0][newX]))
print("newY: " + str(posTable[0][newY]))


#move calculation t pyhton
print("close")
db.close();

