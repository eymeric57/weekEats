import {createSelector} from '@reduxjs/toolkit';

// Sélecteurs simples pour accéder aux différentes parties de l'état.
const selectLoading = state => state.users.loading;
const selectUserDetail = state => state.users.userDetail;

export const selectUserData = createSelector(
  [selectLoading, selectUserDetail],
  (loading, userDetail) => ({
    loading,
    userDetail,
  }),
);
