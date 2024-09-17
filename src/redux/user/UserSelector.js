import { createSelector } from "@reduxjs/toolkit";

const selectLoading = state => state.users.loading;
const selectUserDetail = state => state.users.userDetail;


export const selectUserData = createSelector(
  [selectLoading, selectUserDetail, ],
  (loading, userDetail) => ({ loading, userDetail})
)