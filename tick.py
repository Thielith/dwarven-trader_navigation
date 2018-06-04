import MySQLdb
import sys
from database import *
db = MySQLdb.connect(host="localhost",  # your host
						 user="root",  # username
						 passwd="p2950",  # password
						 db="test_dwarven")  # name of the database
cur = db.cursor()

#playerX e,   playerY e,   newX e,      newY e,      typeX e,      typeY e,     diffX, diffY, lines, diagonals, playerID
sqlCommand = "SELECT * FROM playerPos;"
cur.execute(sqlCommand)
data = cur.fetchall()

if data[1][4] < 0:
	print("negative X")

print("close")
db.close();

