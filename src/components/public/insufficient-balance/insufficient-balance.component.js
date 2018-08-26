import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import {  Link} from 'react-router-dom';
import * as styles from './styles';

const InsufficientBalnace = () => (
    <div >
     <Paper>
       <p style={styles.container}>
          You do not have sufficient Balance to complete 
          this transaction. <Link  to="/token-sale">Click here to buy Tokens</Link>
       </p>
     </Paper>
    </div>
);

export default InsufficientBalnace;