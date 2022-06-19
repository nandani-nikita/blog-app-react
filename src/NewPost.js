import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api/posts'
import DataContext from './context/DataContext';

const NewPost = () => {
  const [postCaption, setPostCaption] = useState('');
  const [postDescription, setPostDescription] = useState('');
  const {
    posts, setPosts
  } = useContext(DataContext);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const id = posts.length ? posts[posts.length - 1].id + 1 : 1;
    const uploaded_on = (new Date(Date.now())).toDateString();
    const newPost = { id: id, caption: postCaption, uploaded_on: uploaded_on, description: postDescription };
    try {
      const response = await api.post('/posts', newPost)
      const allPosts = [...posts, response.data];
      setPosts(allPosts);
      setPostCaption('');
      setPostDescription('');
      navigate('/');

    } catch (error) {
      console.log(`Error: ${error.message}`);

    }
  }
  return (
    <main className='NewPost'>
      <h2>New Post</h2>
      <form className='newPostForm' onSubmit={handleSubmit} >
        <label htmlFor='postCaption'>Caption:</label>
        <input
          id="postCaption"
          type="text"
          required
          value={postCaption}
          onChange={(e) => setPostCaption(e.target.value)} />

        <label htmlFor='postDescription'>Description:</label>
        <textarea
          id="postDescription"
          required
          value={postDescription}
          onChange={(e) => setPostDescription(e.target.value)} />
        <button type='submit'>Submit</button>
      </form>
    </main>
  )
}

export default NewPost;
