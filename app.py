from ast import Add
from flask import Flask,request,Response,jsonify,make_response
import os
from flask_cors import CORS, cross_origin
import pandas as pd
import csv
import pyodbc
from addUser import AddUser

os.putenv('LANG','en_US.UTF-8')
os.putenv('LC_ALL','en_US.UTF-8')


app=Flask(__name__)
CORS(app)


@app.route("/", methods=["GET"])
def ping():
    return "I am serving"

@app.route('/test', methods=['GET'])
def testConn():
    return {"test":"Connection is established!!!"}


@app.route('/getUser', methods=['GET'])
#@cross_origin
def getUser():
     userModel = AddUser()
     result = userModel.getUser()

     response = make_response(
                jsonify(
                    {"data": result}
                ),
                200,
            )
     response.headers["Content-Type"] = "application/json"
     response.headers["Access-Control-Allow-Origin"]  = '*'
     return response

@app.route('/addUser', methods=['POST'])
def addUser():
    content = request.json
    userModel = AddUser()
    result = userModel.addUser(content['dob'],content['email'],content['accountNo'])

    response = make_response(
                jsonify(
                    {"data": result}
                ),
                200,
            )
    response.headers["Content-Type"] = "application/json"
    response.headers["Access-Control-Allow-Origin"]  = '*'
    return response

@app.route('/creditAmount', methods=['POST'])
def creditAmount():
    content = request.json
    userModel = AddUser()
    result = userModel.creditMoney(content['email'],content['accountNo'],content['amount'])
    response = make_response(
                jsonify(
                    {"data": result}
                ),
                200,
            )
    response.headers["Content-Type"] = "application/json"
    response.headers["Access-Control-Allow-Origin"]  = '*'
    return response

@app.route('/withdrawAmount', methods=['POST'])
def debitAmount():
    content = request.json
    userModel = AddUser()
    result = userModel.debitMoney(content['email'], content['accountNo'], content['withdrawAmt'])
    response = make_response(
                jsonify(
                    {"data": result}
                ),
                200,
            )
    response.headers["Content-Type"] = "application/json"
    response.headers["Access-Control-Allow-Origin"]  = '*'
    return response

@app.route('/txhistory', methods=['POST'])
def txhistory():
    content = request.json
    userModel = AddUser()
    result = userModel.txhistory(content['email'],content['fromDate'],content['toDate'])
    response = make_response(
                jsonify(
                    {"data": result}
                ),
                200,
            )
    response.headers["Content-Type"] = "application/json"
    response.headers["Access-Control-Allow-Origin"]  = '*'
    return response

@app.route('/getbalance', methods=['POST'])
def getbalance():
    content = request.json
    userModel = AddUser()
    result = userModel.checkBalance(content['email'],content['accountNo'])
    response = make_response(
                jsonify(
                    {"data": result}
                ),
                200,
            )
    response.headers["Content-Type"] = "application/json"
    response.headers["Access-Control-Allow-Origin"]  = '*'
    return response
    
if __name__ == '__main__':
    app.run(debug=True)


















# import pyodbc
# import pandas as pd
# import csv

# def read(conn):
#     print('read')
#     cursor = conn.cursor()
#     query = "EXEC EC @country = 'Australia'"
#     results = pd.read_sql_query(query,conn)
#     results.to_csv('EmpData.csv',index=False)
#     # cursor.execute('select TOP(10) * from Employees')
#     # for row in cursor:
#     #     print(f'row={row}')
#     print()

# conn = pyodbc.connect(
#     "Driver={SQL Server};"
#     "Server=ANUPAMHORE;"
#     "Database=Human_Resources;"
#     "Trusted_Connection=yes"
# )

# read(conn)
# conn.close()