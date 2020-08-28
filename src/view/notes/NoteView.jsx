import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { noteUpdate } from './NotesModel';
import NoteState from './NoteState';

class NoteView extends React.Component {
  constructor(props) {
    super(props);
    const note = { ...props.note };
    this.state = {
      uid: props.note.id,
      note,
    };
  }

  handleEditClick = () => {
    const { uid, note } = this.state;
    note.state = NoteState.EDIT;
    noteUpdate(uid, note);
  }

  render() {
    const { uid, note } = this.state;
    return (
      <div key={uid}>
        <span>view</span>
        <span>{uid}</span>
        <span>{note.text}</span>
        <button type="button" onClick={this.handleEditClick}>
          <FontAwesomeIcon icon={faEdit} />
        </button>
      </div>
    );
  }
}

export default NoteView;
