import {configureStore} from '@reduxjs/toolkit';
import userReducer from './user/UserSlice';
import planningReducer from './planing/PlaningSlice';

const store = configureStore({
  reducer: {
    users: userReducer,
    planing: planningReducer,
  },
});

export default store;
