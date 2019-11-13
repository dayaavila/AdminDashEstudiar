import * as React from 'react';

import './widget.css';
import { Widget } from './Widget';
import { Globals } from '../../../../Globals';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { openForm, IAppState, Login } from '../../../../Stores/StoreGeneral';

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
export class UserProfileWidget extends React.Component<any,any> {
	optionsMenu: any;
	componentWillMount() {
		this.optionsMenu = [
			{
				text: 'Cambio contraseña',
				icon: Globals.WidgetIconUserProfile,
				action: this.props.openForm,
				params: 'FrmChangePassword'
			},
			{
				text: 'Logout',
				icon: Globals.WidgetIconUserLogout,
				action: this.LogoutUser.bind(this),
				params: null
			},
		];
 	}

	
	LogoutUser() {
		localStorage.removeItem("dashUserPass");
		this.props.Login(null);
		this.props.openForm("WelcomeForm");
	}

	render() {
		return (
			<Widget icon={Globals.WidgetIconUserProfile} title={this.props.Worker.name} Menu={this.optionsMenu} />
		);
	}
}