import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { noteUpdate } from './NotesModel';
import NoteState from './NoteState';
import TextEditor from '../editor/TextEditor';
import AppEvent from '../../event';

class NoteEditView extends React.Component {
  constructor(props) {
    super(props);
    const note = { ...props.note };
    this.state = {
      uid: props.note.id,
      note,
    };
  }

  componentDidMount() {
    const { uid } = this.state;
    AppEvent.listen(`texteditor.update.${uid}`, this.handleTextUpdate);
  }

  componentWillUnmount() {
    const { uid } = this.state;
    AppEvent.remove(`texteditor.update.${uid}`, this.handleTextUpdate);
  }

  handleTextUpdate = (e) => {
    const { note } = this.state;
    note.text = e.data.text;
    note.html = e.data.html;
  }

  handleNoteSave = () => {
    const { uid, note } = this.state;
    note.state = NoteState.VIEW;
    noteUpdate(uid, note);
  }

  render() {
    const { uid, note } = this.state;
    return (
      <div>
        <div>
          <span>edit</span>
          <span>{uid}</span>
          <button type="button" onClick={this.handleNoteSave}>
            <FontAwesomeIcon icon={faSave} />
          </button>
        </div>
        <TextEditor html={note.html} uid={uid} />
      </div>
    );
  }
}

export default NoteEditView;
