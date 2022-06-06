import React,{Component,lazy} from 'react';
import classes from './Layout.css'
import axios from '../axios'
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';

class Layout extends Component{

    state = {
        usercreationDiv:false,
        txDiv:false,
        buttontitle:'Add User',
        dob:'',
        fromDate:'',
        toDate:'',
        dobServer:'',
        fromDateServer:'',
        toDateServer:'',
        email:'',
        accountNo:'',
        isLoading:false,
        userList:[],
        isError:false,
        errorMessage:'',
        isManageOptionON:false,
        activeAccount:{
            accountNo:'',
            email:'',
            dob:'',
            accountBalance:'-',
            withdrawAmount:'',
            creditMoney:''
        },
        txHistoryList:[]
    }

    componentDidMount = ()=>{


        this.getUser();
    }

    getUser = ()=>{
        this.setState({...this.state,isLoading:true})

        axios.get('/getUser').then(response =>{
            if(response.status === 200){
                console.log('response.data.data',response.data.data)
            }
            this.setState({...this.state,isLoading:false,userList:response.data.data})
        })
    }
    
    createUser= ()=>{
        console.log('User Created!')

        let btnTitle = this.state.buttontitle;
        let opendiv = this.state.usercreationDiv;

        this.setState({...this.state,
            usercreationDiv:(opendiv) ? false : true,
            buttontitle:(btnTitle === 'Add User') ? 'Cancel' : 'Add User',
            isError:false,
            errorMessage:''
        })
    }

    emailHandler = (e)=>{
        var tmp = e.target.value;
        this.setState({...this.state,email:tmp})
    }

    withdrawAmtHandler = (e)=>{
        var tmp = e.target.value;
        const re = /^[0-9\b]+$/;
        if(e.target.value === '' || re.test(e.target.value)){

            var objX = this.state.activeAccount;
            objX.withdrawAmount = tmp
            this.setState((prevState)=>{
                return {...prevState,activeAccount:objX}
            })
        }
    }

    creditAmtHandler= (e)=>{
        var tmp = e.target.value;
        const re = /^[0-9\b]+$/;
        if(e.target.value === '' || re.test(e.target.value)){

            var objX = this.state.activeAccount;
            objX.creditMoney = tmp
            this.setState((prevState)=>{
                return {...prevState,activeAccount:objX}
            })
           
        }
    }

    accountNoHandler = (e)=>{
        var tmp = e.target.value;
        const re = /^[0-9\b]+$/;
        if(e.target.value === '' || re.test(e.target.value)){
            this.setState({...this.state,accountNo:tmp})
        }
    }

    saveUser = ()=>{

        console.log('Save User')
        let btnTitle = this.state.buttontitle;
        let opendiv = this.state.usercreationDiv;

        this.setState({...this.state,
            usercreationDiv:(opendiv) ? false : true,
            buttontitle:(btnTitle === 'Add User') ? 'Cancel' : 'Add User'
        })

        console.log('details',this.state)

        this.setState({...this.state,isLoading:true,isError:false,
            errorMessage:''})

        if(this.state.email.length > 0 && this.state.accountNo.length > 0 && this.state.dobServer.length > 0){
                let body = {
                    "dob":this.state.dobServer,
                    "email":this.state.email,
                    "accountNo":this.state.accountNo
                }

                axios.post('/addUser',body).then(response =>{
                    if(response.status === 200){
                        console.log('response.data.data',response.data.data)
                    }
                    this.setState({...this.state,isLoading:false,
                        dob:'',
                        dobServer:'',
                        email:'',
                        accountNo:'',
                        isError:false,
                        errorMessage:'',
                        usercreationDiv:(opendiv) ? false : true,
                        buttontitle:(btnTitle === 'Add User') ? 'Cancel' : 'Add User'
                       })

                    this.getUser()
                })
        }else{
           this.setState({...this.state,isError:true,errorMessage:'Please enter correct details'})
        }
    }

    changeDate = (e)=>{

        var temp = moment(e).format('YYYY-MM-DD')
        this.setState({...this.state,dob:e,dobServer:temp})

    }

    changeFromtxDate = (e)=>{
        var temp = moment(e).format('YYYY-MM-DD')
        this.setState({...this.state,fromDate:e,fromDateServer:temp})
    }

    changeTotxDate = (e)=>{
        var temp = moment(e).format('YYYY-MM-DD')
        this.setState({...this.state,toDate:e,toDateServer:temp})
    }

    withdrawHandler = ()=>{

        let body = {
            "email":this.state.activeAccount.email,
            "accountNo":this.state.activeAccount.accountNo,
            "withdrawAmt":this.state.activeAccount.withdrawAmount
        }

        this.setState({...this.state,isLoading:true,isError:false,
            errorMessage:''})

        axios.post('/withdrawAmount',body).then(response =>{
            if(response.status === 200){
                console.log('response.data.data',response.data.data)

                if(typeof response.data.data === 'string' && response.data.data.includes("Low Balance")){
                    this.setState({...this.state,
                        isManageOptionON:true,
                        isLoading:false,
                        isError:true,
                        errorMessage:response.data.data
                    })

                }else{
                    let body = {
                        "email":this.state.activeAccount.email,
                        "accountNo":this.state.activeAccount.accountNo
                    }
        
                    axios.post('/getbalance',body).then(response =>{
                        if(response.status === 200){
                            console.log('response.data.data',response.data.data)
            
            
                            this.setState({...this.state,
                                isManageOptionON:true,
                                isLoading:false,
                                activeAccount:{
                                    accountNo:this.state.activeAccount.accountNo,
                                    email:this.state.activeAccount.email,
                                    dob:this.state.activeAccount.dob,
                                    accountBalance:response.data.data,
                                    withdrawAmount:'',
                                    creditMoney:''
                                }
                            })
                        }
            
                    })
                }
               
        
            }

        })
    }

    creditHandler = ()=>{

        let body = {
            "email":this.state.activeAccount.email,
            "accountNo":this.state.activeAccount.accountNo,
            "amount":this.state.activeAccount.creditMoney
        }

        this.setState({...this.state,isLoading:true,isError:false,
            errorMessage:''})

        axios.post('/creditAmount',body).then(response =>{
            if(response.status === 200){
                console.log('response.data.data',response.data.data)
                let body = {
                    "email":this.state.activeAccount.email,
                    "accountNo":this.state.activeAccount.accountNo
                }
    
                axios.post('/getbalance',body).then(response =>{
                    if(response.status === 200){
                        console.log('response.data.data',response.data.data)
        
        
                        this.setState({...this.state,
                            isManageOptionON:true,
                            isLoading:false,
                            activeAccount:{
                                accountNo:this.state.activeAccount.accountNo,
                                email:this.state.activeAccount.email,
                                dob:this.state.activeAccount.dob,
                                accountBalance:response.data.data,
                                withdrawAmount:'',
                                creditMoney:''
                            }
                        })
                    }
        
                })

                
            }

        })
    }

    txToggle = ()=>{
        console.log('TX History Module!')

        let opendiv = this.state.txDiv;

        this.setState({...this.state,
            txDiv:(opendiv) ? false : true,
            isError:false,
            errorMessage:''
        })
    }

    txHistory = ()=>{
        let body = {
            "email":this.state.activeAccount.email,
            "fromDate":this.state.fromDateServer,
            "toDate":this.state.toDateServer
        }

        this.setState({...this.state,isLoading:true,isError:false,
            errorMessage:''})

        axios.post('/txhistory',body).then(response =>{
            if(response.status === 200){
                console.log('response.data.data',response.data.data)
                this.setState({...this.state,
                    isManageOptionON:true,
                    isLoading:false,
                    txHistoryList:response.data.data,
                    txDiv:false,
                })
            }

        })
    }

    userbtnHandler = (e,index)=>{
        console.log('index',index)

        let obj = this.state.userList[index]


        let body = {
            "email":obj.email,
            "accountNo":obj.accountNo
        }

        this.setState({...this.state,isLoading:true,isError:false,
            errorMessage:''})

        axios.post('/getbalance',body).then(response =>{
            if(response.status === 200){
                console.log('response.data.data',response.data.data)


                this.setState({...this.state,
                    isManageOptionON:true,
                    isLoading:false,
                    activeAccount:{
                        accountNo:obj.accountNo,
                        email:obj.email,
                        dob:obj.dob,
                        accountBalance:response.data.data,
                        withdrawAmount:'',
                        creditMoney:''
                    }
                })
            }

        })


    }

    getUserList = ()=>{

        let ll =null;
        if(this.state.userList.length > 0){
            ll = this.state.userList.map((el,index)=>{
                    return (
                        <div key={index} className={classes.User}>
                             <div className={classes.EmailLbl}>{el.email}</div>
                             <button className={classes.UsrBtn} onClick={(e)=>this.userbtnHandler(e,index)}>Manage</button>
                        </div>
                    )
            })
        }
        return ll;
    }

    getTxHistoryList = ()=>{

        let ll = []
        if(this.state.txHistoryList.length > 0){
            ll = this.state.txHistoryList.map((el,index)=>{
                return (
                    <div key={index} style={{display:'flex',flexFlow:'row',justifyContent:'space-between'}}>
                        <div className={classes.ColDiv}>
                            <div className={classes.BiggerFont}>Transaction Date</div>
                            <div className={classes.SmallerFont}>{el.txDate}</div>
                        </div>
                        <div className={classes.ColDiv}>
                            <div className={classes.BiggerFont}>Amount</div>
                            <div className={classes.SmallerFont}>{el.remainingBal}</div>
                        </div>
                        <div className={classes.ColDiv}>
                            <div className={classes.BiggerFont}>Transaction Type</div>
                            <div className={classes.SmallerFont}>{el.txType}</div>
                        </div>
                    </div>
                )
            })
        }
        return ll
    }

    render(){

        let userList = this.getUserList();
        let getRecords= this.getTxHistoryList();
        return(
            <React.Fragment>
                  {(this.state.isLoading) ?
                   <div className={classes.Loader}>
                     <div className={classes.LoadingSpinner}>
                     </div>
                   </div> : null}
             
                    <div className={classes.Layout}>
                        
                        <div className={classes.Header}>
                            <div style={{display:'flex',flexFlow:'row',justifyContent:'space-between'}}>
                            <div className={classes.HeaderLbl}></div>
                                <div className={classes.HeaderLbl}>User Management</div>
                                <button className={classes.HeaderBtn} onClick={()=>this.createUser()}>{this.state.buttontitle}</button>
                            </div>
                        </div>

                        {(this.state.userList.length > 0) ?
                          <div style={{display:'flex',flexFlow:'row'}}>
                            <div className={classes.UserList}>
                                <div className={classes.BoundaryRect}>
                                    {userList}
                                </div>
                            </div>
                            {(this.state.isManageOptionON) ?
                              <div className={classes.ColDiv}>
                                <div className={classes.RowDiv}>
                                        <div className={classes.DetailDiv}>
                                            <div className={classes.BiggerFont}>Email ID</div>
                                            <div className={classes.SmallerFont}>{this.state.activeAccount.email}</div>
                                            <div className={classes.BiggerFont}>Date of Birth</div>
                                            <div className={classes.SmallerFont}>{this.state.activeAccount.dob}</div>
                                            <div className={classes.BiggerFont}>Account Number</div>
                                            <div className={classes.SmallerFont}>{this.state.activeAccount.accountNo}</div>

                                            {(this.state.isError) ?
                                            <div className={classes.ErrorMessage1}>{this.state.errorMessage}</div> : null}
                                        </div>
                                        <div className={classes.DetailDiv}>
                                            <div className={classes.BiggerFont}>Account Balance</div>
                                            <div className={classes.SmallerFont}>{this.state.activeAccount.accountBalance}</div>
                                            <div className={classes.BiggerFont}>Withdraw</div>
                                            <input 
                                                placeholder="500000" 
                                                value={this.state.activeAccount.withdrawAmount}
                                                className={classes.FormEmailIp1}
                                                onChange={(e)=>this.withdrawAmtHandler(e)}
                                            />
                                            <button className={classes.FormSaveBtn1} onClick={()=>this.withdrawHandler()} >Withdraw</button>

                                            <div className={classes.BiggerFont}>Credit Money</div>
                                            <input 
                                                placeholder="500000" 
                                                value={this.state.activeAccount.creditMoney}
                                                className={classes.FormEmailIp1}
                                                onChange={(e)=>this.creditAmtHandler(e)}
                                            />
                                            <button className={classes.FormSaveBtn1} onClick={()=>this.creditHandler()} >Credit</button>
                                        </div>
                                </div>
                                <button  className={classes.FormSaveBtn2} onClick={()=>this.txToggle()}>Transaction History</button>

                                {(this.state.txHistoryList.length > 0) ?
                                    <div  className={classes.TxDivBoundary}>
                                        {getRecords}
                                    </div> :null
                                }

                              </div>
                              : null
                            }
                          </div>
                           : null
                        }

                        {(this.state.usercreationDiv) ?
                        <React.Fragment>
                            <div className={[classes.AddUserDiv,classes.Open].join(' ')}>
                                <div className={classes.FormEmail}>Email</div>
                                <input 
                                    placeholder="xyz@abc.com" 
                                    value={this.state.email}
                                    className={classes.FormEmailIp}
                                    onChange={(e)=>this.emailHandler(e)}
                                />
                                <div  className={classes.FormDOB}>Date Of Birth</div>
                                <DatePicker
                                className={classes.FormDOBIp}
                                selected={this.state.dob}
                                onChange={(date)=>this.changeDate(date)}
                                popperPlacement="bottom-start"
                                popperClassName={classes.Popper}
                                openToDate={new Date("1980/01/1")}
                                placeholderText="DD/MM/YYYY"
                                dateFormat="dd/MM/yyyy"
                                />

                                <div  className={classes.FormAccountNo}>Account Number</div>
                                <input   
                                    placeholder="123456" 
                                    className={classes.FormAccountNoIp}
                                    value={this.state.accountNo}
                                    onChange={(e)=>this.accountNoHandler(e)}
                                />

                                <button className={classes.FormSaveBtn} onClick={()=>this.saveUser()} >Save</button>

                                {(this.state.isError) ?
                                     <div className={classes.ErrorMessage}>
                                         {this.state.errorMessage}
                                     </div> 
                                     : null
                                }
                            </div>
                        </React.Fragment> :null
                        }

                        {(this.state.txDiv) ?
                            <React.Fragment>
                                <div className={[classes.AddUserDiv,classes.Open].join(' ')}>
                                    <div  className={classes.FormDOB}>From Date</div>
                                    <DatePicker
                                    className={classes.FormDOBIp}
                                    selected={this.state.fromDate}
                                    onChange={(date)=>this.changeFromtxDate(date)}
                                    popperPlacement="bottom-start"
                                    popperClassName={classes.Popper}
                                    //openToDate={new Date("1980/01/1")}
                                    placeholderText="DD/MM/YYYY"
                                    dateFormat="dd/MM/yyyy"
                                    />
                                    <div  className={classes.FormDOB}>To Date</div>
                                    <DatePicker
                                    className={classes.FormDOBIp}
                                    selected={this.state.toDate}
                                    onChange={(date)=>this.changeTotxDate(date)}
                                    popperPlacement="bottom-start"
                                    popperClassName={classes.Popper}
                                    //openToDate={new Date("1980/01/1")}
                                    placeholderText="DD/MM/YYYY"
                                    dateFormat="dd/MM/yyyy"
                                    />

                                    <button className={classes.FormSaveBtn} onClick={()=>this.txHistory()} >Search</button>
                                </div>
 
                            </React.Fragment> :null
                        }

                        <div className={classes.Footer}>
                            <div className={classes.FooterLbl}>@Copyright: Anupam Hore [iNeuron Project]</div>
                        </div>
                    </div>    
            </React.Fragment>
        )
    }
}

export default Layout