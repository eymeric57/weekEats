import { configureStore } from "@reduxjs/toolkit";
import userReducer from './user/UserSlice';
import mealReducer from './meal/PlaningSlice';

const store = configureStore({
  reducer: {
    users: userReducer,
    planning: mealReducer,
  },
});

export default store;