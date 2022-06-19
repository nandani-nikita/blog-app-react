import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from './api/posts';
import DataContext from './context/DataContext';

const EditPost = () => {
    const { posts, setPosts } = useContext(DataContext);
    const [editCaption, setEditCaption] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const { id } = useParams();
    const post = posts.find(post => (post.id).toString() === id);
    const navigate = useNavigate();

    useEffect(() => {
        if (post) {
            setEditCaption(post.caption);
            setEditDescription(post.description);
        }
    }, [post, setEditCaption, setEditDescription])

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

    return (
        <main className='NewPost'>
            {editCaption &&
                <>
                    <h2>Edit Post</h2>
                    <form className='newPostForm' onSubmit={(e) => e.preventDefault()} >
                        <label htmlFor='editCaption'>Caption:</label>
                        <input
                            id="editCaption"
                            type="text"
                            required
                            value={editCaption}
                            onChange={(e) => setEditCaption(e.target.value)} />

                        <label htmlFor='editDescription'>Description:</label>
                        <textarea
                            id="editDescription"
                            required
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)} />
                        <button type='submit' onClick={() => handleEdit(post.id)}>Submit</button>
                    </form>
                </>
            }
            {!editCaption &&
                <>
                    <h2>Post Not Found</h2>
                    <p>Well, that's disappointing.</p>
                </>
            }
        </main>
    )
}

export default EditPost;
