import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../../constants/apiConstant";

const mealSlice = createSlice({
  name: "planning",
  initialState: {
    planningDetail: {},
  },
  reducers: {
    setPlanningDetail: (state, action) => {
      state.planningDetail = action.payload;
    },
  },
});

// Exportez les actions
export const { setPlanningDetail } = mealSlice.actions;

// Créez une méthode asynchrone pour récupérer les détails du planning
export const fetchPlanningDetail = (userId) => async (dispatch) => {
  try {
    dispatch(setLoading(true)); // Assurez-vous d'avoir un reducer setLoading
    const response = await axios.get(`${API_URL}/planings/${userId}`);
    dispatch(setPlanningDetail(response.data));
  } catch (error) {
    console.log(`Erreur lors de la récupération des détails du planning: ${error}`);
  } finally {
    dispatch(setLoading(false)); // Assurez-vous d'avoir un reducer setLoading
  }
};

export default mealSlice.reducer;