// PlaningSlice.js
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {planningService} from '../../services/api';

export const fetchPlanningDetail = createAsyncThunk(
  'planing/fetchPlanningDetail',
  async (userId, {rejectWithValue}) => {
    try {
      const data = await planningService.getByUser(userId);
      console.log('Fetched Planning Data:', data); // Ajoute ce log pour vérifier les données
      return data;
    } catch (error) {
      console.error('Error fetching planning detail:', error.message); // Log des erreurs éventuelles
      return rejectWithValue(error.message);
    }
  },
);

export const deleteMeal = createAsyncThunk(
  'planing/deleteMeal',
  async (mealId, {rejectWithValue}) => {
    try {
      await fetch(`${API_URL}/meals/${mealId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return mealId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const planingSlice = createSlice({
  name: 'planing',
  initialState: {
    loading: false,
    plannings: {},
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchPlanningDetail.pending, state => {
        state.loading = true;
      })
      .addCase(fetchPlanningDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.plannings = action.payload;
      })
      .addCase(fetchPlanningDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Gestion de la suppression
      .addCase(deleteMeal.pending, state => {
        state.loading = true;
      })
      .addCase(deleteMeal.fulfilled, (state, action) => {
        state.loading = false;
        // Mise à jour des plannings en retirant le repas supprimé
        if (state.plannings['hydra:member']) {
          state.plannings['hydra:member'] = state.plannings['hydra:member'].map(
            planning => ({
              ...planning,
              meals: planning.meals.filter(meal => meal.id !== action.payload),
            }),
          );
        }
      })
      .addCase(deleteMeal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default planingSlice.reducer;
