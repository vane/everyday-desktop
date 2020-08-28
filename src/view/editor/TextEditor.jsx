import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBold, faItalic, faList } from '@fortawesome/free-solid-svg-icons';
import AppEvent from '../../event';

const textEditorContainer = {
};

const textEditorContent = {
  minHeight: '200px',
  border: 'solid 1px #000',
};

class TextEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      html: props.html,
      uid: props.uid,
    };
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

  handleTextChange = (e) => {
    const { uid } = this.state;
    new AppEvent(`texteditor.update.${uid}`, {
      html: e.target.innerHTML,
      text: e.target.innerText,
    }).dispatch();
  }

  render() {
    const { html } = this.state;
    return (
      <div style={textEditorContainer}>
        <div>
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
          style={textEditorContent}
          onInput={this.handleTextChange}
          contentEditable="true"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    );
  }
}

export default TextEditor;
