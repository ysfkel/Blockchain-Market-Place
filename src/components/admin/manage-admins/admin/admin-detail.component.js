import React, { Component }from 'react';
import * as appService  from '../../../../services/app.service';
import * as accountService from '../services/account.service';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { ROLE } from '../../../../constants/constants';
import {  Link  } from 'react-router-dom';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';


export default class AdminUserDetail extends Component {
       
    constructor(props) {
        super(props);
        this.storeInstance;
        this.state = {
              account: '',
              admin: {},
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }



    componentDidMount() {
        appService.getContract((contract) => {
            this.storeInstance = contract;
            appService.getAccount((account) => {
                this.setState({account: account});
                if (this.isUpdatable()) {
                     this.getAdminUser();
                }
            });
            
        });
    }

    isUpdatable = () => {
          return !!this.props.adminAccount;
    }

    getAdminUser = () => {
        accountService.getAdminUser(this.storeInstance , 
            this.props.adminAccount, this.state.account).then((admin) => {
            this.setState(prev => {
                   return {
                     ...prev,
                     admin: admin,
                   }
            });
        })
    }

    handleChange = name => event => {
    
          const value = event.target.value;
          this.setState(prev => {
               
                return {
                    ...prev,
                    admin: {
                        ...prev.admin,
                        [name]: value
                    }
                }
          })
    }

    handleUpdateAdminUser = () => {

    }

    handleCreateAdminUser = () => {
        accountService.createAdminUser({
            ...this.state.admin,
        }, this.storeInstance,
         this.state.account
        ).then(r=>{
          
        }).catch(e=> {
              console.log('error', e)
        });
    }

    handleSubmit = (e) =>  {
        console.log('--e', e)
        e.preventDefault();
        if(this.props.adminAccount) {
       
            this.handleUpdateAdminUser();
            
      }else{ 
    
          this.handleCreateAdminUser();
      }
    }

    renderAccount = () => {
          const { admin } = this.state;

          if(this.isUpdatable()) {
               return (<div><Typography style = {{display: 'inline-block'}}  color="textSecondary"> ACCOUNT: </Typography><strong> {admin.account}</strong></div>)
          } else {
              return(
                <TextField
                id="account"
                label="Account"
                value={admin.account}
                margin="normal"
                onChange={this.handleChange('account')} 
                InputLabelProps={{
                    shrink: true
                }}
                />
              );
          }
    }
    
    render() {
        const { admin } = this.state;
        return(
            <form onSubmit={this.handleSubmit} >
              <h1>MANAGE ADMINISTRATORS</h1>
              <Card >
                    <CardContent>
                            <div>
                        <TextField
                            id="name"
                            label="Name"
                            value={this.state.admin.name}
                            margin="normal"
                            onChange={this.handleChange('name')} 
                            InputLabelProps={{
                                shrink: true
                            }}
                            />
                        </div>
                        <div>
                            <Select
                                    value={this.state.admin.role}
                                    onChange={this.handleChange("role")}
                                    inputProps={{
                                    name: 'ROLE',
                                    id: 'role-simple',
                                    }}
                                >
                                <MenuItem value={ROLE.CUSTOMER}>NONE</MenuItem>
                                <MenuItem value={ROLE.OWNER}>OWNER</MenuItem>
                                <MenuItem value={ROLE.ADMIN}>Admin</MenuItem>
                                <MenuItem value={ROLE.SUPER_ADMIN}>Super Admin</MenuItem>
                            </Select>
                        </div>
                        <div>

                            {this.renderAccount()}
                            
                        </div>
                    </CardContent>
                    <CardActions>
                        <Button type="submit" size="small">SAVE</Button>
                    </CardActions>
                  </Card>
                </form>
        );
    }

}
