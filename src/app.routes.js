import  React, {Component } from 'react';
import { Switch, Route } from "react-router";
import { StoreList } from './components/store-owner/stores-list';

const routes = [
    {
        path: '/manage-stores',
        component: StoreList
    }
]
export default class AppRoutes extends Component {
       
    render() {
      return (
        <div>
        
            <Switch>
              {
                  routes.map(route=>{
                    <Route key={route.path} exact={true} path={route.path} component={route.component}/>
                  })
              }
            </Switch>
         </div>
        );
    }
  
  }
