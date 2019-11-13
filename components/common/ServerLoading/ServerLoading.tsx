import * as React from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import { setLeftMenuState, IAppState } from '../../../Stores/StoreGeneral';
import './serverloading.css';
import {bounceInUp} from 'react-animations';
import Radium, {StyleRoot} from 'radium';

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

export class ServerLoading extends React.Component<any,any> {
    render() {
        let styles = {
            bounceInUp: {
                animation : 'x 1.7s',
                animationName: Radium.keyframes(bounceInUp, 'bounce-in-up'),
            }
        };

        return <StyleRoot><div>
                    {this.props.AppState.WaitingForServer?
                        <div className={'serverwaitingcontainer'} style={styles.bounceInUp}>
                            <div className={'serverwaitinglimgcontainer'}><img src={'build/img/loading4.gif'} className={'serverwaitingloadingimage'}/></div>
                            <div className={'serverwaitingtextcontainer'}>Cargando información...</div>
                        </div>
                    :null}
               </div></StyleRoot>;
    }
}