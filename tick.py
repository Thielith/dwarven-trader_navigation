import MySQLdb
import sys
from database import *
db = MySQLdb.connect(host="localhost",  # your host
						 user="root",  # username
						 passwd="p2950",  # password
						 db="test_dwarven")  # name of the database
cur = db.cursor()

#playerX,   playerY,   newX,      newY,      typeX,      typeY,     diffX, diffY, lines, diagonals, playerID
sqlCommand = "SELECT * FROM playerPos;"
cur.execute(sqlCommand)
print(cur.fetchall())

print("close")
db.close();

