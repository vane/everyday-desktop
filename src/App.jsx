import React from 'react';
import ReactDOM from 'react-dom';
import dateformat from 'dateformat'; // https://www.npmjs.com/package/dateformat
import SpeechToText from './api/speechToText';
import NotesList from './view/notes/NotesList';
import NotesAddButton from './view/notes/NotesAddButton';

const Main = () => {
  const title = dateformat(Date.now(), 'dd mmmm yyyy'); //  hh:MM:ss Z
  const handleSayTest = () => {
    SpeechToText.getInstance().read('pl', 'Ala ma kota!');
  };
  return (
    <div>
      <h1>{title}</h1>
      <NotesAddButton />
      <button type="button" onClick={handleSayTest}>Say Test</button>
      <NotesList />
    </div>
  );
};

ReactDOM.render(<Main />, document.getElementById('main'));
