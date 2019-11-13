import * as React from 'react';
import { Globals } from '../../../Globals';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Datos } from '../../../ajax/GetData';
import { openForm, setLeftMenuState, setInfoStatus, IAppState } from '../../../Stores/StoreGeneral';

/* animations */
import {fadeIn} from 'react-animations';
import Radium, {StyleRoot} from 'radium';

/* Widgets*/
import { UserProfileWidget } from './widgets/UserProfileWidget';
import { StatusWidget } from './widgets/StatusWidget';
import { ApplicationStatusbar } from './widgets/ApplicationStatusbar';

import './taskbar.css';
import './../layouts.css';
import {Menu} from "./Menu";

interface TaskBarState {
    openedFolderIds: any,
    MenuTree: any;
}
function mapStateToProps(state: any, props: any) {
    return {
        AppState: state.StoreGeneral.AppState,
        Worker: state.StoreGeneral.Worker
    }
}

function mapDispatchToProps(dispatch: any, props: any) {
    return {
        openForm: bindActionCreators(openForm, dispatch),
        setLeftMenuState: bindActionCreators(setLeftMenuState, dispatch),
        setInfoStatus: bindActionCreators(setInfoStatus, dispatch)
    };
}

@connect(mapStateToProps, mapDispatchToProps)
export class TaskBar extends React.Component <any,TaskBarState> {
    application = "GENERAL";
    dataSource = "getUserMenuTree";

    //Menu: any;
    constructor(props:any) {
        super(props);
        this.state = {
            openedFolderIds: new Array<number>(),
            MenuTree:null
        }
    }

    componentDidMount() {
        this.InformationServiceCall(this.application, this.dataSource, "SELECT");
    }

    toggleCollapse() {
        this.props.setLeftMenuState(!this.props.AppState.AppMenuCollapsed);
    }

    setOpenedFolerIds(openedFIds:any) {
        this.setState({
            openedFolderIds: openedFIds
        });
    }

    render() {
        let styles = {
            fadeIn: {
                animation : 'x 1s',
                animationName: Radium.keyframes(fadeIn, 'fadeIn')
            }
        };

        return (
            <StyleRoot>
                <div className='taskbar' style = {styles.fadeIn}>
                    <div className='threecolumns'>
                        <div className='taskbarIcon' onClick = {this.toggleCollapse.bind(this)}><img className='taskbarImageIcon' src={this.props.AppState.AppMenuCollapsed ? Globals.AppMenuIcon: Globals.AppMenuIcon2}/></div>
                        <div className='taskbarText'>{Globals.AppName}</div>
                    </div>
                    <div className='threecolumns'><ApplicationStatusbar/></div>
                    <div className='threecolumns'>
                        <UserProfileWidget/>
                        <StatusWidget/>
                    </div>
                    <Menu isCollapsed={this.props.AppState.AppMenuCollapsed}
                          menuTree={this.state.MenuTree}
                          openedFolderIds={this.state.openedFolderIds}
                          Worker = {this.props.Worker}
                          onChangeState = {this.setOpenedFolerIds.bind(this)}
                          openFormCallback={this.props.openForm}
                    />
                </div>
            </StyleRoot>
        );
    }


    InformationServiceCall(application: string, method: string, operation: string, newRecord: any = null, successCallback: any = null) {
        this.props.setInfoStatus(1, "Cargando menús de usuario...", 100);
        let newRecordArray: any = null;
        if (newRecord) {
            newRecordArray = Array();
            newRecord.idusuario = { value: this.props.Worker.id, dirty: true };
        }
        let params = {
            APPLICATION: application,
            OPERATION: operation,
        };

        Datos.JSONPost(Globals.InternalWebService, method,
            params, this.onServiceOk.bind(this, successCallback), this.onServiceError.bind(this));
    }

    onServiceOk(successCallback, datos: any) {
        this.setState({
            openedFolderIds: new Array<number>(),
            MenuTree: datos['RECORDS']
        }, () => {
            this.props.setInfoStatus(0, datos['FULLENTRYPARAMS']['METHOD'] + ": Successful", 100);
        });
    }

    onServiceError(err: any) {
        this.props.setInfoStatus(3, "ERROR: " + err['METHOD'], 100);
    }
}