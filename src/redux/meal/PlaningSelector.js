import { createSelector } from "@reduxjs/toolkit";

const selectPlanningDetail = (state) => state.planning.planningDetail;

export const selectPlanningData = createSelector(
  [selectPlanningDetail],
  (planningDetail) => ({ planningDetail })
);