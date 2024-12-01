import {configureStore} from '@reduxjs/toolkit';
import userReducer from './user/UserSlice';
import planingReducer from './planing/PlaningSlice';

const store = configureStore({
  reducer: {
    users: userReducer,
    planing: planingReducer,
  },
});

export default store;
