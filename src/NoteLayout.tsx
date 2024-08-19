import {
  Navigate,
  Outlet,
  // useOutletContext,
  useParams,
} from "react-router-dom";
import { Note } from "./App";

type NoteLayoutProps = {
  notes: Note[];
};

export function NoteLayout({ notes }: NoteLayoutProps) {
  // Getting note id from its URL
  const { id } = useParams();
  const note = notes.find((n) => n.id === id);

  // If there are no note found - navigate to Home (non-existing URL will be replaced with "/")
  if (note == null)
    return (
      <Navigate
        to='/'
        replace
      />
    );
  //Outlet from react-router-dom will show all routes form the inside the route "/:id" from App component
  return <Outlet context={note} />;
}

// moved function to useNote hook because fast refresh works correctly by enforcing that only React components are exported from a file

// useOutletContext is a fn used inside of Outlet (any route inside the route "/:id" from App component) which gives all the info from the Outlet's context
// export function useNote() {
//   return useOutletContext<Note>();
// }
