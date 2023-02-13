import React from 'react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';
import { selectIsAuth } from '../../redux/slices/auth';
import { useSelector } from 'react-redux';
import { Link, useNavigate, Navigate, useParams } from 'react-router-dom';

import 'easymde/dist/easymde.min.css';
import axios from '../../axios';
import styles from './AddPost.module.scss';

export const AddPost = () => {

  const {id} = useParams();
  const isAuth = useSelector(selectIsAuth);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);
  const [text, setText] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [tags, setTags] = React.useState('');
  const [imageURL, setImageURL] = React.useState('');
  
  const isEditing = Boolean(id);

  React.useEffect(() => {
    if(isEditing) {
      axios.get(`/post/${id}`).then(({ data }) => {
        setTitle(data.title);
        setText(data.text);
        setImageURL(data.imageURL);
        setTags(data.tags.join(',')).catch((err) => {
          console.warn(err);
          alert("Error getting a post");
        });
      })
    }
  }, [])

  const inputFileRef = React.useRef(null);

  const handleChangeFile = async (event) => {
    try {
      console.log(1);
      const formData = new FormData();
      const file = event.target.files[0];
      formData.append('image', file);
      const { data } = await axios.post('upload', formData);
      setImageURL(data.url);
    } catch (err) {
      console.log(err);
      alert('Error loading file');
    }
  };

  const onClickRemoveImage = () => {
    if(window.confirm('Are you sure you want to remove the picture?')) {
      setImageURL('');
    }
  };
  
  const onChange = React.useCallback((value) => {
    setText(value);
  }, []);

  const onSubmit = async () => {
    try {
      setIsLoading(true);

      const fields = {
        title,
        imageURL,
        tags: tags.split(','),
        text,
      }

      const { data } = isEditing 
        ? await axios.patch(`/post/${id}`, fields)
        : await axios.post('/post', fields);

      const _id = isEditing ? id : data._id;

      navigate(`/post/${_id}`);
    } catch (err) {
      console.warn(err);
      alert('Error creating a post');
    }
  }
  
  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: '400px',
      autofocus: true,
      placeholder: 'Enter text...',
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    [],
    );
    
    if(!window.localStorage.getItem('token') && !isAuth) {
      return (<Navigate to='/' />);
    }

    return (
    <Paper style={{ padding: 30 }}>
      <Button onClick={() => inputFileRef.current.click()} variant="outlined" size="large">
        Load picture
      </Button>
      <input 
        ref={inputFileRef} 
        type="file" 
        onChange={handleChangeFile} 
        hidden />
      {imageURL && (
        <>
        <Button variant="contained" color="error" onClick={onClickRemoveImage}>
          Delete
        </Button>
        <img className={styles.image} src={`http://localhost:4444${imageURL}`} alt="Uploaded" />
        </>
      )}
      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Post`s title..."
        value={title}
        onChange={e => setTitle(e.target.value)}
        fullWidth
      />
      <TextField 
        value={tags}
        onChange={e => setTags(e.target.value)}
        classes={{ root: styles.tags }} 
        variant="standard" 
        placeholder="Tags" 
        fullWidth />
      <SimpleMDE className={styles.editor} value={text} onChange={onChange} options={options} />
      <div className={styles.buttons}>
        <Button  onClick={onSubmit} size="large" variant="contained">
          {isEditing ? "Save changes" : "Publish"}
        </Button>
        <Link to="/">
          <Button  size="large">Cancel</Button>
        </Link>
      </div>
    </Paper>
  );
};
