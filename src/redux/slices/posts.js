import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../axios'

export const fetchPosts = createAsyncThunk('/post/fetchPosts', async () => {
    const { data } = await axios.get('/post');
    return data;
})

export const fetchTags = createAsyncThunk('/post/fetchTags', async () => {
    const { data } = await axios.get('/tags');
    return data;
})

export const fetchRemovePost = createAsyncThunk('/post/fetchRemovePosts', async (id) => await axios.delete(`/post/${id}`));

const initialState = {
    posts: {
        items: [],
        status: 'loading',
    },
    tags: {
        items: [],
        status: 'loading',
    }
}

const postSlice = createSlice({
    name: "posts", 
    initialState,
    reducers: {},
    extraReducers: {
            //Getting posts
            [fetchPosts.pending]: (state, action) => {
                state.posts.items = [];
                state.posts.status = 'loading';
            },
            [fetchPosts.fulfilled]: (state, action) => {
                state.posts.items = action.payload;
                state.posts.status = 'loaded';
            },
            [fetchPosts.rejected]: (state, action) => {
                state.posts.items = [];
                state.posts.status = 'error';
            },
            //Getting tags
            [fetchTags.pending]: (state, action) => {
                state.tags.items = [];
                state.tags.status = 'loading';
            },
            [fetchTags.fulfilled]: (state, action) => {
                state.tags.items = action.payload;
                state.tags.status = 'loaded';
            },
            [fetchTags.rejected]: (state, action) => {
                state.tags.items = [];
                state.tags.status = 'error';
            },
            //Deleting post
            [fetchRemovePost.pending]: (state, action) => {
                state.posts.items = state.posts.items.filter((obj) => obj._id !== action.meta.arg);
            },
    }
})

export const postsReducer = postSlice.reducer;