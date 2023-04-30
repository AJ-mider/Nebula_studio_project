import CodeMirror from 'codemirror';
import 'codemirror/addon/comment/comment';
import 'codemirror/addon/display/autorefresh';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/keymap/sublime';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/meta';
import 'codemirror/theme/monokai.css';
import React from 'react';

import { ban, keyWords, operators } from '@app/config/nebulaQL';

import './index.less';

interface IProps {
  options?: object;
  value: string;
  ref?: any;
  width?: string;
  height?: string;
  onShiftEnter?: () => void;
  onChange?: (value: string) => void;
  onBlur?: (value: string) => void;
  onChangeLine?: () => void;
}

export default class ReactCodeMirror extends React.PureComponent<IProps, any> {
  codemirror;
  editor;
  textarea;
  constructor(props) {
    super(props);
  }
  public componentDidMount() {
    CodeMirror.defineMode('nebula', () => {
      return {
        token: stream => {
          if (stream.eatSpace()) {
            return null;
          }
          stream.eatWhile(/[\$:\w\u4e00-\u9fa5]/);
          const cur = stream.current();
          if (keyWords.some(item => item === cur)) {
            return 'keyword';
          } else if (operators.some(item => item === cur)) {
            return 'def';
          } else if (ban.some(item => item === cur)) {
            return 'error';
          }
          stream.next();
        },
      };
    });

    CodeMirror.registerHelper('hint', 'nebula', cm => {
      const cur = cm.getCursor();
      const token = cm.getTokenAt(cur);
      const str = token.string;
      const start = token.start;
      const end = cur.ch;

      if (str === '') {
        return;
      }

      const list = [...keyWords, ...operators, ...ban].filter(item => {
        return item.indexOf(str) === 0;
      });

      if (list.length) {
        return {
          list,
          from: CodeMirror.Pos(cur.line, start),
          to: CodeMirror.Pos(cur.line, end),
        };
      }
    });
    this.renderCodeMirror();
  }
  renderCodeMirror() {
    // parameters of the combined
    const options = {
      tabSize: 2,
      fontSize: '14px',
      autoCloseBrackets: true,
      matchBrackets: true,
      showCursorWhenSelecting: true,
      lineWrapping: true,
      // show number of rows
      lineNumbers: true,
      fullScreen: true,
      mode: 'nebula',
      ...this.props.options,
    };
    this.editor = CodeMirror.fromTextArea(this.textarea, options);
    // Getting CodeMirror is used to get some of these constants
    this.codemirror = CodeMirror;
    // event
    this.editor.on('change', this.codemirrorValueChange);
    this.editor.on('keydown', this.keydown);
    this.editor.on('blur', this.blur);
    const { value, width, height } = this.props;
    this.editor.setValue(value || '');
    if (width || height) {
      // set size
      this.editor.setSize(width, height);
    }
  }

  blur = instance => {
    if (this.props.onBlur) {
      this.props.onBlur(instance.doc.getValue());
    }
  };

  keydown = (_, change) => {
    if (change.shiftKey === true && change.keyCode === 13) {
      if (this.props.onShiftEnter) {
        this.props.onShiftEnter();
      }
      change.preventDefault();
    }
  };

  codemirrorValueChange = (doc, change) => {
    if (change.origin !== 'setValue') {
      if (this.props.onChange) {
        this.props.onChange(doc.getValue());
      }
    }
    if (change.origin === '+input') {
      CodeMirror.commands.autocomplete(this.editor, null, {
        completeSingle: false,
      });
    }
    if (
      this.props.onChangeLine &&
      (change.origin === '+delete' || change.origin === '+input')
    ) {
      this.props.onChangeLine();
    }
  };

  async UNSAFE_componentWillReceiveProps(nextProps) {
    const { options, value } = nextProps;
    await this.setOptions(options);
    if (value !== this.editor.getValue()) {
      this.editor.setValue(value || '');
    }
  }

  async setOptions(options) {
    if (typeof options === 'object') {
      const mode = CodeMirror.findModeByName(options.mode);
      if (mode && mode.mode) {
        await import(`codemirror/mode/${mode.mode}/${mode.mode}.js`);
      }
      if (mode) {
        options.mode = mode.mime;
      }
      Object.keys(options).forEach(name => {
        if (options[name] && JSON.stringify(options[name])) {
          this.editor.setOption(name, options[name]);
        }
      });
    }
  }

  componentWillUnmount() {
    if (this.editor) {
      this.editor.toTextArea();
    }
  }

  render() {
    return (
      <textarea
        ref={instance => {
          this.textarea = instance;
        }}
      />
    );
  }
}
