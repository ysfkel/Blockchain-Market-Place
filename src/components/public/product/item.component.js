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

const ProductListItem = (props) => {

  return (
    <Card style={styles.listItenContainer}>
       <CardMedia
               style={styles.image}
              component="img"
              image={`https://ipfs.io/ipfs/${props.product.imageHash}`}
              title="Shop"
            />
      <CardContent>
        <Typography gutterBottom variant="headline" component="h3">
          <label>Name: </label> {props.product.name}
        </Typography>
        <Typography >
           <label>Price: </label>{props.product.price}
        </Typography>
          <Link to={`/product-details/${props.accountId}/${props.storeId}/${props.product.productId}`}>details</Link>
             
      </CardContent>
     
    </Card>
  );
}

export default ProductListItem;