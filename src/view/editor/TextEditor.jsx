import React from 'react';
import { Editor, EditorState, RichUtils } from 'draft-js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBold, faItalic } from '@fortawesome/free-solid-svg-icons';
import 'draft-js/dist/Draft.css';

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

class TextEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
    };
  }

  componentDidMount() {
    this.editor.focus();
  }

  handleBoldClick = () => {
    const { editorState } = this.state;
    this.handleChange(RichUtils.toggleInlineStyle(editorState, 'BOLD'));
    this.editor.focus();
  }

  handleItalicClick = () => {
    const { editorState } = this.state;
    this.handleChange(RichUtils.toggleInlineStyle(editorState, 'ITALIC'));
    this.editor.focus();
  }

  handleChange = (editorState) => {
    this.setState({ editorState });
  }

  render() {
    const { editorState } = this.state;
    return (
      <div style={textEditorContainer}>
        <div style={textEditorToolbar}>
          <button type="button" onClick={this.handleBoldClick}>
            <FontAwesomeIcon icon={faBold} />
          </button>
          <button type="button" onClick={this.handleItalicClick}>
            <FontAwesomeIcon icon={faItalic} />
          </button>
        </div>
        <Editor
          ref={(content) => { this.editor = content; }}
          placeholder="Enter some text"
          editorState={editorState}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}

export default TextEditor;
