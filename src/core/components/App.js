import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Console from './Console';
import Input from './Input';

import run, { bindConsole, createContainer } from '../lib/run';
import internalCommands from '../lib/internal-commands';
import '../jsconsole.css';

// this is lame, but it's a list of key.code that do stuff in the input that we _want_.
const doStuffKeys = /^(Digit|Key|Num|Period|Semi|Comma|Slash|IntlBackslash|Backspace|Delete|Enter)/;

class App extends Component {
  constructor(props) {
    super(props);
    this.onRun = this.onRun.bind(this);
  }

  async onRun(command) {
    const console = this.console;

    if (command[0] !== ':') {
      console.clear();
      const res = await run(command);
      console.push({
        command,
        type: 'response',
        ...res,
      });
      return;
    }

    let [cmd, ...args] = command.slice(1).split(' ');

    if (/^\d+$/.test(cmd)) {
      args = [parseInt(cmd, 10)];
      cmd = 'history';
    }

    if (!internalCommands[cmd]) {
      console.push({
        command,
        error: true,
        value: new Error(`No such jsconsole command "${command}"`),
        type: 'response',
      });
      return;
    }

    let res = await internalCommands[cmd]({ args, console, app: this });

    if (typeof res === 'string') {
      res = { value: res };
    }

    if (res !== undefined) {
      console.push({
        command,
        type: 'log',
        ...res,
      });
    }

    return;
  }

  componentDidMount() {
    createContainer();
    bindConsole(this.console);
    const query = decodeURIComponent(window.location.search.substr(1));
    // if (query) {
    //   this.onRun(query);
    // } else {
    //   // this.onRun(':welcome');
    // }
  }

  render() {
    const { commands = [], theme, layout, code } = this.props;

    const className = classnames(['App', `theme-${theme}`, layout]);

    return (
      <div
        tabIndex="-1"
        ref={e => (this.app = e)}
        className={className}
      >
        <Input
          inputRef={e => (this.input = e)}
          onRun={this.onRun}
          onClear={() => {
            this.console.clear();
          }}
          value={code}
        />
        <Console
          ref={e => (this.console = e)}
          commands={commands}
          reverse={layout === 'top'}
        />
      </div>
    );
  }
}

App.contextTypes = { store: PropTypes.object };

export default App;
