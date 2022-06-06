import pyodbc
import pandas as pd
class AddUser:
    
    '''
    Class: AddUser
    Description: This class will add the users from the console app to the SQL Database
    Written By: Anupam Hore
    Version:1.0
    Revision: None
    '''
    def __init__(self) -> None:
        self.conn = pyodbc.connect(
            "Driver={SQL Server};"
            "Server=ANUPAMHORE;"
            "Database=Banking;"
            "Trusted_Connection=yes"
        )

    def startConnection(self):
        self.conn = pyodbc.connect(
            "Driver={SQL Server};"
            "Server=ANUPAMHORE;"
            "Database=Banking;"
            "Trusted_Connection=yes"
        )

    def getUser(self):
        '''
        Function: getUser
        Parameters: None
        Output: List of All Users
        Description: Get the User List from the DB using
        STORED PROCEDURE GETUSER.
        Result: Users will be listed.
        '''
        try:
            
            print("Started")
            cursor = self.conn.cursor()
            print("Cursor Created")
            query = "EXEC GETUSER"
            cursor.execute(query)

            print("1st Query Executed")
            result = cursor.fetchall()
            print(f'Total Users: {result}')

            obj =[]
            for res in result:
                obj.append({
                    "dob":res[0],
                    "email":res[1],
                    "accountNo":res[2]
                })
    
            cursor.close()
            del cursor
            self.conn.close()

            return obj

        except Exception as e:
            raise e

    def addUser(self,dob,email,accountNo):
        '''
        Function: addUser
        Parameters: dob, email
        Output: None
        Description: Date of Birth and Email are gathered from the API and pushed into the Database.
        First of all the connection is created with the SQL Server with the SQL Server Driver Name,
        Server Name, Database Name and then cursor is created to make the connection and the 
        STORED PROCEDURE ADDUSER is passed as an query to be executed.
        Result: Users will be added.
        '''
        try:
            if dob is not None and email is not None and accountNo is not None:
                print("Started")
                cursor = self.conn.cursor()
                print("Cursor Created")
                query = "EXEC ADDUSER @dob=?,@email=?"
                params = (dob, email)
                cursor.execute(query,params)
                print("1st Query Executed")
               
                query = "EXEC ADDACCOUTNO @email=?, @accountNo=?"
                params1 = (email, accountNo)
                print("2nd Query Started")
                cursor.execute(query,params1)

                print("2nd Query Executed")

                self.conn.commit()

                cursor.close()
                del cursor
                self.conn.close()

                return "User added successfully"
            
            else:
                return "Please check the fields if they are empty or incorrect"

        except Exception as e:
            raise e

    def creditMoney(self,email,accountNo,amount):
        '''
        Function: creditMoney
        Parameters: amount
        Output: None
        Description: Amount is the amt of money that will be credited to the user account through
        STORED PROCEDURE CREDITAMOUT
        Result: Users Account will be credited with X amount.
        '''
        try:
            if amount is not None and email is not None and accountNo is not None:
                self.startConnection()
                print("Started")
                cursor = self.conn.cursor()
                print("Cursor Created")
                query = "EXEC CREDITAMOUNT @email=?,@accountNo=?,@amt=?"
                params = (email, accountNo,amount)
                cursor.execute(query,params)
                print("1st Query Executed")

                self.conn.commit()

                cursor.close()
                del cursor
                self.conn.close()

                return f'{amount} amount of money is credited to a/c:{accountNo}'
            else:
                return "Please enter your fields correctly"
        except Exception as e:
            raise e

    def debitMoney(self,email,accountNo,amount):
        '''
        Function: debitMoney
        Parameters: amount
        Output: None
        Description: Amount is the amt of money that will be debited from the user account through
        STORED PROCEDURE WITHDRAWAMOUNT. But before that we will first confirm the minimum balance
        in the user account through another STORED PROCEDURE CHECKACCOUTBALANCE
        Result: Users Account will be debited with X amount.
        '''
        try:
            if amount is not None and email is not None and accountNo is not None:
                self.startConnection()
                print("Started")
                cursor = self.conn.cursor()
                print("Cursor Created")
                query = "EXEC CHECKACCOUTBALANCE @email=?,@accountNo=?"
                params = (email, accountNo)
                cursor.execute(query,params)
                print("1st Query Executed")
                result = cursor.fetchall()
                print(f'Total Amount: {result}')
                if int(result[0][0]) - int(amount) > 5000:
                    print(f'Money can be debited')
                    query = "EXEC WITHDRAWAMOUNT @email=?,@accountNo=?, @withdraw=?"
                    params = (email, accountNo, amount)
                    cursor.execute(query,params)
                    print("2nd Query Executed")

                    self.conn.commit()

                    cursor.close()
                    del cursor
                    self.conn.close()
                    return f'Remaining balance in the account:{accountNo} is {int(result[0][0]) - int(amount)}'
                else:
                    cursor.close()
                    del cursor
                    self.conn.close()
                    return f'Low Balance. Money cannot be withdrawn from the a/c:{accountNo}'
                
            else:
                return "Please enter your fields correctly"
        except Exception as e:
            raise e

    
    def checkBalance(self,email,accountNo):
        '''
        Function: checkBalance
        Parameters: amount
        Output: None
        Description:This function will query the database to get the balance amount in user account.
         STORED PROCEDURE CHECKACCOUTBALANCE is used in the DB
        Result: Users Account Balance will be flashed out.
        '''
        try:
            if email is not None and accountNo is not None:
                self.startConnection()
                print("Started")
                cursor = self.conn.cursor()
                print("Cursor Created")
                query = "EXEC CHECKACCOUTBALANCE @email=?,@accountNo=?"
                params = (email, accountNo)
                cursor.execute(query,params)
                print("1st Query Executed")
                result = cursor.fetchall()

                print(f'Total Amount: {result}')
            
                cursor.close()
                del cursor
                self.conn.close()
                return result[0][0]
               
                
            else:
                return "Please enter your fields correctly"
        except Exception as e:
            raise e

    def txhistory(self,email,fromDate,toDate):
        '''
        Function: txhistory
        Parameters: amount
        Output: None
        Description: Total transaction history of the user
        STORED PROCEDURE TXHISTORY
        Result: Users Account will be credited with X amount.
        '''
        try:
            if email is not None:
                self.startConnection()
                print("Started")
                cursor = self.conn.cursor()
                print("Cursor Created")
                query = "EXEC TXHISTORY @email=?,@fromDate=?,@toDate=?"
                params = (email, fromDate,toDate)
                cursor.execute(query,params)
                print("1st Query Executed")
                result = cursor.fetchall()
                print(f'Total History: {result}')
               
                obj =[]
                for res in result:
                    obj.append({
                        "txDate":res[0],
                        "remainingBal":res[1],
                        "accountNo":res[2],
                        "txType":res[3]
                    })


                cursor.close()
                del cursor
                self.conn.close()
                return obj

                
            else:
                return "Please enter your fields correctly"
        except Exception as e:
            raise e        
