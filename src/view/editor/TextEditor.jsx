import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBold, faItalic, faList } from '@fortawesome/free-solid-svg-icons';
import AppEvent from '../../event';

const textEditorContainer = {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  padding: '20px',
};

const textEditorToolbar = {
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
};

const textEditorContent = {
  /* border: 'solid 1px #000', */
  minHeight: '300px',
  flexGrow: 1,
};

class TextEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      html: props.html,
      uid: props.uid,
    };
  }

  componentDidMount() {
    this.textContent.focus();
  }

  handleBoldClick = () => {
    document.execCommand('bold', false);
  }

  handleItalicClick = () => {
    document.execCommand('italic', false);
  }

  handleListClick = () => {
    document.execCommand('insertunorderedlist', false);
  }

  handleInput = (e) => {
    const { uid } = this.state;
    new AppEvent(`texteditor.update.${uid}`, {
      html: e.target.innerHTML,
      text: e.target.innerText,
    }).dispatch();
  }

  handleKeyDown = (e) => {
    if (e.keyCode === 27) {
      e.target.contentEditable = false;
    }
  }

  handleClick = (e) => {
    if (e.target.contentEditable === 'false') {
      e.currentTarget.contentEditable = true;
    }
  }

  render() {
    const { html } = this.state;
    return (
      <div style={textEditorContainer}>
        <div style={textEditorToolbar}>
          <button type="button" onClick={this.handleBoldClick}>
            <FontAwesomeIcon icon={faBold} />
          </button>
          <button type="button" onClick={this.handleItalicClick}>
            <FontAwesomeIcon icon={faItalic} />
          </button>
          <button type="button" onClick={this.handleListClick}>
            <FontAwesomeIcon icon={faList} />
          </button>
        </div>
        <div
          ref={(content) => { this.textContent = content; }}
          onKeyDown={this.handleKeyDown}
          onClick={this.handleClick}
          style={textEditorContent}
          onInput={this.handleInput}
          contentEditable="true"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    );
  }
}

export default TextEditor;
