import React, { useState } from "react";
import { View, Text, StyleSheet, Button, Alert } from "react-native";
import { Audio } from "expo-av";
import axios from "axios";

export default function RecorderScreen() {
  const [recording, setRecording] = useState(false);
  const [recordingUri, setRecordingUri] = useState("");
  const [saveRecord, setSaveRecord] = useState([]);

  async function startRecording() {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      await recording.startAsync();
      setRecording(recording);
    } catch (err) {
      console.log("Misslyckad inspelning", err);
    }
  }

  async function stopRecording() {
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    setRecordingUri(recording.getURI());
    const title = new Date();
    setSaveRecord(() => [{ title: title, uri: recording.getURI() }]);
  }

  async function playRecording() {
    try {
      const { sound } = await Audio.Sound.createAsync({
        uri: recordingUri,
      });
      await sound.playAsync();
      sound.getStatusAsync();
    } catch (err) {
      console.log(err, Alert.alert("Finns inget att spela upp"));
    }
  }

  async function saveRecording() {
    if (!recordingUri) {
      return Alert.alert("Inget att spara");
    }
    await axios
      .post("http://192.168.1.167:3001/add", saveRecord)
      .then(() => {
        Alert.alert("Inspelning sparad");
        setRecordingUri("");
      })
      .catch((error) => console.log(error.message));
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Inspelaren</Text>
      <View style={styles.buttonContainer}>
        <Button
          title={recording ? "Stop" : "Starta inspelning"}
          style={styles.button}
          onPress={recording ? stopRecording : startRecording}
        />
      </View>
      {recording && <Text>Inspelning pågar</Text>}
      <View style={styles.buttonContainer}>
        <Button title="Spela upp inspelning" onPress={playRecording} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Spara inspelning" onPress={saveRecording} />
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
  header: {
    fontSize: 50,
    marginBottom: 50,
  },
  buttonContainer: {
    marginTop: 30,
    width: 180,
  },
});
