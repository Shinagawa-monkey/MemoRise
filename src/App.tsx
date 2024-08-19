import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import { Navigate, Route, Routes } from "react-router-dom";
// import './App.css'
import { NewNote } from "./NewNote";
import { NoteList } from "./NoteList";
import { NoteLayout } from "./NoteLayout";
import { useLocalStorage } from "./useLocalStorage";
import { useMemo } from "react";
import { v4 as uuidV4 } from "uuid";
import { Note } from "./Note";
import { EditNote } from "./EditNote";

export type Note = {
  id: string;
} & NoteData;

// types for NoteForm component cuz we need only id if we want to change anything = Notedata has Tags which has Tag type with tag id
export type RawNote = {
  id: string;
} & RawNoteData;

// for local stored note data because if tag with id is changed from Tag types - only tag will be saved, no need to change everything in the NoteData
export type RawNoteData = {
  title: string;
  markdown: string;
  tagIds: string[];
};

// types for NoteForm component
export type NoteData = {
  title: string;
  markdown: string;
  tags: Tag[];
};

// types for NoteForm component
export type Tag = {
  id: string;
  label: string;
};

function App() {
  // save notes and tags to local storage; capitalized to not conflict with other elements on local host
  const [notes, setNotes] = useLocalStorage<RawNote[]>("NOTES", []);
  const [tags, setTags] = useLocalStorage<Tag[]>("TAGS", []);

  // convert RawNote into Note; useMemo memoizes the result of mapping notes to notesWithTags
  const notesWithTags = useMemo(() => {
    // saves motes and tags associated with it; only run it when notes/tags updated
    return notes.map((note) => {
      return {
        ...note,
        tags: tags.filter((tag) => note.tagIds.includes(tag.id)),
      };
    });
  }, [notes, tags]);

  // convert NoteData to RawNote
  function onCreateNote({ tags, ...data }: NoteData) {
    setNotes((prevNotes) => {
      return [
        ...prevNotes,
        // here we extrat id from tags: tagIds: tags.map((tag) => tag.id); created note will be saved into NOTES array in local storage
        { ...data, id: uuidV4(), tagIds: tags.map((tag) => tag.id) },
      ];
    });
  }

  // fn to edit note: update existing note data with new data, tags are the same
  function onUpdateNote(id: string, { tags, ...data }: NoteData) {
    setNotes((prevNotes) => {
      return prevNotes.map((note) => {
        if (note.id === id) {
          return { ...note, ...data, tagIds: tags.map((tag) => tag.id) };
        } else {
          return note;
        }
      });
    });
  }

  // Deleting note - I will show all notes except deleted ones
  function onDeleteNote(id: string) {
    setNotes((prevNotes) => {
      return prevNotes.filter((note) => note.id !== id);
    });
  }

  // fn to save added tags to local storage TAGS array
  function addTag(tag: Tag) {
    setTags((prev) => [...prev, tag]);
  }

  // fn used to update tag in EditTagsModal in NoteList component
  function updateTag(id: string, label: string) {
    setTags((prevTags) => {
      return prevTags.map((tag) => {
        if (tag.id === id) {
          return { ...tag, label };
        } else {
          return tag;
        }
      });
    });
  }

  // fn used to delete tag in EditTagsModal in NoteList component
  function deleteTag(id: string) {
    setTags((prevTags) => {
      return prevTags.filter((tag) => tag.id !== id);
    });
  }

  return (
    <Container className='my-4'>
      <Routes>
        <Route
          path='/'
          element={
            <NoteList
              notes={notesWithTags}
              availableTags={tags}
              onUpdateTag={updateTag}
              onDeleteTag={deleteTag}
            />
          }
        />
        <Route
          path='/new'
          element={
            <NewNote
              onSubmit={onCreateNote}
              onAddTag={addTag}
              availableTags={tags}
            />
          }
        />
        {/* Show note I clicked on so I can show / edit / delete note */}
        <Route
          path='/:id'
          element={<NoteLayout notes={notesWithTags} />}>
          <Route
            index
            element={<Note onDelete={onDeleteNote} />}
          />
          <Route
            path='edit'
            element={
              <EditNote
                onSubmit={onUpdateNote}
                onAddTag={addTag}
                availableTags={tags}
              />
            }
          />
        </Route>
        <Route
          path='*'
          element={<Navigate to='/' />}
        />
      </Routes>
    </Container>
  );
}

export default App;
