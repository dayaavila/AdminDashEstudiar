import * as React from 'react';
import { Globals } from '../../../../Globals';
import { Datos } from '../../../../ajax/GetData';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setInfoStatus } from '../../../../Stores/StoreGeneral';

import { IField } from '../../../../Interfaces/IField';

export interface ImageFieldProps extends IField {
	setInfoStatus?: any;
	AppState?: any;
	accept?: string;
}
interface ImageFieldState {
	thumbnail: any;
}
import './formFieldStyles.css';


function mapStateToProps(state: any, props: any) {
	return {
		AppState: state.StoreGeneral.AppState
	}
}

function mapDispatchToProps(dispatch: any, props: any) {
	return {
		setInfoStatus: bindActionCreators(setInfoStatus, dispatch)
	};
}
@connect(mapStateToProps, mapDispatchToProps)
export class ImageField extends React.Component <ImageFieldProps,any> {
	application = "GENERAL";
	setValue(v:any) {
		//Local validation (textfield: none)
		this.props.setValue(v);
	}

	constructor(props: ImageFieldProps) {
		super(props);
		if (props.value != null && props.value != "") {
			this.state = {
				thumbnail: <img src={"../" + props.value + ".thumb.jpg"} className='formFieldThumbnail' onClick={this.removeImage.bind(this)} />
			};
		} else {
			this.state = {
				thumbnail : null
			}
		}
	}

	componentWillReceiveProps(newProps: ImageFieldProps) {
		if (newProps.value != null && newProps.value != "") {
			this.setState({
				thumbnail : <img src={"../" + newProps.value + ".thumb.jpg"} className='formFieldThumbnail' onClick={this.removeImage.bind(self)} />
			});
		}
	}

	render() {
		return (
			<div className='fieldRow bordered'>
				<div className='formFieldLabel'> {this.props.label} </div>
				<div className='formFieldField'>
					<input type='file'
						className={'inputFileStyle' + (this.props.locked ? " lockedStyle" : "")}
						accept={this.props.accept ? this.props.accept : 'image/*'}
						onChange={(e) => { this.uploadImages(e.target.files) }}
						disabled={this.props.locked}
					/>
				</div>
				<div className='formFieldRichEditorContainer'>
					{this.state.thumbnail ? <div className='thumbnailHolder'>{this.state.thumbnail}</div> : null}
				</div>
			</div>
		);
	}

	removeImage(index: any) {
		this.setState({
			thumbnail: null
		}, ()=>{
			this.setValue(null);
		});
	}

	uploadImages(images: FileList) {
		let self = this;
		var reader = new FileReader();
		//Upload to server as temporary file and return temp path before definitive save.

		reader.onload = function(e: any) {
			if (e!==undefined) {
				let image = <img src={e.target.result} className='formFieldThumbnail' onClick={self.removeImage.bind(self)} />;
				self.setState({
					thumbnail: image
				}, ()=> {
					self.uploadImageToServer(e);
				});
			}
		}
		let image: any = images[0];
		if (image instanceof Blob) reader.readAsDataURL(image);
	}

	/*--- DATA SERVICES ---*/
	uploadImageToServer(image: any = null, successCallback: any = null) {
		this.props.setInfoStatus(1, "Subiendo fichero...", 100);
		let method = "uploadImage";
		let params = {
			APPLICATION: this.application,
			FILE: image.target.result
		};

		Datos.JSONPost(Globals.InternalWebService, method,
			params, this.onImageUploaded.bind(this, successCallback), this.onImageUploadError.bind(this));
	}

	onImageUploaded (successCallback, datos: any) {
		this.setValue(datos['fileName']);
		this.props.setInfoStatus(0, datos['FULLENTRYPARAMS']['METHOD'] + ": Successful", 100);
		if (successCallback) successCallback();
		
	}

	onImageUploadError(err: any) {
		console.log("ERROR: " + err['METHOD']);
		this.props.setInfoStatus(3, "ERROR: " + err['METHOD'], 100);
	}

	/*- updateInfo -*/

	/*--- END OF DATA SERVICES ---*/
}