import * as React from 'react';
import { FloatingMenu } from './FloatingMenu';
import './widget.css';


interface WidgetProps {
	icon: string;
	title: string;
	Menu?: any;
	directAction?: any;
}

interface WidgetState {
	collapsed: boolean;
}

export class Widget extends React.Component<WidgetProps, WidgetState> {
	
	constructor() {
		super();
		this.state = { collapsed: true };
	}

	onClick() {
		if (this.props.directAction) {
			this.props.directAction.bind(this);
		}
	}
	
	toggleCollapsed() {
		this.setState({
			collapsed: !this.state.collapsed
		});
	}


	render() {
		return (
			<div className='widget' onClick={this.toggleCollapsed.bind(this)}>
				<div className='widgetRow' onMouseLeave={!this.state.collapsed ? this.toggleCollapsed.bind(this):null}>
					<div className='widgetIcon'><img src={this.props.icon} className="widgeticon" /></div>
					<div className='widgetTitle'>{this.props.title}</div>
                    {!this.state.collapsed && this.props.Menu ?
                        <FloatingMenu Menu={this.props.Menu} onHideMenu = {this.toggleCollapsed.bind(this)} />
                        : null
                    }
				</div>


			</div>
			);
		/*
		<div className='widget' onClick={this.toggleCollapsed.bind(this)}>
				<div className='widgetRow' onMouseLeave={!this.state.collapsed ? this.toggleCollapsed.bind(this):null}>
					<div className='widgetIcon'><img src={this.props.icon} className="widgeticon" /></div>
					<div className='widgetTitle'>{this.props.title}</div>
				</div>
				<div className='widgetRow'>
					{!this.state.collapsed && this.props.Menu ?
						<FloatingMenu Menu={this.props.Menu} onHideMenu = {this.toggleCollapsed.bind(this)} />
						: null
					}</div>
			</div>
		*/

	}
}

