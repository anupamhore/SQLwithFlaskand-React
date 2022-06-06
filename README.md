# SQLwithFlaskand-React
A small project from iNeuron( using SQL create database and access through Flask backend and Python Console)

# Objective
Create a console application using python and sql.

Description:
1.	Create a stored procedure to check the account balance.
2.	Create a stored procedure to withdraw the amount. 
a.	User must have a sufficient amount to withdraw money from his/her account.
b.	Minimum balance 5000 rupees must be maintained in each user account.
3. Check account statement: Users should be able to check all transactions for a given interval of time.(From date and To date)

Table Structure
1.	User Table(User Id, User name, User dob,User email, User created date )
2.	Bank_Account Table  ( User Id, bank account id, bank account number, is user active, amount )
3.	Transaction Table ( Transaction date, User Id, Bank A/C id, withdrawn amount ) 

Note: If tasks 1, 2, and 3 are done, now create a console for a Python application. 

Implement below functionality using python.
1.	Invoke stored procedure using python script.
2.	Insert record using python script.
3.	Use OOPs to design python programs to implement all functionality mentioned above.
