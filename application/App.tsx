import * as React from 'react';
import {Globals} from '../Globals';
import {Datos} from '../ajax/GetData';
import { Dialog } from '../components/common/Dialog/Dialog';
import { Login } from '../Stores/StoreGeneral';
import { LoginScreen } from '../Screens/General/LoginScreen';
import {BrowserRouter, Route} from "react-router-dom";

import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import { setLeftMenuState, IAppState } from '../Stores/StoreGeneral';

import { TaskBar } from '../components/common/taskbar/TaskBar';
import { Container } from '../components/common/container/Container';

import './app.css';
import {ServerLoading} from "../components/common/ServerLoading/ServerLoading";


function mapStateToProps(state:any, props:any) {
  return {
   AppState : state.StoreGeneral.AppState,
   Worker: state.StoreGeneral.Worker
  }
}

function mapDispatchToProps(dispatch:any, props:any) {
  return {
    setLeftMenuState: bindActionCreators(setLeftMenuState, dispatch)
  };
}

@connect (mapStateToProps, mapDispatchToProps)
export class App extends React.Component <any,any> {
  timer: any;

  constructor() {
    super();
  }

  componentDidMount() {
  }

  setLeftMenuState(state:boolean) {
    this.props.setLeftMenuState(state);
  }

  render() {
    return (
      <div>
        <ServerLoading/>
       {this.props.Worker ?
         <div>
          <Dialog/>
           <TaskBar  />
           <BrowserRouter>
             <Route path="/que" children={<div>eh!</div>}/>
           </BrowserRouter>
           <Container ActiveForm={this.props.AppState.ActiveForm} isLeftMenuOpened={!this.props.AppState.AppMenuCollapsed} />
         </div>
         : 
           <LoginScreen/>
         }
      </div>
    );
  }
}
