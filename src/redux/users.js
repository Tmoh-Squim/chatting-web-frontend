import {createAsyncThunk,createSlice} from "@reduxjs/toolkit"
import axios from "axios"
export const LoadUser = createAsyncThunk('loadUser',async()=>{
    try {
        const token = `${localStorage.getItem('token')}`
        const res = await axios.get('https://chatting-web-app-2xe3.onrender.com/api/v1/auth/getUser',{
            headers:{
                'Authorization':token
            }
        })
      return res.data
    } catch (error) {
        console.log(error)
    }
})
export const getAllusers =  createAsyncThunk('all-users',async()=>{
    try {
        const token = `${localStorage.getItem('token')}`
        const res = await axios.get('https://chatting-web-app-2xe3.onrender.com/api/v1/auth/all-users',{
            headers:{
                'Authorization':token
            }
        })
        console.log('res',res)
      return res.data
    } catch (error) {
        console.log(error)
    }
})

const initialState = {
    user:{},
    isAuthenticated:false,
    loading:false,
    error:null,
}

const userSlice = createSlice({
    name:'user',
    initialState,
    extraReducers:(builder)=>{
        builder
        .addCase(LoadUser.pending,(state)=>{
            state.loading = true
            state.isAuthenticated = false
        })
        .addCase(LoadUser.fulfilled,(state,action)=>{
            state.user = action.payload
            state.isAuthenticated = true
            state.loading = false
        })
        .addCase(LoadUser.rejected,(state,action)=>{
            state.loading = false
            state.isAuthenticated = false
            state.error = action.payload
        })
    }
})
export const AlluserReducer = createSlice({
    name:'allUsers',
    initialState:{
        allUsers:[],
        loading:false,
        error:null
    },
    extraReducers:(builder)=>{
        builder
        .addCase(getAllusers.pending,(state)=>{
            state.loading = true
        })
        .addCase(getAllusers.fulfilled,(state,action)=>{
            state.allUsers = action.payload
            state.loading = false
        })
        .addCase(getAllusers.rejected,(state,action)=>{
            state.loading = false
            state.error = action.payload
        })
    }
}).reducer

export default userSlice.reducer