import React, { useCallback, useState, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  IconButton,
  Typography,
  CircularProgress,
  Card,
  CardHeader,
  Avatar,
  Button,
} from '@material-ui/core';
import { Sync, Check, Close, Delete } from '@material-ui/icons';
import clsx from 'clsx';
import api from '../services/api';
import { useHistory } from 'react-router-dom';
import getBase64FromUrl from '../helpers/getBase64FromUrl';
import defaultImage from '../assets/images/product/no-image.jpeg';

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
  syncIcon: {
    display: 'grid',
    color: '#43b39e',
  },
  deleteIcon: {
    display: 'grid',
    color: '#D4026E',
  },
}));

const Search = () => {
  const classes = useStyles();
  const history = useHistory();
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

  const handlePushSearch = () => {
    history.push('/search');
  };

  useEffect(() => {
    CheckLocalStorage();
  }, [CheckLocalStorage]);

  const handleSync = useCallback(async () => {
    setLoading(true);
    const { data } = await api.get('/products.js');
    const indexStart = data.indexOf('all_products = [{');
    const indexEnd = data.indexOf('}}];');
    const allProducts = data.slice(indexStart, indexEnd).concat('}}]');
    const offlineImage = await getBase64FromUrl(defaultImage);

    localStorage.setItem(
      'allProducts',
      allProducts.replace('all_products = [{', '[{')
    );
    localStorage.setItem('lastSync', new Date());
    localStorage.setItem('defaultImage', offlineImage);

    timerRef.current = window.setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  const handleClearStorage = useCallback(async () => {
    localStorage.removeItem('allProducts');
    localStorage.removeItem('defaultImage');
    localStorage.removeItem('lastSync');
    setUpdated(false);
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
              <>
                <IconButton
                  className={classes.syncIcon}
                  onClick={handleSync}
                  color='primary'
                  component='span'
                >
                  {loading ? (
                    <CircularProgress
                      className={classes.syncIcon}
                      variant='indeterminate'
                      disableShrink
                      size={24}
                    />
                  ) : (
                    <Sync />
                  )}
                </IconButton>
                {updated ? (
                  <IconButton
                    className={classes.deleteIcon}
                    onClick={handleClearStorage}
                    color='primary'
                    component='span'
                  >
                    <Delete />
                  </IconButton>
                ) : (
                  <></>
                )}
              </>
            }
            title={
              updated
                ? 'Last time synched:'
                : `Your application hasn't been synched!`
            }
            subheader={updated && timeUpdated}
          />
        </Card>
      </div>
      <div className={classes.root}>
        <Typography className={classes.title} variant='body2'>
          {updated
            ? 'The application is synced and ready to use!'
            : 'You need to sync the application at least once to use it!'}
        </Typography>
      </div>
      <div className={classes.root}>
        {updated ? (
          <Button
            onClick={handlePushSearch}
            variant='contained'
            color='primary'
          >
            Go to Search
          </Button>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default Search;
