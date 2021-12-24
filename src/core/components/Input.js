import React, { Component } from 'react';

import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import './code-editor-style.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';

const DEFAULT_CODE =
`
let connection = new web3.Connection(web3.clusterApiUrl("mainnet-beta"));
let slot = await connection.getSlot();
console.log(slot);
`;

class Input extends Component {
  constructor(props) {
    super(props);

    // history is set in the componentDidMount
    this.state = {
      value: props.value || DEFAULT_CODE,
      multiline: false,
      rows: 1,
      historyCursor: props.history.length,
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
        <span onClick={this.run} style={{
          border: '2px solid black',
          borderRadius: '8px', cursor: 'pointer', background: 'black',
          color: 'white', display: 'inline-block', padding: 9}}>
          <FontAwesomeIcon icon={faPlay} /> run
        </span>
      </div>
    );
  }
}

export default Input;
