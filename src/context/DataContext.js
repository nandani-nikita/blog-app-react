import { createContext, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import api from '../api/posts';
import useWindowSize from '../hooks/useWindowSize';
import useAxiosFetch from '../hooks/useAxiosFetch';

const DataContext = createContext({});

export const DataProvider = ({ children }) => {
    const [posts, setPosts] = useState([]);

    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [postCaption, setPostCaption] = useState('');
    const [postDescription, setPostDescription] = useState('');
    const [editCaption, setEditCaption] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const navigate = useNavigate();
    const { width } = useWindowSize();

    const { data, fetchError, isLoading } = useAxiosFetch('http://localhost:3500/posts');

    useEffect(() => {
        setPosts(data);
    }, [data])


    useEffect(() => {
        const filteredResults = posts.filter(post =>
            ((post.description).toLowerCase()).includes(search.toLowerCase())
            ||
            ((post.caption).toLowerCase()).includes(search.toLowerCase())
        );
        setSearchResults(filteredResults);
    }, [posts, search]);

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
        <DataContext.Provider value={{
            width, search, setSearch, searchResults, fetchError, isLoading,
            handleSubmit, postCaption, setPostCaption, postDescription, setPostDescription, posts, handleEdit, editCaption, setEditCaption, editDescription, setEditDescription, handleDelete
        }}>
            {children}
        </DataContext.Provider>
    )
}

export default DataContext;