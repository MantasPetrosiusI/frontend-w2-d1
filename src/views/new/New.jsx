import { convertToHTML } from "draft-convert";
import { EditorState } from "draft-js";
import React, { useEffect, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./styles.css";
const NewBlogPost = (props) => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [html, setHTML] = useState(null);
  useEffect(() => {
    let html = convertToHTML(editorState.getCurrentContent());
    setHTML(html);
  }, [editorState]);

  const url = process.env.REACT_APP_BE_PROD_URL;
  const [title, setTitle] = useState(null);
  const [category, setCategory] = useState(null);
  const [authorName, setAuthorName] = useState(null);

  const publishNewBlogPost = async () => {
    try {
      const newBlogPost = {
        title: title,
        category: category,
        content: html,
        cover: "",
        readTime: {
          value: 3,
          unit: "minutes",
        },
        author: {
          name: authorName,
          id: "123456",
        },
      };

      const res = await fetch(url + "/blogPosts", {
        method: "POST",
        body: JSON.stringify(newBlogPost),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        setHTML("");
        setTitle("");
        setCategory("Science");
      } else {
        console.log("Error!");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    publishNewBlogPost();
  };

  return (
    <Container className="new-blog-container">
      <Form className="mt-5" onSubmit={handleSubmit}>
        <Form.Group
          controlId="blog-form"
          className="mt-3"
          value={authorName}
          onChange={(e) => {
            setAuthorName(e.target.value);
          }}
        >
          <Form.Label>Author</Form.Label>
          <Form.Control size="lg" placeholder="Author" />
        </Form.Group>
        <Form.Group
          controlId="blog-form"
          className="mt-3"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        >
          <Form.Label>Title</Form.Label>
          <Form.Control size="lg" placeholder="Title" />
        </Form.Group>
        <Form.Group
          controlId="blog-category"
          className="mt-3"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
          }}
        >
          <Form.Label>Category</Form.Label>
          <Form.Control size="lg" as="select">
            <option>Science</option>
            <option>Technology</option>
            <option>Health</option>
            <option>Daily Life</option>
            <option>Space</option>
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="blog-content" className="mt-3">
          <Form.Label>Blog Content</Form.Label>
          <Editor
            editorState={editorState}
            toolbarClassName="toolbarClassName"
            wrapperClassName="wrapperClassName"
            editorClassName="editorClassName"
            onEditorStateChange={setEditorState}
            value={html}
          />
        </Form.Group>
        <Form.Group className="d-flex mt-3 justify-content-end">
          <Button type="reset" size="lg" variant="outline-dark">
            Reset
          </Button>
          <Button
            type="submit"
            size="lg"
            variant="dark"
            style={{
              marginLeft: "1em",
            }}
          >
            Submit
          </Button>
        </Form.Group>
      </Form>
    </Container>
  );
};

export default NewBlogPost;
