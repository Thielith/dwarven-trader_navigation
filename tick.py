import MySQLdb
import sys
from database import *
db = MySQLdb.connect(host="localhost",  # your host
						 user="root",  # username
						 passwd="p2950",  # password
						 db="test_dwarven")  # name of the database
cur = db.cursor()

if sys.argv[1] != None:
		if sys.argv[1] == "updatePlayerPos":
			sqlCommand = ""
			print(sys.argv[2])
			#connection.execute(sqlCommand)
			#print("commit update")
			#db.commit();
			#print("close")
			#db.close();
	
		elif sys.argv[1] == "updateNewPlayerPos":
			print("updating new X and Y of player with ID: " + sys.argv[2])
			collumm = ["NewXPos", "NewYPos"]
			values = [sys.argv[3], sys.argv[4]]
			updateDatabaseData(cur, "playerPos", collumm, values, sys.argv[2])
			print("commit update")
			db.commit();
			print("close")
			db.close();
	
		elif sys.argv[1] == "updateStatus":
			print("adding statuses")
			updateStatusDB(cur, sys.argv[2], sys.argv[3], sys.argv[4])
			print("commit update")
			db.commit();
			print("close")
			db.close();
