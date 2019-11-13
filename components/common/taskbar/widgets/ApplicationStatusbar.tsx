import * as React from 'react';
import { Globals } from '../../../../Globals'
import './applicationstatusbar.css';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Login } from '../../../../Stores/StoreGeneral';
import { SetAppState, IAppState, AppInfoText} from '../../../../Stores/StoreGeneral';

function mapStateToProps(state: any, props: any) {
	let appstate: IAppState = state.StoreGeneral.AppState;
	return {
		Worker: state.StoreGeneral.Worker,
		AppState: appstate,
	}
}

function mapDispatchToProps(dispatch: any, props: any) {
	return {
		//SetLineaYPicking: bindActionCreators(setLineaYPicking, dispatch)
		SetAppState: bindActionCreators(SetAppState, dispatch)
	};
}

@connect(mapStateToProps, mapDispatchToProps)
export class ApplicationStatusbar extends React.Component<any,any> {

	constructor() {
		super();
		this.state = {
			showingDetails:false
		}
	}

	getFormattedTime(date: Date) {
		let strDate = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
		return strDate;
	}
	getFormattedDate(date: Date) {
		let strDate = date.getDay() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()+" "+ date.getHours() + ":" + date.getMinutes()+":"+date.getSeconds();
		return strDate;
	}
	render() { 
		return (
			<div>
				<div className='applicationStatusbar' onClick={this.toggleShowingDetails.bind(this)}>
						{this.renderAppStatusIcon()}
				</div>
				{this.state.showingDetails ? 
					<div className='showingAppStatusDetails'>
						<div className='appDetailsRow'>Server: {Globals.InternalWebService}</div>
						{this.props.AppState.InformationStatus.map((item: AppInfoText, index: number) => {
							return item.text.includes("Cargando")==false ?
									<div key={index} className='appDetailsRow'>{this.getFormattedTime(item.date)} : {item.text}</div>
									: null
							;
						 })} 
					</div>
					:null}
			</div>
		);
	}

	toggleShowingDetails() {
		this.setState( {
			showingDetails : !this.state.showingDetails
		})
	}

	renderAppStatusIcon () {
		if (this.props.AppState) {
			let retorno: any;
			switch (this.props.AppState.tipoStatus) {
				case 0:	//Mensaje simple icono de información.
					retorno = <div>
						<div className='applicationStatusbarLoadingIcon'>
							<img src={Globals.findIcon('Information').value} className='applicationStatusbarInformationIconImage' />
						</div>
						<div className='applicationStatusbarMessage'>
							{this.props.AppState ? this.props.AppState.InformationStatus[0].text : " "}
						</div>
					</div>;
					break;
				case 1:		//Loading message
					retorno = <div>
						<div className='applicationStatusbarLoadingIcon'>
							<img src={Globals.findIcon('Loading').value} className='applicationStatusbarLoadingIconImage' />
						</div>
						<div className='applicationStatusbarMessage'>
							{this.props.AppState ? this.props.AppState.InformationStatus[0].text : " "}
						</div>
					</div>;
					break;

				case 2:		//Progress bar
					retorno = <div>
						<div className='applicationStatusProgressbarContainer'>
							<div className='applicationStatusProgressbarPercent' style={{ width: this.props.AppState.Progress + "%" }}></div>
							<div className='applicationStatusProgressText'>{this.props.AppState.Progress + "%"}</div>
						</div>
					</div>;
					break;
				case 3:	//Error message
					retorno = <div>
						<div className='applicationStatusbarLoadingIcon'>
							<img src={Globals.findIcon('Error').value} className='applicationStatusbarErrorIconImage' />
						</div>
						<div className='applicationStatusbarMessage'>
							{this.props.AppState ? this.props.AppState.InformationStatus[0].text : " "}
						</div>
					</div>;
					break;

			}
			return  retorno;
		}
	}
}