import React, { useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import DataContext from './context/DataContext';

const EditPost = () => {
    const { posts, handleEdit, editCaption, setEditCaption, editDescription, setEditDescription } = useContext(DataContext);
    const { id } = useParams();
    const post = posts.find(post => (post.id).toString() === id);

    useEffect(() => {
        if (post) {
            setEditCaption(post.caption);
            setEditDescription(post.description);
        }
    }, [post, setEditCaption, setEditDescription])

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
