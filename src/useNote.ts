import { useOutletContext } from "react-router-dom";
import { Note } from "./App";

// useOutletContext is a function used inside of Outlet (any route inside the route "/:id" from App component) which gives all the info from the Outlet's context
export function useNote(): Note {
  return useOutletContext<Note>();
}
