import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../../constants/apiConstant";

const userSlice = createSlice({
  name: "users",
  initialState: {
    loading: false,
    userDetail: {},
    token: null, // Ajoutez ceci pour stocker le token
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setUserDetail: (state, action) => {
      state.userDetail = action.payload;
    },
    setToken: (state, action) => { // Ajoutez ce reducer
      state.token = action.payload;
    }
  }
});

export const { setLoading, setUserDetail, setToken} = userSlice.actions;

//on crée une méthode qui permet de récuperer les information d'un user dans la bdd
export const fetchUserDetail = (id) => async (dispatch, getState) => {
  try {
    dispatch(setLoading(true));
    const token = getState().user.token; // Récupérez le token depuis le state
    const response = await axios.get(`${API_URL}/users/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}` // Ajoutez le token dans l'en-tête
      }
    });
    dispatch(setUserDetail(response.data));
    dispatch(setLoading(false));
  } catch (error) {
    console.log(`Erreur lors de la récupération des détails de l'user: ${error}`);
    dispatch(setLoading(false));
  }
}

// //on crée une méthode qui permet de récuperer les information d'un user dans la bdd
// export const fetchAvatars = () => async dispatch => {
//   try {
//     //on passe le loading à true
//     dispatch(setLoading(true));
//     //on fait une requête à l'api
//     const response = await axios.get(`${API_URL}/avatars?page=1&isActive=true`);
//     //on set les données dans le state
//     dispatch(setAvatars(response.data['hydra:member']));
//     //on repasse le loading à false
//     dispatch(setLoading(false));
//   } catch (error) {
//     console.log(`Erreur lors de la récupération des avatars: ${error}`);
//     //on repasse le loading à false
//     dispatch(setLoading(false));
//   }
// }



export default userSlice.reducer;