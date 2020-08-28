import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import { MaterialIcons, AntDesign, Entypo } from "@expo/vector-icons";
import Moment from "moment";
import * as firebase from "firebase";

export default function TaskDone({ navigation }) {
  const [date, setDate] = useState("");
  const [yesterday, setyesterday] = useState("");

  const [taskDone, setTaskDone] = useState([]);
  const [taskDone1, setTaskDone1] = useState([]);

  const ref = firebase.firestore().collection("tasks");

  const { height, width } = Dimensions.get("window");

  useEffect(() => {
    setDate(Moment().format("l"));

    setyesterday(Moment().subtract(1, "days").format("l"));

    ref
      .where("isDone", "==", true)
      .where("pushedAt", "==", date)
      .get()
      .then((querySnapshot) => {
        const list = [];
        querySnapshot.forEach((doc) => {
          const { nameTask, createAt, level, pushedAt } = doc.data();
          list.push({
            id: doc.id,
            name: nameTask,
            createAt: createAt,
            level: level,
            pushAt: pushedAt,
          });
        });
        setTaskDone(list);
      });

    ref
      .where("isDone", "==", true)
      .where("pushedAt", "==", yesterday)
      .get()
      .then((querySnapshot) => {
        const list = [];
        querySnapshot.forEach((doc) => {
          const { nameTask, createAt, level, pushedAt } = doc.data();
          list.push({
            id: doc.id,
            name: nameTask,
            createAt: createAt,
            level: level,
            pushAt: pushedAt,
          });
        });
        setTaskDone1(list);
      });
  });

  return (
    <View style={styles.container}>
      <View
        style={{
          flex: 1,
          backgroundColor: "#39B8EF",
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign
            name="leftcircleo"
            size={28}
            color="black"
            style={{ marginLeft: 10, marginTop: 10 }}
          />
        </TouchableOpacity>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "700", color: "black" }}>
            Today is: {date}
          </Text>
          <Text style={{ marginTop: 10, fontWeight: "700", color: "black" }}>
            Let's look see tasks done today
          </Text>
          <ScrollView>
            {taskDone.map((task) => (
              <View
                key={task.id}
                style={{
                  height: height * 0.3 * 0.3,
                  width: width,
                  justifyContent: "flex-start",
                  alignItems: "center",
                  flexDirection: "row",
                  marginLeft: 60,
                  marginVertical: 10,
                }}
              >
                <Entypo name={task.level} size={30} color="black" />
                <View
                  style={{
                    marginHorizontal: 10,
                    flexDirection: "column",
                    justifyContent: "flex-start",
                  }}
                >
                  <Text
                    style={{ color: "black", fontWeight: "700", fontSize: 18 }}
                  >
                    {task.name}
                  </Text>
                  <Text
                    style={{ color: "gray", fontSize: 16, fontWeight: "400" }}
                  >
                    {Moment(task.createAt.toDate()).calendar()}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
      <View
        style={{
          flex: 1,
          backgroundColor: "white",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: "700", color: "black" }}>
          Yesterday is: {yesterday}
        </Text>
        <Text style={{ marginTop: 10, fontWeight: "700", color: "black" }}>
          Let's look see tasks done yesterday
        </Text>
        <ScrollView>
          {taskDone1.map((task) => (
            <View
              key={task.id}
              style={{
                height: height * 0.3 * 0.3,
                width: width,
                justifyContent: "flex-start",
                alignItems: "center",
                flexDirection: "row",
                marginLeft: 60,
                marginVertical: 10,
              }}
            >
              <Entypo name={task.level} size={30} color="black" />
              <View
                style={{
                  marginHorizontal: 10,
                  flexDirection: "column",
                  justifyContent: "flex-start",
                }}
              >
                <Text
                  style={{ color: "black", fontWeight: "700", fontSize: 18 }}
                >
                  {task.name}
                </Text>
                <Text
                  style={{ color: "gray", fontSize: 16, fontWeight: "400" }}
                >
                  {Moment(task.createAt.toDate()).calendar()}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
