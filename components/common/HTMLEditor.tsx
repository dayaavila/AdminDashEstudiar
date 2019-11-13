import * as React from 'react';
import RichTextEditor from 'react-rte';
import './HTMLEditor.css';

export class HTMLEditor extends React.Component <any,any> {
  constructor(props:any) {
    super(props);
    this.state = {
    richValue: RichTextEditor.createValueFromString(props.value, 'html'),
    htmlValue: props.value
    }
  }

  componentWillReceiveProps (newProps) {
    if (newProps.value != this.state.htmlValue) {
      this.setState({
        richValue: RichTextEditor.createValueFromString(newProps.value, 'html'),
        htmlValue: newProps.value,
      });
    }
  }

  onChange = (richValue) => {
    this.setState({richValue, htmlValue: richValue.toString('html')}, () => {
      this.props.onChange(this.state.htmlValue);
    });
  };

  render () {
    return (
      <RichTextEditor
        editorClassName={"htmlEditorEditorStyle"}
        toolbarClassName={"htmlEditorToolbarStyle"}
        value={this.state.richValue}
        onChange={this.onChange}

      />
    );
  }
}