import * as uuid from 'uuid';
import AppEvent from '../../event';
import NoteState from './NoteState';

const notesModel = {
  notes: [],
};
window.notesModel = notesModel;

export const noteGet = () => notesModel.notes;

export const noteAdd = (html, text) => {
  const note = {
    id: uuid.v4(),
    html,
    text,
    state: NoteState.EDIT,
  };
  notesModel.notes.push(note);
  new AppEvent('note.add', note).dispatch();
};

const findNoteIndex = (uid) => {
  for (let i = 0; i < notesModel.notes.length; i += 1) {
    if (notesModel.notes[i].id === uid) {
      return i;
    }
  }
  return -1;
};

export const noteRemove = (uid) => {
  const index = findNoteIndex(uid);
  if (index > -1) {
    const data = notesModel.notes.splice(index, 1);
    new AppEvent('note.remove', data).dispatch();
    return true;
  }
  return false;
};

export const noteUpdate = (uid, note) => {
  const index = findNoteIndex(uid);
  if (index > -1) {
    const toSave = { ...note };
    toSave.id = uuid.v4();
    notesModel.notes[index] = toSave;
    new AppEvent('note.update', note).dispatch();
    return true;
  }
  return false;
};
