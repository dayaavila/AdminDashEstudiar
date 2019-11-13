import * as React from 'react';

import './zoomableimage.css';
import {Globals} from "../../../Globals";

interface ZoomableImageProps {
	src: any;
	className: any;
	width?: any;
	height?: any;
}

interface ZoomableImageState {
	collapsed: boolean;
}

export class ZoomableImage extends React.Component<ZoomableImageProps,ZoomableImageState> {
	constructor() {
		super();
		this.state = {
			collapsed: true
		};
	}

	toggleColapse() {
		this.setState({
			collapsed: !this.state.collapsed
		});
	}
	render() {
		return (
			<div>
			{
				this.state.collapsed ? 
					<img className={this.props.className} src={this.props.src} onClick={this.toggleColapse.bind(this)} /> 
					:
					<div className='zoomableImageFullWindow'>
						<div className='zoomableImageFullImage'>
                            <div className='zoomableImageButton redBg' onClick={this.toggleColapse.bind(this)}>
                                X
                            </div>
                            <div className='zoomableImageButton greenBg'>
                                <a href={this.props.src} target={"_blank"}>
                                    <img className='zoomableImageButtonImage' src={Globals.findIcon("Expand").value}/>
                                </a>
							</div>
							<img className='zoomableImageImage' src={this.props.src} onClick={this.toggleColapse.bind(this)}/></div>
					</div>
			}
			</div>
			)
		;
	}	
}