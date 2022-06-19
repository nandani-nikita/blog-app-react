import Header from './Header';
import Nav from './Nav';
import Footer from './Footer';
import Home from './Home';
import NewPost from './NewPost';
import PostPage from './PostPage';
import EditPost from './EditPost';
import About from './About';
import Missing from './Missing';
import { Route, Routes } from 'react-router-dom';
import { DataProvider } from './context/DataContext';

function App() {

  return (
    <div className='App'>
      <DataProvider>

        <Header title={'Art Blog'} />
        <Nav />

        <Routes >
          <Route exact path='/' element={<Home />} />

          <Route path='post' element={<NewPost />} />

          <Route path='edit/:id' element={<EditPost />} />

          <Route path='post/:id' element={<PostPage />} />

          <Route path='about' element={<About />} />

          <Route path='*' element={<Missing />} />

        </Routes>

        <Footer />
      </DataProvider>
    </div>
  );
}

export default App;
