import React from 'react';
import reactCSS from 'reactcss';
import { Editor, EditorState, RichUtils } from 'draft-js';
import createStyles from 'draft-js-custom-styles';
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
import ColorPicker from './ColorPicker';
import AppEvent from '../../event';

const cssstyles = reactCSS({
  default: {
    textEditorContainer: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      padding: '20px',
    },
    textEditorToolbar: {
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
    },
  },
});

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

const { styles, customStyleFn } = createStyles(['font-size', 'color'], 'CUSTOM_', customStyleMap);

class TextEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      color: '#ffffff',
      newColor: null,
      fontSize: '12px',
      newFontSize: null,
      editorState: EditorState.createEmpty(),
    };
  }

  componentDidMount() {
    this.editor.focus();
    const { uid } = this.props;
    AppEvent.listen(`text.editor.color.change.${uid}`, this.handleTextColorChange);
  }

  componentWillUnmount() {
    const { uid } = this.props;
    AppEvent.listen(`text.editor.color.change.${uid}`, this.handleTextColorChange);
  }

  handleTextColorChange = ({ data }) => {
    this.setState({ newColor: data });
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

  handleFontSizeChange = (e) => {
    this.setState({ newFontSize: e.target.value, fontSize: e.target.value });
  }

  handleChange = (editorState) => {
    const {
      color,
      newColor,
      newFontSize,
      fontSize,
    } = this.state;
    let setColor = color;
    let newEditorState = editorState;
    if (newColor !== null) {
      newEditorState = styles.color.toggle(newEditorState, newColor);
      setColor = newColor;
    }
    let setFontSize = fontSize;
    if (newFontSize !== null) {
      newEditorState = styles.fontSize.toggle(newEditorState, newFontSize);
      setFontSize = newFontSize;
    }
    this.setState({
      editorState: newEditorState,
      newColor: null,
      color: setColor,
      newFontSize: null,
      fontSize: setFontSize,
    });
  }

  render() {
    const { editorState, fontSize } = this.state;
    const { uid } = this.props;
    return (
      <div style={cssstyles.textEditorContainer}>
        <div style={cssstyles.textEditorToolbar}>
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
          <input type="text" onChange={this.handleFontSizeChange} value={fontSize} />
          <ColorPicker uid={uid} />
        </div>
        <Editor
          ref={(content) => { this.editor = content; }}
          placeholder="Enter some text"
          customStyleFn={customStyleFn}
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
