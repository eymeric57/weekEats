import {createSlice} from '@reduxjs/toolkit';
import axios from 'axios';
import {API_URL} from '../../constants/apiConstants';

const planningSlice = createSlice({
  name: 'planning',
  initialState: {
    loading: false,
    planningDetail: {},
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setPlanningDetail: (state, action) => {
      state.planningDetail = action.payload;
    },
  },
});

export const {setLoading, setPlanningDetail, setError} = planningSlice.actions;

// Méthode pour récupérer les détails du planning
export const fetchPlanningDetail = userId => async dispatch => {
  try {
    dispatch(setLoading(true));
    const response = await axios.get(
      `${API_URL}/planings?utilisateur=/api/users/${userId}`,
    );
    console.log('response', response.data['hydra:member'].types);
    dispatch(setPlanningDetail(response.data));
    dispatch(setLoading(false));
  } catch (error) {
    console.log(
      `Erreur lors de la récupération des détails du planning: ${error}`,
    );

    dispatch(setLoading(false));
  }
};

export default planningSlice.reducer;
