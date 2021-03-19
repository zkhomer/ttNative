import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  Image,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';

export default function App() {
  const [data, setData] = useState(null);
  const [query, setQuery] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [modalImg, setModalImg] = useState("");
  const [err, setErr] = useState("");
  const [toggle, setToggle] = useState(false);
  const [pagination, setPagination] = useState(4)
  const [modalVisible, setModalVisible] = useState(false);
  const info = async (query) =>
    await fetch(
      `https://pixabay.com/api/?key=12518569-95c38d40fd48988b36f9181a4&q=${query}&image_type=photo`
    ).then((res) => res.json());

  useEffect(() => {
    info(query).then((data) => setData(data));
  }, [query]);

  const handleQuery = () => {
    inputValue.trim() ? setQuery(inputValue) : setErr("enter valid value!");
    if (inputValue.trim()) {
      setErr("");
    }
  };
  const toggleHandler = () => {
    setToggle(!toggle)
  }

  const parseObjToString = (obj, pref = "") => {
    let res = Object.entries(obj);
    let str = ""
    res.map(el => str += `${el[0]}: ${el[1]}${pref} %0A `)
    return str
  };
  const sendQuery = () => {
    const token = `1626093590:AAHZTkCDkjUA2fjm48Y6_W7RD1qgQTC1GNg`
    const chatId = `-542959091`
    let message = `**Новое сохранение!** %0A ${parseObjToString(modalImg)}`
    let url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${message}`
    let xhttp = new XMLHttpRequest();
    xhttp.open("GET", url)
    xhttp.send()
  }
  if (data === null) {
    return (
      <View style={[styles.containerSpinner, styles.horizontal]}>
        <ActivityIndicator size="large" color="#00ff00"/>
      </View>
    )
  } else return (
    <>
      <TextInput
        style={styles.input}
        onChangeText={setInputValue}
        placeholder="search images"
      />
      <Button
        title={"search img"}
        onPress={handleQuery}
      />
      <View style={modalImg ? st.centeredView : {display: "none"}}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalVisible(!modalVisible);
          }}
        >
          <View style={st.centeredView}>
            <View style={st.modalView}>
              <Image
                style={styles.modalImg}
                source={{
                  uri: modalImg.webformatURL,
                }}
              />
              <View style={styles.modalInfo}>
                <Text>Like:{modalImg.Like}</Text>
                <Text>Tags:{modalImg.Tags}</Text>
                <Text>Comments:{modalImg.comments}</Text>
                <Button
                  onPress={sendQuery}
                  title={"send to telegram"}
                />
              </View>
              <Pressable
                style={[st.button, st.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={st.textStyle}>Hide Modal</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
      <Button
        onPress={toggleHandler}
        title={'show image'}
      />
      <SafeAreaView style={toggle ? styles.mainContainer : styles.modalOff}>
        <ScrollView style={styles.text}>
          {data.hits.map((el, index) => {

            return index > pagination ? false : (
              <View key={index} style={styles.container}>
                <Image
                  style={styles.cardImg}
                  source={{
                    uri: el.previewURL,
                  }}
                />
                <Text>Tags:{el.tags}</Text>
                <Pressable
                  style={[styles.button, styles.buttonOpen]}
                  onPress={() => {
                    setModalImg({webformatURL: el.webformatURL, Like: el.likes, Tags: el.tags, comments: el.comments})
                    setModalVisible(true)
                  }

                  }
                >
                  <Text style={st.textStyle}>Show Modal</Text>
                </Pressable>
              </View>
            )
          })}
          <Button
            title={"показать больше!"}
            disabled={pagination > data.hits.length ? true : false}
            onPress={() => setPagination(pagination + 5)}
          />
          <Button
            title={"показать меньше!"}
            disabled={pagination < 5 ? true : false}
            onPress={() => setPagination(pagination - 5)}
          />

        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: 'center',
    width: '100%',
    marginTop: 20
  },
  cardImg: {
    width: '100%',
    height: 200,
  },
  mainContainer: {
    flex: 1,
    marginTop: 40,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    marginTop: 50,
  },
  modalImg: {
    top: 10,
    position: "absolute",
    width: '100%',
    height: 300,
  },
  modalOff: {
    display: 'none'
  },
  modalInfo: {
    position: "relative",
    top: 275,

  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10
  },
  containerSpinner: {
    flex: 1,
    justifyContent: "center"
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonOpen: {
    backgroundColor: "#8b6dd4",
  },


});

const st = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    position: "absolute",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    height: 450,
    width: 320,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 10,
    position: "absolute",
    bottom: 5,
    elevation: 2
  },
  buttonOpen: {
    backgroundColor: "#8a6bdd",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
})
