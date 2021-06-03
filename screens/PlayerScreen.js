import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, FlatList, Alert } from "react-native";
import { ListItem, Icon } from "react-native-elements";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import axios from "axios";

export default function PlayerScreen() {
  const [recordings, setRecordings] = useState([]);
  const [sound, setSound] = useState();

  useEffect(() => {
    axios
      .get("http://192.168.1.167:3001/")
      .then((data) => setRecordings(data.data.recordings))
      .catch((error) => console.log(error.message));
  });

  showRecordings = ({ item }) => {
    return (
      <ListItem bottomDivider>
        <ListItem.Content>
          <ListItem.Title>
            {item.title}
            <Icon
              name="play-arrow"
              type="material-icons"
              color="#000"
              size={30}
              onPress={() => playSavedRecording(item)}
            />
            <Icon
              name="clear"
              type="material-icons"
              color="#000"
              size={30}
              onPress={() => deleteRecording(item)}
            />
          </ListItem.Title>
          <ListItem.Subtitle>2021-05-31</ListItem.Subtitle>
        </ListItem.Content>
      </ListItem>
    );
  };

  async function playSavedRecording(item) {
    const { sound } = await Audio.Sound.createAsync({
      uri: item.uri,
    });
    setSound(sound);
    await sound.playAsync();
  }

  async function deleteRecording(item) {
    try {
      await FileSystem.deleteAsync(item.uri);
      axios
        .delete(`http://192.168.1.167:3001/${item._id}`)
        .then((response) => console.log(response.status));
      Alert.alert("Inspelning borttagen");
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Spel Lista</Text>
      <View style={styles.listContainer}>
        <FlatList
          data={recordings}
          renderItem={showRecordings}
          keyExtractor={(item) => item._id.toString()}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 70,
    alignItems: "center",
    backgroundColor: "lightgreen",
  },
  listContainer: {
    paddingTop: 70,
    width: "82%",
    alignSelf: "center",
  },
  header: {
    fontSize: 50,
  },
});
