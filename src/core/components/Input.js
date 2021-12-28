import React, { Component } from 'react';

import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import './code-editor-style.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faPlay } from '@fortawesome/free-solid-svg-icons';

class Input extends Component {
  constructor(props) {
    super(props);

    // history is set in the componentDidMount
    this.state = {
      value: props.value || '',
      multiline: false,
      rows: 1,
    };
    this.onChange = this.onChange.bind(this);
    this.run = this.run.bind(this);
  }

  onChange(value) {
    const length = value.split('\n').length;
    this.setState({
      multiline: length > 1,
      rows: length < 20 ? length : 20,
      value,
    });
  }

  async run(e) {
    e.preventDefault();
    await this.props.onRun(this.state.value);
    // Don't use `this.input.scrollIntoView();` as it messes with iframes
    window.scrollTo(0, document.body.scrollHeight);
  }

  render() {
    const { autoFocus } = this.props;
    return (
      <div className="Input">
        <Editor
          value={this.state.value}
          onValueChange={this.onChange}
          highlight={(code) => highlight(code, languages.js)}
          padding={10}
          className="container__editor"
        />
        <div className="toolbar">
          <span onClick={this.run} className="toolbar__button">
            <FontAwesomeIcon icon={faPlay} /> run
          </span>
          <span onClick={this.run} className="toolbar__button">
            <FontAwesomeIcon icon={faCopy} /> copy
          </span>
        </div>
      </div>
    );
  }
}

export default Input;
