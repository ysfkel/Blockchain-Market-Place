import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import {  Link} from 'react-router-dom';
import * as styles from './styles';

const EmptyCart = () => (
    <div >
     <Paper>
       <p style={styles.container}>
          Your have an empty cart, <Link  to="/stores">Click here to shop</Link>
       </p>
     </Paper>
    </div>
);

export default EmptyCart;