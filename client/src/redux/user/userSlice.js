import { createSlice} from '@reduxjs/toolkit'

const initialState = {
    currentUser : null,
    error : null,
    loading : false,

};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signInStart: (state)=>{
            state.loading = true; 
        },
        signInSuccess: (state, actions)=>{
            state.currentUser = actions.payload;
            state.loading = false; 
            state.error  = null
        },
        signInFailure: (state, actions)=>{
            state.error = actions.payload;
            state.loading = false; 
        },
        updateUserStart: (state)=>{
            state.loading = true; 
        },

        updateUserSuccess:(state,actions)=>{
            state.currentUser = actions.payload;
            state.loading = false; 
            state.error  = null
        },
        updateUserFailure: (state, actions)=>{
            state.error = actions.payload;
            state.loading = false; 
        },
        deleteUserStart: (state)=>{
            state.loading = true; 
        },

        deleteUserSuccess:(state,actions)=>{
            state.currentUser = null;
            state.loading = false; 
            state.error  = null
        },
        deleteUserFailure: (state, actions)=>{
            state.error = actions.payload;
            state.loading = false;  
        },
        signoutUserStart: (state)=>{
            state.loading = true; 
        },

        signoutUserSuccess:(state,actions)=>{
            state.currentUser = null;
            state.loading = false; 
            state.error  = null
        },
        signoutUserFailure: (state, actions)=>{
            state.error = actions.payload;
            state.loading = false;  
        },


    }
});

export const { signInStart, signInSuccess, signInFailure,updateUserStart,updateUserSuccess,updateUserFailure, deleteUserStart, deleteUserSuccess, deleteUserFailure, signoutUserStart , signoutUserSuccess,signoutUserFailure }= userSlice.actions;

export default userSlice.reducer;