import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { approveTokenPay } from './repo';

export default class ApproveTokenPay extends React.Component {
    constructor(props) {
        super(props);
        this.handleApprove = this.handleApprove.bind(this);
    }

    componentDidMount() {
        
    }

        handleApprove = () => {
           this.props.approveSubmitted();
          if(this.props.balance >= this.props.cartPrice) {
            const { cartPrice, account,  tokenContract, storeContractAddress,  } = this.props;
           
             approveTokenPay({
                account, 
                cartPrice,
                storeContractAddress,
                tokenContract
                }).then(()=>{
                console.log('purchase updated!')
            })
          }
        }


   render() {
    return (
      <div>

        <Dialog
          open={this.props.open}
        //   onClose={this.props.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">TOKENS TRANSFER APPROVAL</DialogTitle>
          <DialogContent>
            <DialogContentText>
              <p>
                  By Clicking on the Approve button, you give us the 
              approval to transfer a total of { this.props.cartPrice} SPINEL
             Tokens to make payment for the products in your shopping cart
              </p>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={this.handleApprove} 
             color="primary">
              Approve
            </Button>
            <Button 
              onClick={this.props.handleClose} 
             color="primary">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}