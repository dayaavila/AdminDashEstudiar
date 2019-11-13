import * as React from 'react';

import './widget.css';
import { Widget } from './Widget';
import { Globals } from '../../../../Globals';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { openForm, IAppState, Login } from '../../../../Stores/StoreGeneral';
import {Datos} from "../../../../ajax/GetData";

let icon = 'build/img/usericon.png';

function mapStateToProps(state: any, props: any) {
	return {
		AppState: state.StoreGeneral.AppState,
		Worker: state.StoreGeneral.Worker
	}
}

function mapDispatchToProps(dispatch: any, props: any) {
	return {
		openForm: bindActionCreators(openForm, dispatch),
		Login: bindActionCreators(Login, dispatch)
	};
}

@connect(mapStateToProps, mapDispatchToProps)
export class TasksStatusWidget extends React.Component<any,any> {
    application = "TASKS";
	optionsMenu: any;

	componentWillMount() {
        this.InformationServiceCall(this.application, "Tasks", "getMyTasksCounters", ()=>{
            this.setState({
                optionsMenu:  [
                    {
                        text: 'Cambio contraseña',
                        icon: Globals.WidgetIconUserProfile,
                        action: this.props.openForm,
                        params: 'FrmChangePassword'
                    }
				]
            });
        });
 	}

    InformationServiceCall(application: string, method: string, operation: string, successCallback:any=null) {
        this.props.setInfoStatus(1, "Cargando información...", 100);
        this.props.setWaitingForServer(true);
        let newRecordArray:any = null;
        let params = {
            APPLICATION: application,
            OPERATION: operation,
            FILTER: this.state.filter,
            SORTING: null,
            WORKER: this.props.Worker,
        };
        Datos.JSONPost(Globals.InternalWebService, method,
            params, this.onServiceOk.bind(this,successCallback), this.onServiceError.bind(this));
    }

    onServiceOk(successCallback, datos: any) {
        this.props.setWaitingForServer(false);
        if (!datos['ERROR']) {
            this.props.setInfoStatus(0, datos['FULLENTRYPARAMS']['METHOD'] + ": Successful", 100);
            if (successCallback) successCallback();
        }
    }

    onServiceError(err: any) {
        this.props.setWaitingForServer(false);
        this.props.setInfoStatus(3,"ERROR: " + err['METHOD'],100);
    }

	render() {
		return (<div>
			{this.state.optionsMenu? <Widget icon={Globals.WidgetIconUserProfile} title={this.props.Worker.name} Menu={this.state.optionsMenu} />:null}
            </div>
		);
	}
}