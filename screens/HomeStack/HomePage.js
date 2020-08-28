import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  StatusBar,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ToastAndroid,
  ScrollView,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import * as Location from "expo-location";
import * as Permission from "expo-permissions";
import ForecastCard from "../../components/forecast";
import * as firebase from "firebase";
import Moment from "moment";

export default function Home({ navigation }) {
  // const [data, setData] = useState({
  //   longitude: null,
  //   latitude: null,
  //   error: "",
  // });

  const { height, width } = Dimensions.get("window");

  const [location, setLocation] = useState(null);
  const [geoCode, setgeoCode] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [data, setData] = useState({
    longitude: null,
    latitude: null,
  });
  const [forecast, setForecast] = useState([]);

  const [tasks, setTasks] = useState([]);
  const [chooseDate, setChooseDate] = useState("");

  const ref = firebase.firestore().collection("tasks");

  useEffect(() => {
    (async () => {
      // let { status } = await Permission.askAsync(Permission.LOCATION);
      let { status } = await Location.requestPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Lowest,
      });
      setLocation(location);

      setData({
        longitude: location.coords.longitude,
        latitude: location.coords.latitude,
      });
      getGeocodeAsync({ longitude, latitude });

      getWeather();
    })();

    setChooseDate(Moment().format("l"));

    ref
      .where("pushedAt", "==", chooseDate)
      .where("isDone", "==", false)
      .get()
      .then((querySnapshot) => {
        const list = [];
        querySnapshot.forEach((doc) => {
          const { nameTask, createAt, level, isDone, pushedAt } = doc.data();
          list.push({
            id: doc.id,
            name: nameTask,
            createAt: createAt,
            isDone: isDone,
            level: level,
            pushAt: pushedAt,
          });
        });
        setTasks(list);
      });
  });

  const getGeocodeAsync = async (location) => {
    let geocode = await Location.reverseGeocodeAsync(location);
    setgeoCode(geocode);
  };

  const getWeather = () => {
    // Construct the API url to call
    let url =
      "https://api.openweathermap.org/data/2.5/onecall?lat=" +
      data.latitude +
      "&lon=" +
      data.longitude +
      "&exclude=hourly,daily&appid=4542d590dd451f6c1194342d44ed8917";

    // Call the API, and set the state of the weather forecast
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setForecast({ data });
      });
  };

  const onDeleteTask = (id) => {
    ref
      .doc(id)
      .delete()
      .then(() => showToastWithGravityAndOffset());
  };

  const onToggleStatus = (id) => {
    ref.doc(id).update({
      isDone: true,
    });
  };

  const showToastWithGravityAndOffset = () => {
    ToastAndroid.showWithGravityAndOffset(
      "Delete Task succesfully!",
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      25,
      50
    );
  };

  let text = "Waiting..";
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <StatusBar hidden={true} />
        <View style={styles.viewAppBar}>
          <FontAwesome name="align-left" size={30} color="white" />
          <Text style={{ fontWeight: "bold", fontSize: 18 }}>
            Today is: {chooseDate}
          </Text>
        </View>
        <View style={styles.foreCastWeather}>
          <View
            style={{ height: 100, backgroundColor: "white", flex: 1 }}
          >
            <Text>{text}</Text>
          </View>
        </View>

        <View style={styles.searchBar}>
          <View
            style={{
              padding: 10,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <TextInput
              placeholder="Search you task?"
              placeholderTextColor="white"
              maxLength={36}
            />
            <AntDesign
              name="search1"
              size={20}
              color="white"
              style={{ marginHorizontal: 5 }}
            />
          </View>
        </View>

        <View style={styles.showItems}>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginTop: 10,
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: "700" }}>
              Tasks need to do today
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center",
                marginVertical: 20,
                borderRadius: 20,
                borderWidth: 1,
              }}
              onPress={() => navigation.navigate("add")}
            >
              <Text
                style={{
                  marginHorizontal: 4,
                  paddingHorizontal: 5,
                  paddingVertical: 7,
                }}
              >
                Add new task
              </Text>
              <AntDesign
                name="pluscircleo"
                size={20}
                color="black"
                style={{ paddingHorizontal: 5, paddingVertical: 7 }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center",
                marginVertical: 20,
                borderRadius: 20,
                borderWidth: 1,
              }}
              onPress={() => navigation.navigate("done")}
            >
              <Text
                style={{
                  marginHorizontal: 4,
                  paddingHorizontal: 5,
                  paddingVertical: 7,
                }}
              >
                See tasks done
              </Text>
              <AntDesign
                name="checkcircleo"
                size={20}
                color="black"
                style={{ paddingHorizontal: 5, paddingVertical: 7 }}
              />
            </TouchableOpacity>
          </View>
          <ScrollView>
            {tasks.map((task) =>
              task.isDone ? null : (
                <View
                  key={task.id}
                  style={{
                    height: height * 0.3 * 0.3,
                    width: width,
                    justifyContent: "flex-start",
                    alignItems: "center",
                    flexDirection: "row",
                    marginHorizontal: 25,
                  }}
                >
                  <Entypo name={task.level} size={30} color="black" />
                  <TouchableOpacity onPress={() => navigation.navigate("edit", {task: task})}>
                    <View
                      style={{
                        marginHorizontal: 10,
                        flexDirection: "column",
                        justifyContent: "flex-start",
                      }}
                    >
                      <Text
                        style={{
                          color: "black",
                          fontWeight: "700",
                          fontSize: 18,
                        }}
                      >
                        {task.name}
                      </Text>
                      <Text
                        style={{
                          color: "gray",
                          fontSize: 16,
                          fontWeight: "400",
                        }}
                      >
                        {Moment(task.createAt.toDate()).calendar()}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <View
                    style={{
                      flexDirection: "row",
                      marginLeft: 10,
                      justifyContent: "flex-end",
                      alignItems: "flex-end",
                    }}
                  >
                    <TouchableOpacity onPress={() => onDeleteTask(task.id)}>
                      <AntDesign
                        name="delete"
                        size={24}
                        color="black"
                        style={{ marginHorizontal: 10 }}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("edit", { task: task })
                      }
                    >
                      <AntDesign
                        name="edit"
                        size={24}
                        color="black"
                        style={{ marginHorizontal: 10 }}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onToggleStatus(task.id)}>
                      <AntDesign
                        name="checkcircleo"
                        size={24}
                        color="black"
                        style={{ marginHorizontal: 10 }}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              )
            )}
          </ScrollView>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#39B8EF",
    flex: 1,
  },
  viewAppBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 25,
  },
  foreCastWeather: {
    justifyContent: "center",
    paddingHorizontal: 25,
    flexDirection: "row",
    marginVertical: 5,
  },
  searchBar: {
    marginVertical: 20,
    borderRadius: 30,
    borderWidth: 1,
    marginHorizontal: 25,
  },
  showItems: {
    flex: 2,
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
});
