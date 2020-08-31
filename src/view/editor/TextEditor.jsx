import React from 'react';
import { Editor, EditorState, RichUtils } from 'draft-js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBold, faItalic, faUnderline } from '@fortawesome/free-solid-svg-icons';
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

  handleToggleStyle = (e, styleName) => {
    e.preventDefault();
    const { editorState } = this.state;
    this.handleChange(RichUtils.toggleInlineStyle(editorState, styleName));
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
          <button type="button" onMouseDown={(e) => this.handleToggleStyle(e, 'BOLD')}>
            <FontAwesomeIcon icon={faBold} />
          </button>
          <button type="button" onMouseDown={(e) => this.handleToggleStyle(e, 'ITALIC')}>
            <FontAwesomeIcon icon={faItalic} />
          </button>
          <button type="button" onMouseDown={(e) => this.handleToggleStyle(e, 'UNDERLINE')}>
            <FontAwesomeIcon icon={faUnderline} />
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
