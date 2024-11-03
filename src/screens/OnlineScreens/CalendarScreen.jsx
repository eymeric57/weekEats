import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import CalendarRecap from "../../components/CalendarRecap";
import { selectPlanningData } from "../../redux/planing/PlaningSelector";
import { useSelector } from "react-redux";

function CalendarScreen() {

  const { loading } = useSelector(selectPlanningData);

  if (loading) {
    return <ActivityIndicator size="large" color="#639067" />;
  }
  return (
<CalendarRecap />
  );
}





export default CalendarScreen;