import {configureStore} from "@reduxjs/toolkit"
import userReducer from "./users"
import {AlluserReducer} from "./users"
import AllConversationReducer from "./conversations"

const Store = configureStore({
    reducer:{
        user:userReducer,
        allUsers:AlluserReducer,
        conversations:AllConversationReducer
    }
})

export default Store