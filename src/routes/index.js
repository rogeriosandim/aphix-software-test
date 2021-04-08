import React from 'react';
import { Switch, Redirect, BrowserRouter } from 'react-router-dom';
import RouteWithLayout from '../components/RouteWithLayout';
import Main from '../layouts/Main';
import Search from '../pages/Search';
import Syncing from '../pages/Syncing';
import ProductDescription from '../pages/ProductDescription';

const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Redirect exact from='/' to='/syncing' />
        <RouteWithLayout component={Search} layout={Main} path='/search' />
        <RouteWithLayout component={Syncing} layout={Main} path='/syncing' />
        <RouteWithLayout
          component={ProductDescription}
          layout={Main}
          path='/description'
        />
        <Redirect to='/not-found' />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
