import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { updateProductImage } from './repo';

export default class UpdateProductImageDialog extends React.Component {
    constructor(props) {
        super(props);
        this.handleUpdateProductImage = this.handleUpdateProductImage.bind(this);
    }

    componentDidMount() {
        
    }

        handleUpdateProductImage = () => {
            const { storeInstance, imageHash,  storeIndex, productId, account } = this.props;

          
            updateProductImage({ contract: storeInstance, 
               imageHash, storeIndex, productId, account
             })
             .then(()=>{
                 this.props.handleClose();
             })
        
        }


   render() {
    return (
      <div>

        <Dialog
          open={this.props.open}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">UPDATE PPRODUCT IMAGE</DialogTitle>
          <DialogContent>
            <DialogContentText>
              <p>
                Your product image has been upload to IPFS Storage.
                click the "UPDATE" button to update your product details 
                with the new image.
                (Confirm the transaction by clicking on confirm button on metamask)
              </p>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={this.handleUpdateProductImage} 
             color="primary">
              UPDATE 
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