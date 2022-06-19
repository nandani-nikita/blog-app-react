import Header from './Header';
import Nav from './Nav';
import Footer from './Footer';
import Home from './Home';
import NewPost from './NewPost';
import PostPage from './PostPage';
import EditPost from './EditPost';
import About from './About';
import Missing from './Missing';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from './api/posts';
import useWindowSize from './hooks/useWindowSize';
import useAxiosFetch from './hooks/useAxiosFetch';

function App() {


  const [posts, setPosts] = useState([]);

  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [postCaption, setPostCaption] = useState('');
  const [postDescription, setPostDescription] = useState('');
  const [editCaption, setEditCaption] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const navigate = useNavigate();
  const { width } = useWindowSize();

  // // was used before we implemented custom hook useAxiosFetch
  // useEffect(() => {
  //   const fetchPosts = async () => {
  //     try {
  //       const response = await api.get('/posts');
  //       console.log(response);
  //       setPosts(response.data);
  //     } catch (error) {
  //       if (error.response) {

  //         // Not in 200 response range
  //         console.log(error.response.data);
  //         console.log(error.response.error);
  //         console.log(error.response.status);
  //         console.log(error.response.headers);
  //       } else {
  //         console.log(`Error: ${error.message}`);
  //       }
  //     }
  //   }
  //   fetchPosts();
  // }, [])


  // // After implementing custom useEffectAxios -> 
  const { data, fetchError, isLoading } = useAxiosFetch('http://localhost:3500/posts');

  useEffect(() => {
    setPosts(data);
  }, [data])
  // // // // // // // // // // //

  useEffect(() => {
    const filteredResults = posts.filter(post =>
      ((post.description).toLowerCase()).includes(search.toLowerCase())
      ||
      ((post.caption).toLowerCase()).includes(search.toLowerCase())
    );
    setSearchResults(filteredResults);
  }, [posts, search])

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
  const handleEdit = async (id) => {
    const uploaded_on = (new Date(Date.now())).toDateString();
    const updatedPost = { id: id, caption: editCaption, uploaded_on: uploaded_on, description: editDescription };
    try {
      const response = await api.put(`/posts/${id}`, updatedPost);

      setPosts(posts.map(post => {
        console.log(post.id, id);
        if (post.id === id) {
          console.log('=====================');
          console.log(post);
          console.log({ ...response.data });
        } else {
          console.log(post);
        }
        return (post.id === id ? { ...response.data } : post)
      }));
      setEditCaption('');
      setEditDescription('');
      navigate('/');

    } catch (error) {
      console.log(`Error: ${error.message}`);

    }
  }
  const handleDelete = async (id) => {
    try {
      await api.delete(`/posts/${id}`);
      const postsList = posts.filter(post => post.id !== id);
      setPosts(postsList);
      navigate('/');

    } catch (error) {
      console.log(error.message);
    }

  }
  return (
    <div className='App'>

      <Header title={'Art Blog'} width={width} />
      <Nav
        search={search}
        setSearch={setSearch}
      />

      <Routes >
        <Route exact path='/' element={<Home
          posts={searchResults}
          fetchError={fetchError}
          isLoading={isLoading}
        />} />

        <Route path='post' element={<NewPost handleSubmit={handleSubmit} postCaption={postCaption} setPostCaption={setPostCaption} postDescription={postDescription} setPostDescription={setPostDescription} />} />

        <Route path='edit/:id' element={<EditPost posts={posts} handleEdit={handleEdit} editCaption={editCaption} setEditCaption={setEditCaption} editDescription={editDescription} setEditDescription={setEditDescription} />} />

        <Route path='post/:id' element={<PostPage posts={posts} handleDelete={handleDelete} />} />

        <Route path='about' element={<About />} />

        <Route path='*' element={<Missing />} />

      </Routes>

      <Footer />
    </div>
  );
}

export default App;
