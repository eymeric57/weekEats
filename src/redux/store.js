import { configureStore } from "@reduxjs/toolkit";
import userReducer from './user/UserSlice';


//on crée notre magasin de données
const store = configureStore({
  reducer: {
    // on declarera ici les reducers
    users: userReducer
  }
})

export default store;