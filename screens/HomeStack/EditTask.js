import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
  Picker,
  ToastAndroid
} from "react-native";
import * as firebase from "firebase";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { onChange } from "react-native-reanimated";
import Moment from "moment";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function EditTask({ route, navigation }) {
  const { height, width } = Dimensions.get("window");

  const [data, setData] = useState({
    id:route.params.task.id,
    taskname: route.params.task.name,
    level: route.params.task.level,
    isDone: route.params.task.isDone,
    pushedAt: route.params.task.pushAt,
    createAt: route.params.task.createAt
  });

  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);

  const ref = firebase.firestore().collection("tasks");

  const showDatepicker = () => {
    showMode("date");
  };

  const showMode = (currentType) => {
    setShow(true);
    setMode(currentType);
  };

  const onChange = (selectedDate) => {
    const dateAfter = Moment(selectedDate).format("l");
    setData({
      ...data,
      pushedAt: dateAfter,
      createAt: selectedDate,
    });
    onHide();
  };

  const onHide = () => {
    setShow(false);
  };

  const onUpdateTask = () => {
    ref.doc(data.id).update({
      'isDone' : data.isDone,
      'level' : data.level,
      'pushedAt':data.pushedAt,
      'nameTask':data.taskname,
      'createAt':data.createAt
    })
    showToastWithGravityAndOffset()
    navigation.goBack();
  }

  const showToastWithGravityAndOffset = () => {
    ToastAndroid.showWithGravityAndOffset(
      "Update Task Succesfully!",
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      25,
      50
    );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1 }}>
        <View style={styles.header}>
          <View
            style={{
              justifyContent: "center",
              alignItems: "flex-start",
              marginTop: 20,
              marginHorizontal: 20,
              height: height * 0.3,
            }}
          >
            <Text style={{ color: "white", fontSize: 30, fontWeight: "700" }}>
              Edit Task
            </Text>
          </View>
        </View>
        <View style={styles.viewEdit}>
          <View
            style={{
              marginHorizontal: 30,
              marginVertical: 20,
              width: width * 0.8,
              flexDirection: "row",
              borderRadius: 30,
              borderWidth: 1,
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <AntDesign
              name="filetext1"
              size={24}
              color="black"
              style={{ marginHorizontal: 10 }}
            />
            <TextInput
              placeholder="Task name"
              maxLength={18}
              style={{ paddingVertical: 10, paddingHorizontal: 10 }}
              onChangeText={(val) => setData({...data, taskname:val})}
            >
              {data.taskname}
            </TextInput>
          </View>

          <View
            style={{
              marginHorizontal: 30,
              marginVertical: 10,
              width: width * 0.8,
              flexDirection: "row",
              borderRadius: 30,
              borderWidth: 1,
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <AntDesign
              name="setting"
              size={24}
              color="black"
              style={{ marginHorizontal: 10 }}
            />
            <TextInput
              placeholder="progress-one or two or full"
              style={{ paddingVertical: 10, paddingHorizontal: 10 }}
              onChangeText={(val) => setData({...data,level:val})}
            >
              {data.level}
            </TextInput>
          </View>

          <View
            style={{
              marginTop: 15,
              marginBottom: 20,
              width: width * 0.8,
              borderRadius: 30,
              borderWidth: 1,
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <MaterialIcons
              name="done"
              size={24}
              color="black"
              style={{ marginHorizontal: 10 }}
            />
            <Picker
              selectedValue={data.isDone}
              style={{
                marginVertical: 0,
                width: width * 0.8 * 0.85,
                justifyContent: "flex-start",
                alignItems: "center",
              }}
              onValueChange={(itemValue, itemIndex) =>
                setData({
                  ...data,
                  isDone: itemValue,
                })
              }
            >
              <Picker.Item label="Done" value={true} />
              <Picker.Item label="Not yet" value={false} />
            </Picker>
          </View>

          <View
            style={{
              marginHorizontal: 30,
              marginVertical: 10,
              width: width * 0.8,
              flexDirection: "row",
              borderRadius: 30,
              borderWidth: 1,
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <MaterialIcons
              name="date-range"
              size={24}
              color="black"
              style={{ marginHorizontal: 10 }}
              onPress={() => showDatepicker()}
            />
            <TextInput
              placeholder="pick your time"
              style={{ paddingVertical: 10, paddingHorizontal: 10 }}
              editable={false}
            >
              {data.pushedAt}
            </TextInput>
            <DateTimePickerModal
              isVisible={show}
              onConfirm={onChange}
              onCancel={onHide}
              mode="datetime"
            />
          </View>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginTop: 10,
              flexDirection:'column'
            }}
          >
            <TouchableOpacity
              style={{
                borderWidth: 1,
                borderRadius: 30,
                borderColor:'white',
                width: width * 0.5 * 0.9,
                backgroundColor: "#39B8EF",
              }}
              onPress={onUpdateTask}
            >
              <Text
                style={{
                  paddingHorizontal: 30,
                  paddingVertical: 10,
                  textAlign: "center",
                  fontSize: 18,
                  fontWeight: 'bold',
                  color: "white",
                }}
              >
                Update
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                marginTop:10,
                borderWidth: 1,
                borderRadius: 30,
                borderColor:'#39B8EF',
                width: width * 0.5 * 0.9,
                backgroundColor: "white",
              }}
              onPress={() => navigation.goBack()}
            >
              <Text
                style={{
                  paddingHorizontal: 30,
                  marginVertical: 10,
                  textAlign: "center",
                  fontSize: 18,
                  fontWeight: 'bold',
                  color: "#39B8EF",
                }}
              >
                Back
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  header: {
    flex: 1,
    backgroundColor: "#39B8EF",
  },
  viewEdit: {
    flex: 2,
    paddingBottom: 100,
    backgroundColor: "white",
    justifyContent: "flex-start",
    alignItems: "center",
  },
});
