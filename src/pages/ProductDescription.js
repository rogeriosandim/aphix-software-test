import React, { useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Grid } from '@material-ui/core';
import ProductViewCard from '../components/ProductViewCard';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    overflow: 'hidden',
    padding: theme.spacing(0, 3),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    padding: theme.spacing(2, 2, 1, 2),
    color: theme.palette.text.secondary,
  },
  subTitle: {
    padding: theme.spacing(0, 2, 1, 2),
    color: theme.palette.text.secondary,
  },
}));

const ProductDescription = () => {
  const classes = useStyles();
  const history = useHistory();
  const allProductsStorage = JSON.parse(localStorage.getItem('allProducts'));

  const CheckLocalStorage = useCallback(async () => {
    if (allProductsStorage === null) {
      history.push('/syncing');
    }
  }, [history, allProductsStorage]);

  useEffect(() => {
    CheckLocalStorage();
  }, [CheckLocalStorage]);

  return (
    <>
      <Typography className={classes.title} variant='h1' gutterBottom>
        Product Description
      </Typography>
      <Typography className={classes.subTitle} variant='body2' gutterBottom>
        Click on the arrow to find more about the product!
      </Typography>
      <Grid container className={classes.root} spacing={2}>
        <Grid item xs={12}>
          <Grid container justify='center' spacing={2}>
            {allProductsStorage &&
              allProductsStorage.map((product) => (
                <Grid key={product.data} item>
                  <ProductViewCard
                    name={product.value}
                    description={product.info.Text}
                    metaKeywords={product.info.MetaKeywords}
                    image={product.info.Image1Src}
                    imageName={product.info.Name}
                    sku={product.data}
                  />
                </Grid>
              ))}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default ProductDescription;
