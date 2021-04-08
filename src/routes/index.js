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
        <Redirect exact from='/' to='/search' />
        <RouteWithLayout
          component={Search}
          exact
          layout={Main}
          path='/search'
        />
        <RouteWithLayout
          component={Syncing}
          exact
          layout={Main}
          path='/syncing'
        />
        <RouteWithLayout
          component={ProductDescription}
          exact
          layout={Main}
          path='/description'
        />
        <Redirect to='/not-found' />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
