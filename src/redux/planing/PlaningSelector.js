import {createSelector} from '@reduxjs/toolkit';

const selectLoading = state => state.planing.loading;
const selectPlanningDetail = state => state.planing.planningDetail;

export const selectPlanningData = createSelector(
  [selectPlanningDetail, selectLoading],
  (planningDetail, loading) => ({planningDetail, loading}),
);
