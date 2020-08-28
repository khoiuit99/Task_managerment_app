import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { AntDesign } from "@expo/vector-icons";
import Home from "./HomePage";
import EditTask from "./EditTask";
import AddTask from "./AddTask";
import TaskDone from "./TaskDone";

const homeStack = createStackNavigator();

export default function HomeStack() {
  return (
    <homeStack.Navigator>
      <homeStack.Screen
        name="home"
        component={Home}
        options={{ headerShown: false }}
      />
      <homeStack.Screen
        name="edit"
        component={EditTask}
        options={{ headerShown: false }}
      />
      <homeStack.Screen
        name="add"
        component={AddTask}
        options={{ headerShown: false }}
      />
      <homeStack.Screen
        name="done"
        component={TaskDone}
        options={{
          headerShown: false,
        }}
      />
    </homeStack.Navigator>
  );
}
