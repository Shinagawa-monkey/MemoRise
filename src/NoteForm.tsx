import { FormEvent, useRef, useState } from "react";
import { Button, Col, Form, Row, Stack } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import CreatableReactSelect from "react-select/creatable";
import { NoteData, Tag } from "./App";
import { v4 as uuidV4 } from "uuid";

type NoteFormProps = {
  // using void - the function is used for handling form submission rather than producing a result that needs to be processed further; because I use NoteData in EditNote but not in NewNote so I use Partial to make it optional to pass this data in
  onSubmit: (data: NoteData) => void;
  onAddTag: (tag: Tag) => void;
  availableTags: Tag[];
} & Partial<NoteData>;

export function NoteForm({
  onSubmit,
  onAddTag,
  availableTags,
  title = "",
  markdown = "",
  tags = [],
}: NoteFormProps) {
  // Refs - a direct access to the DOM for reading values without triggering re-renders
  const titleRef = useRef<HTMLInputElement>(null);
  const markdownRef = useRef<HTMLTextAreaElement>(null);
  const [selectedTags, setSelectedTags] = useState<Tag[]>(tags);
  const navigate = useNavigate();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    onSubmit({
      // ! says that values never will be null beacuse in the form they are required
      title: titleRef.current!.value,
      markdown: markdownRef.current!.value,
      tags: selectedTags,
    });
    // navigate to previous page
    navigate("..");
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Stack gap={4}>
        <Row>
          <Col>
            <Form.Group controlId='title'>
              <Form.Label>Title</Form.Label>
              <Form.Control
                ref={titleRef}
                required
                defaultValue={title}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId='tags'>
              <Form.Label>Tags</Form.Label>
              {/* Allows create multiple tags for select input, it has to have: id and label; onCreateOption property of CreatableReactSelect to auto set label's value because it doesn't auto save it because it doesn't auto call onChange when I create a new tag - it calls onCreateOption fn  */}
              <CreatableReactSelect
                onCreateOption={(label) => {
                  const newTag = { id: uuidV4(), label };
                  // I need onAddTag because I save tags in local storage TAGS array
                  onAddTag(newTag);
                  // saves all the prev and new tags
                  setSelectedTags((prev) => [...prev, newTag]);
                }}
                // Converting from CreatableReactSelect to format of Tag type in App component - id and label
                value={selectedTags.map((tag) => {
                  return { label: tag.label, value: tag.id };
                })}
                // To have access of all availableTags for options
                options={availableTags.map((tag) => {
                  return { label: tag.label, value: tag.id };
                })}
                onChange={(tags) => {
                  setSelectedTags(
                    tags.map((tag) => {
                      return { label: tag.label, id: tag.value };
                    })
                  );
                }}
                isMulti
              />
            </Form.Group>
          </Col>
        </Row>
        <Form.Group controlId='markdown'>
          <Form.Label>Body</Form.Label>
          <Form.Control
            defaultValue={markdown}
            required
            as='textarea'
            ref={markdownRef}
            rows={15}
          />
        </Form.Group>
        {/* Buttons are on the far right side of the page because of justify-content-end */}
        <Stack
          direction='horizontal'
          gap={2}
          className='justify-content-end'>
          <Button
            type='submit'
            variant='primary'>
            Save
          </Button>
          {/* Redirects to 1 page back - to home page */}
          <Link to='..'>
            <Button
              type='button'
              variant='outline-secondary'>
              Cancel
            </Button>
          </Link>
        </Stack>
      </Stack>
    </Form>
  );
}
