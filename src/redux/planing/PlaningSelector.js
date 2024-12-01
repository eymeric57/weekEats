import {createSelector} from '@reduxjs/toolkit';

const selectPlaningState = state => state.planing;

export const selectPlanningData = createSelector(
  [selectPlaningState],
  planingState => ({
    planningDetail: planingState.plannings,
    loading: planingState.loading,
    error: planingState.error,
  }),
);
