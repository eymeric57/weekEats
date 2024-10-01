import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../../constants/apiConstants";



const userSlice = createSlice({
  name: "users",
  initialState: {
    loading: false,
    userDetail: {},
   
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setUserDetail: (state, action) => {
      state.userDetail = action.payload;
      // useAuthContext().signIn(action.payload);
    }

  }
});

export const { setLoading, setUserDetail} = userSlice.actions;

//on crée une méthode qui permet de récuperer les information d'un user dans la bdd
export const fetchUserDetail = (id) => async (dispatch) => {
  
  try {
    dispatch(setLoading(true));
    const response = await axios.get(`${API_URL}/users/${id}`, {
    });
    dispatch(setUserDetail(response.data));
    dispatch(setLoading(false));
   
    
  } catch (error) {
    console.log(`Erreur lors de la récupération des détails de l'user: ${error}`);
    dispatch(setLoading(false));
  }
}


export default userSlice.reducer;