import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import * as styles from './styles';
import {  Link  } from 'react-router-dom';

const StoreListItem = (props) => {

  return (
    <Card style={styles.container}>
      <CardMedia
         style={styles.image}
        component="img"
        image="../../../assets/shopping.png"
        title="Shop"
      />
     
      <CardContent>
        <Typography gutterBottom variant="headline" component="h3">
          {props.store.name}
        </Typography>
        <Typography component="p">
           {props.store.description}
        </Typography>
          
           <Link size="small" color="primary" to={`/products-catalog/${props.store.actIdx}/${props.store.storeId}`}>Click to Shop</Link>
      </CardContent>
     
    </Card>
  );
}

export default StoreListItem;

