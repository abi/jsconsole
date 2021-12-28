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
      isCopying: false,
      isRunning: false,
    };
    this.onChange = this.onChange.bind(this);
    this.run = this.run.bind(this);
    this.copy = this.copy.bind(this);
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
    let finished = false;
    setTimeout(() => {
      if (!finished) {
        this.setState({isRunning: true});
      }
    }, 400);
    await this.props.onRun(this.state.value);
    finished = true;
    this.setState({isRunning: false});
    // Don't use `this.input.scrollIntoView();` as it messes with iframes
  }

  async copy(e) {
    e.preventDefault();
    const text = this.state.value;
    this.setState({isCopying: true});
    setTimeout(() => {
      this.setState({isCopying: false});
    }, 800);
    if ('clipboard' in navigator) {
      return await navigator.clipboard.writeText(text);
    } else {
      return document.execCommand('copy', true, text);
    }
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
            <FontAwesomeIcon icon={faPlay} /> {!this.state.isRunning ? 'run' : 'running...'}
          </span>
          <span onClick={this.copy} className="toolbar__button">
            <FontAwesomeIcon icon={faCopy} /> {!this.state.isCopying ? 'copy' : 'copied'}
          </span>
        </div>
      </div>
    );
  }
}

export default Input;
