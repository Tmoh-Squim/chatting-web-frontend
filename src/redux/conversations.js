import {createAsyncThunk,createSlice} from "@reduxjs/toolkit"
import axios from "axios"
export const getAllConversation = createAsyncThunk('user-conversations',async(id)=>{
    const token = `${localStorage.getItem('token')}`
    const response = await axios.get(`http://localhost:8081/api/v2/conversation/user-conversation/${id}`,{
        headers:{
            'Authorization':token
        }
    })

    return response.data

})

const initialState={
    conversations:[],
    loading:true,
    error:null
}

const conversationSlice = createSlice({
    name:'conversation',
    initialState,
    extraReducers:(builder)=>{
        builder
        .addCase(getAllConversation.pending,(state)=>{
            state.loading = true
        })
        .addCase(getAllConversation.fulfilled,(state,action)=>{
            state.conversations= action.payload
            state.loading = false
        })
        .addCase(getAllConversation.rejected,(state,action)=>{
            state.error = action.payload
            state.loading = false
        })
    }
})

export default conversationSlice.reducer