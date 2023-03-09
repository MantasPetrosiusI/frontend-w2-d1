import { format, parseISO } from "date-fns";
import React, { useEffect, useState } from "react";
import {
  Button,
  Container,
  Form,
  Image,
  ListGroup,
  Modal,
} from "react-bootstrap";
import { Download } from "react-bootstrap-icons";
import { useParams } from "react-router-dom";
import BlogAuthor from "../../components/blog/blog-author/BlogAuthor";
import BlogLike from "../../components/likes/BlogLike";
import "./styles.css";

const Blog = (props) => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState("");
  const [comments, setComments] = useState([]);
  const [commentToPost, setCommentToPost] = useState("");
  const [author, setAuthor] = useState("");
  const params = useParams();

  const [commentToEdit, setCommentToEdit] = useState(null);

  const [show, setShow] = useState(false);

  const handleClose = async (id) => {
    try {
      let response = await fetch(
        `${process.env.REACT_APP_BE_PROD_URL}/blogPosts/${blog.id}/comments/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ comment: commentToEdit.comment }),
        }
      );
      if (response.ok) {
        console.log(response);
      } else {
        console.log("Error!");
      }
    } catch (error) {
      console.log(error);
    }
    setShow(false);
  };

  const handleShow = async (id) => {
    try {
      let response = await fetch(
        `${process.env.REACT_APP_BE_PROD_URL}/blogPosts/${blog.id}/comments`
      );
      if (response.ok) {
        let comments = await response.json();
        let commentsArray = comments.comments;
        setCommentToEdit(commentsArray.find((comment) => comment._id === id));
      } else {
        console.log("Error");
      }
    } catch (error) {
      console.log(error);
    }
    setShow(true);
  };

  const handleImageUpload = async (id) => {
    try {
      const formData = new FormData();
      formData.append("cover", file);
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
        console.log("Try again!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getBlog = async (id) => {
    try {
      let response = await fetch(
        `${process.env.REACT_APP_BE_PROD_URL}/blogPosts/${id}`
      );
      if (response.ok) {
        let actualPost = await response.json();
        setBlog(actualPost);
      } else {
        console.log("Error!!!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getBlogComments = async (id) => {
    try {
      let response = await fetch(
        `${process.env.REACT_APP_BE_PROD_URL}/blogPosts/${id}/comments`
      );
      if (response.ok) {
        let allComments = await response.json();
        setComments(allComments.comments);
      } else {
        console.log("error");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (id) => {
    try {
      let response = await fetch(
        `${process.env.REACT_APP_BE_PROD_URL}/blogPosts/${id}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: commentToPost,
            author: author,
          }),
        }
      );
      if (response.ok) {
        console.log("OK");
      } else {
        console.log("error");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (postId, commentId) => {
    try {
      await fetch(
        `${process.env.REACT_APP_BE_PROD_URL}/blogPosts/${postId}/comments/${commentId}`,
        {
          method: "DELETE",
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const { id } = params;
    getBlog(id);
    getBlogComments(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (blog) {
      setLoading(false);
    }
  }, [blog]);

  if (loading) {
    return <div>loading</div>;
  } else {
    return (
      <>
        {blog && (
          <div className="blog-details-root">
            <Container>
              <Image className="blog-details-cover" src={blog.cover} fluid />

              <Form.Group className="d-flex justify-content-center">
                <Form.Control
                  type="file"
                  style={{ maxWidth: "85%" }}
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files && files.length > 0) {
                      setFile(files[0]);
                    } else {
                      setFile(null);
                    }
                  }}
                />
                <Button
                  variant="primary"
                  style={{ marginLeft: "5px" }}
                  onClick={(e) => {
                    e.preventDefault();
                    if (file) {
                      handleImageUpload(blog.id);
                    }
                  }}
                >
                  Update
                </Button>
                <a
                  onClick={(e) => e.stopPropagation()}
                  href={`${process.env.REACT_APP_BE_PROD_URL}/${blog.id}/pdf`}
                  className="btn btn-primary"
                  style={{ marginLeft: "5px" }}
                >
                  <Download /> PDF
                </a>
              </Form.Group>

              <h1 className="blog-details-title">{blog.title}</h1>

              <div className="blog-details-container">
                <div className="blog-details-author">
                  <BlogAuthor {...blog.author} />
                </div>
                <div className="blog-details-info">
                  <div>
                    {format(parseISO(blog.createdAt.toString()), "dd MMM yyyy")}
                  </div>
                  <div>{`${blog.readTime.value} ${blog.readTime.unit} read`}</div>
                  <div
                    style={{
                      marginTop: 20,
                    }}
                  >
                    <BlogLike defaultLikes={["123"]} />
                  </div>
                </div>
              </div>

              <div
                dangerouslySetInnerHTML={{
                  __html: blog.content,
                }}
              ></div>
              {comments && (
                <ListGroup>
                  {comments.map((c) => {
                    return (
                      <ListGroup.Item key={c._id}>
                        <div className="d-flex">
                          <div
                            className="d-flex flex-column"
                            style={{ marginRight: "auto" }}
                          >
                            <div>{c.comment}</div>
                            <div style={{ fontSize: "14px" }}>- {c.author}</div>
                          </div>
                          <div className="d-flex">
                            <Button
                              className="mt-2"
                              style={{ marginRight: "5px" }}
                              variant="outline-primary"
                              onClick={() => {
                                handleShow(c._id);
                              }}
                            >
                              Edit
                            </Button>
                            <Button
                              className="mt-2"
                              variant="danger"
                              onClick={(e) => {
                                e.preventDefault();
                                handleDelete(blog.id, c._id);
                              }}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </ListGroup.Item>
                    );
                  })}
                </ListGroup>
              )}
              <Form.Group controlId="blog-form" className="mt-3">
                <Form.Control
                  className="mt-2"
                  size="lg"
                  placeholder="Add a comment"
                  value={commentToPost}
                  onChange={(e) => setCommentToPost(e.target.value)}
                />
                <Form.Control
                  className="mt-2"
                  size="lg"
                  placeholder="Your name"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                />
                <Button
                  className="mt-2"
                  variant="primary"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSubmit(blog.id);
                  }}
                >
                  Submit
                </Button>
              </Form.Group>
            </Container>
          </div>
        )}
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Control
              as="textarea"
              rows={5}
              value={commentToEdit ? commentToEdit.comment : ""}
              onChange={(e) => {
                setCommentToEdit({
                  ...commentToEdit,
                  comment: e.target.value,
                });
              }}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="primary"
              onClick={() => {
                handleClose(commentToEdit._id);
              }}
            >
              Submit
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
};

export default Blog;
