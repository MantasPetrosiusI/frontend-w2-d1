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

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Technology");
  const [coverFile, setCoverFile] = useState("");
  const [time, setTime] = useState(1);
  const [timeUnit, setTimeUnit] = useState("minute");
  const [authorName, setAuthorName] = useState("");
  const [authorSurname, setAuthorSurname] = useState("");
  const [authorAvatar, setAuthorAvatar] = useState("");

  const [blogPost, setBlogPost] = useState(null);

  const getAuthor = async () => {
    try {
      let response = await fetch(
        `${process.env.REACT_APP_BE_PROD_URL}/authors`
      );
      if (response.ok) {
        let authors = await response.json();
        let author = authors.find(
          (author) =>
            author.name.toLowerCase() === authorName.toLowerCase() &&
            author.surname.toLowerCase() === authorSurname.toLowerCase()
        );
        if (author) {
          console.log(author.avatar);
          setAuthorAvatar(author.avatar);
        } else {
          setAuthorAvatar(
            `https://ui-avatars.com/api/?name=${authorName}+${authorSurname}`
          );
        }
      } else {
        console.log("error");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCoverUpload = async (id) => {
    try {
      const formData = new FormData();
      formData.append("cover", coverFile);
      let response = await fetch(
        `${process.env.REACT_APP_BE_PROD_URL}/blogPosts/${id}/uploadCover/single`,
        {
          method: "POST",
          body: formData,
        }
      );
      if (response.ok) {
        console.log("Uploaded!");
      } else {
        console.log("Error!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (coverFile) {
      handleCoverUpload(blogPost.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blogPost]);

  useEffect(() => {
    if (authorAvatar) {
      sendPost();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authorAvatar]);

  const sendPost = async () => {
    try {
      let newPost = {
        category: category,
        title: title,
        cover: "https://picsum.photos/800/400",
        readTime: {
          value: time,
          unit: timeUnit,
        },
        author: {
          name: `${authorName.toUpperCase()} ${authorSurname.toUpperCase()}`,
          avatar: authorAvatar,
        },
        content: html,
      };
      let response = await fetch(
        `${process.env.REACT_APP_BE_PROD_URL}/blogPosts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newPost),
        }
      );
      if (response.ok) {
        let post = await response.json();
        setBlogPost(post);
        console.log(authorAvatar);
      } else {
        console.log("Error!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container className="new-blog-container">
      <Form
        className="mt-5"
        onSubmit={async (e) => {
          e.preventDefault();
          getAuthor();
        }}
      >
        <Form.Group controlId="blog-form" className="mt-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            size="lg"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="blog-category" className="mt-3">
          <Form.Label>Category</Form.Label>
          <Form.Control
            size="lg"
            as="select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option>Technology</option>
            <option>History</option>
            <option>Drama</option>
            <option>Mistery</option>
            <option>News</option>
          </Form.Control>
        </Form.Group>
        <Form.Group className="mt-3">
          <Form.Label>Cover Image</Form.Label>
          <Form.Control
            type="file"
            onChange={(e) => {
              const files = e.target.files;
              if (files && files.length > 0) {
                setCoverFile(files[0]);
              } else {
                setCoverFile(null);
              }
            }}
          />
        </Form.Group>
        <Form.Group className="mt-3">
          <Form.Label>Time to read</Form.Label>
          <Form.Control
            type="number"
            value={time}
            onChange={(e) => {
              setTime(e.target.value);
            }}
          />
        </Form.Group>
        <Form.Group className="mt-3">
          <Form.Label>Time unit</Form.Label>
          <Form.Control
            size="lg"
            as="select"
            value={timeUnit}
            onChange={(e) => setTimeUnit(e.target.value)}
          >
            <option>minute</option>
            <option>hour</option>
            <option>day</option>
          </Form.Control>
        </Form.Group>
        <Form.Group className="mt-3">
          <Form.Label>Author Name</Form.Label>
          <Form.Control
            type="text"
            value={authorName}
            onChange={(e) => {
              setAuthorName(e.target.value);
            }}
          />
        </Form.Group>
        <Form.Group className="mt-3">
          <Form.Label>Author Surname</Form.Label>
          <Form.Control
            type="text"
            value={authorSurname}
            onChange={(e) => {
              setAuthorSurname(e.target.value);
            }}
          />
        </Form.Group>
        <Form.Group controlId="blog-content" className="mt-3">
          <Form.Label>Blog Content</Form.Label>
          <Editor
            editorState={editorState}
            toolbarClassName="toolbarClassName"
            wrapperClassName="wrapperClassName"
            editorClassName="editorClassName"
            onEditorStateChange={setEditorState}
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
