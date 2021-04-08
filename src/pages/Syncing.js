import React, { useCallback, useState, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  IconButton,
  Typography,
  CircularProgress,
  Card,
  CardHeader,
  Avatar,
} from '@material-ui/core';
import { Sync, Check, Close } from '@material-ui/icons';
import clsx from 'clsx';
import api from '../services/api';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
  },
  card: {
    margin: theme.spacing(0, 2),
    maxWidth: 345,
  },
  check: {
    backgroundColor: '#43b39e',
  },
  close: {
    backgroundColor: '#D4026E',
  },
}));

const Search = () => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [updated, setUpdated] = useState(false);
  const [timeUpdated, setTimeUpdated] = useState(
    localStorage.getItem('lastSync')
  );
  const timerRef = useRef();
  const allProductsStorage = JSON.parse(localStorage.getItem('allProducts'));

  const CheckLocalStorage = useCallback(async () => {
    if (allProductsStorage === null) {
      setUpdated(false);
    } else {
      setUpdated(true);
      setTimeUpdated(localStorage.getItem('lastSync'));
    }
  }, [allProductsStorage]);

  useEffect(() => {
    CheckLocalStorage();
  }, [CheckLocalStorage]);

  const handleSync = useCallback(async () => {
    setLoading(true);
    const { data } = await api.get('/products.js');
    const indexStart = data.indexOf('all_products = [{');
    const indexEnd = data.indexOf('}}];');
    const allProducts = data.slice(indexStart, indexEnd).concat('}}]');

    localStorage.setItem(
      'allProducts',
      allProducts.replace('all_products = [{', '[{')
    );
    localStorage.setItem('lastSync', new Date());

    timerRef.current = window.setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  return (
    <>
      <Typography className={classes.title} variant='h1' gutterBottom>
        Syncing
      </Typography>
      <div className={classes.root}>
        <Card className={classes.card}>
          <CardHeader
            avatar={
              <Avatar
                className={clsx(classes.check, {
                  [classes.close]: !updated,
                })}
                aria-label='updates'
              >
                {updated ? <Check /> : <Close />}
              </Avatar>
            }
            action={
              <IconButton onClick={handleSync} color='primary' component='span'>
                {loading ? (
                  <CircularProgress
                    variant='indeterminate'
                    disableShrink
                    size={25}
                  />
                ) : (
                  <Sync />
                )}
              </IconButton>
            }
            title={
              updated
                ? 'Last time synched:'
                : `Your application hasn't been synched!`
            }
            subheader={timeUpdated}
          />
        </Card>
      </div>
      <div className={classes.root}>
        <Typography className={classes.title} variant='body2'>
          You need to sync your application at least once to use it.
        </Typography>
      </div>
    </>
  );
};

export default Search;
