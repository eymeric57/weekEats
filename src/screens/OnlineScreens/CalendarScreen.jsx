import React, {useEffect, useCallback} from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useAuthContext} from '../../contexts/AuthContext';
import CalendarRecap from '../../components/CalendarRecap';
import {selectUserData} from '../../redux/user/UserSelector';
import {fetchUserDetail} from '../../redux/user/UserSlice';

const CalendarScreen = () => {
  const {userDetail} = useSelector(selectUserData);
  const {user} = useAuthContext();
  const userId = user ? user.id : null;
  console.log('userDetail', userDetail);
  const dispatch = useDispatch();

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserDetail(userId));
      console.log('====================================');
      console.log('userId', userId);
      console.log('planningDetail', userDetail);
      console.log('====================================');
    }
  }, [dispatch, userId]);
  if (!userDetail) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#639067" />
      </View>
    );
  }

  return <CalendarRecap userDetail={userDetail} />;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CalendarScreen;
