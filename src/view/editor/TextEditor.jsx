import React from 'react';
import { Editor, EditorState, RichUtils } from 'draft-js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBold,
  faItalic,
  faUnderline,
  faStrikethrough,
  faListOl,
  faListUl,
  faAlignCenter,
  faAlignLeft,
  faAlignRight,
  faAlignJustify,
} from '@fortawesome/free-solid-svg-icons';
import 'draft-js/dist/Draft.css';
import './text-editor.css';

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

const blockStyleFn = (block) => {
  const type = block.getType();
  if (type === 'ALIGN-LEFT') {
    return 'text-editor-align-left';
  }
  if (type === 'ALIGN-CENTER') {
    return 'text-editor-align-center';
  }
  if (type === 'ALIGN-RIGHT') {
    return 'text-editor-align-right';
  }
  if (type === 'ALIGN-JUSTIFY') {
    return 'text-editor-align-justify';
  }
  return null;
};

const customStyleMap = {
  STRIKETHROUGH: {
    textDecoration: 'line-through',
  },
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

  handleInlineStyle = (e, styleName) => {
    e.preventDefault();
    const { editorState } = this.state;
    this.handleChange(RichUtils.toggleInlineStyle(editorState, styleName));
    this.editor.focus();
  }

  handleBlockStyle = (e, styleName) => {
    e.preventDefault();
    const { editorState } = this.state;
    this.handleChange(RichUtils.toggleBlockType(editorState, styleName));
    this.editor.focus();
  }

  handleAlginStyle = (e, styleName) => {
    e.preventDefault();
    const { editorState } = this.state;
    this.handleChange(RichUtils.toggleBlockType(editorState, styleName));
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
          <button type="button" onMouseDown={(e) => this.handleInlineStyle(e, 'BOLD')}>
            <FontAwesomeIcon icon={faBold} />
          </button>
          <button type="button" onMouseDown={(e) => this.handleInlineStyle(e, 'ITALIC')}>
            <FontAwesomeIcon icon={faItalic} />
          </button>
          <button type="button" onMouseDown={(e) => this.handleInlineStyle(e, 'UNDERLINE')}>
            <FontAwesomeIcon icon={faUnderline} />
          </button>
          <button type="button" onMouseDown={(e) => this.handleInlineStyle(e, 'STRIKETHROUGH')}>
            <FontAwesomeIcon icon={faStrikethrough} />
          </button>
          <button type="button" onMouseDown={(e) => this.handleBlockStyle(e, 'ordered-list-item')}>
            <FontAwesomeIcon icon={faListOl} />
          </button>
          <button type="button" onMouseDown={(e) => this.handleBlockStyle(e, 'unordered-list-item')}>
            <FontAwesomeIcon icon={faListUl} />
          </button>
          <button type="button" onMouseDown={(e) => this.handleAlginStyle(e, 'ALIGN-LEFT')}>
            <FontAwesomeIcon icon={faAlignLeft} />
          </button>
          <button type="button" onMouseDown={(e) => this.handleAlginStyle(e, 'ALIGN-CENTER')}>
            <FontAwesomeIcon icon={faAlignCenter} />
          </button>
          <button type="button" onMouseDown={(e) => this.handleAlginStyle(e, 'ALIGN-RIGHT')}>
            <FontAwesomeIcon icon={faAlignRight} />
          </button>
          <button type="button" onMouseDown={(e) => this.handleAlginStyle(e, 'ALIGN-JUSTIFY')}>
            <FontAwesomeIcon icon={faAlignJustify} />
          </button>
        </div>
        <Editor
          ref={(content) => { this.editor = content; }}
          placeholder="Enter some text"
          blockStyleFn={blockStyleFn}
          customStyleMap={customStyleMap}
          editorState={editorState}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}

export default TextEditor;
