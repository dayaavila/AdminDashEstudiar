import * as React from 'react';
import '../tableStyle.css';

import { IField } from '../../../../Interfaces/IField';

export class DTFText extends React.Component<IField, any> {

	render() {
        let texto = this.props.value;
        if (this.props.link && texto=="0") texto="";

		if (this.props.printMode) { 
			return (<td className={'dtField hiddenTable'}>{texto}</td>);
	 	} else {
			return (<td className={'dtField dtTextValue ' + this.props.style?this.props.style:null}>
                {this.props.link && this.props.value && texto.length > 0 ?
                    <a href={this.props.link + this.props.value} target={"_blank"}>
                        {texto}
                    </a> :
                    texto
                }
                </td>);
		}
	}
}