import {createSlice} from '@reduxjs/toolkit';
import {userService} from '../../services/api';

const userSlice = createSlice({
  name: 'users',
  initialState: {
    loading: false,
    userDetail: null,
    error: null,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setUserDetail: (state, action) => {
      state.userDetail = action.payload;
      state.error = null;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {setLoading, setUserDetail, setError} = userSlice.actions;
export const fetchUserDetail = id => async dispatch => {
  try {
    dispatch(setLoading(true));
    console.log("Appel API pour l'utilisateur:", id); // Log pour vérifier l'appel
    const data = await userService.getById(id);
    console.log('Réponse API utilisateur:', data); // Log pour afficher la réponse API
    dispatch(setUserDetail(data)); // Envoi de la réponse au store Redux
  } catch (error) {
    console.error(
      'Erreur lors de la récupération des détails utilisateur:',
      error,
    );
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};

export default userSlice.reducer;
