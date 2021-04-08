import React, { useState, useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useLunr } from 'react-lunr';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, TextField, InputAdornment, Grid } from '@material-ui/core';
import { Search } from '@material-ui/icons';
import ProductViewCard from '../components/ProductViewCard';
import lunr from 'lunr';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2, 3),
  },
  title: {
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
  },
  searchBox: {
    padding: theme.spacing(0, 2),
  },
  input: {
    backgroundColor: theme.palette.background.paper,
    width: '100%',
    maxWidth: 500,
  },
}));

const ProductDescription = () => {
  const classes = useStyles();
  const history = useHistory();
  const allProductsStorage = JSON.parse(localStorage.getItem('allProducts'));
  const searchProducts = [];

  const CheckLocalStorage = useCallback(async () => {
    if (allProductsStorage === null) {
      history.push('/syncing');
    }
  }, [history, allProductsStorage]);

  useEffect(() => {
    CheckLocalStorage();
  }, [CheckLocalStorage]);

  if (allProductsStorage) {
    allProductsStorage.forEach((products) => {
      searchProducts.push({
        data: products.data,
        value: products.value,
        text: products.info.Text,
        metaKeywords: products.info.MetaKeywords,
        image: products.info.Image1Src,
        imageName: products.info.Name,
      });
    });
  }

  var index = lunr(function () {
    this.ref('data');
    this.field('data');
    this.field('value');
    this.field('text');
    this.field('metaKeywords');

    searchProducts.forEach(function (doc) {
      this.add(doc);
    }, this);
  });

  const [query, setQuery] = useState('');
  const results = useLunr(query, index);

  let searchResults = results
    .map((current) => {
      const arr = searchProducts.find(
        (products) => products.data === current.ref
      );
      return arr;
    })
    .filter((products) => !!products);

  const handleSearch = (event) => {
    event.preventDefault();
    setQuery(event.target.value);
  };

  return (
    <>
      <Typography className={classes.title} variant='h1' gutterBottom>
        Search
      </Typography>
      <div className={classes.searchBox}>
        <TextField
          type='text'
          className={classes.input}
          onChange={handleSearch}
          value={query}
          name='query'
          label='Search for anything'
          variant='outlined'
          color='primary'
          size='small'
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <Search />
              </InputAdornment>
            ),
          }}
        />
      </div>
      <Grid container className={classes.root} spacing={2}>
        <Grid item xs={12}>
          <Grid container justify='center' spacing={2}>
            {searchResults &&
              searchResults.map((product) => (
                <Grid key={product.data} item>
                  <ProductViewCard
                    name={product.value}
                    description={product.text}
                    metaKeywords={product.metaKeywords}
                    image={product.image}
                    imageName={product.imageName}
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
