import React,{useState, useEffect} from 'react';
import { StatusBar,SafeAreaView,ScrollView,Image,StyleSheet, Text, View,Button,TextInput } from 'react-native';

export default function App() {
  const [data, setData] = useState(null);
  const [query, setQuery] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [modalImg, setModalImg] = useState("");
  const [err, setErr] = useState("");
  const [toggle, setToggle] = useState(false);
  const [pagination,setPagination] = useState(4)
  const info = async (query) =>
    await fetch(
      `https://pixabay.com/api/?key=12518569-95c38d40fd48988b36f9181a4&q=${query}&image_type=photo`
    ).then((res) =>res.json());

  useEffect(() => {
    info(query).then((data) => setData(data));
  }, [query]);

  const handleQuery = () => {
    inputValue.trim() ? setQuery(inputValue) : setErr("enter valid value!");
    if (inputValue.trim()) {
      setErr("");
    }
  };
  const toggleHandler = ()=>{
    setToggle(!toggle)
  }

  const test = (obj,pref="") => {
    let res = Object.entries(obj);
    let str = ""
    res.map(el=>str+=`${el[0]}: ${el[1]}${pref} %0A `)
    return str
  };
  const sendQuery = () => {
    const token = `1626093590:AAHZTkCDkjUA2fjm48Y6_W7RD1qgQTC1GNg`
    const chatId = `-542959091`
    let message = `**Новое сохранение!** %0A ${test(modalImg)} }`
    let url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${message}`
    let xhttp = new XMLHttpRequest();
    xhttp.open("GET",url)
    xhttp.send()
  }
if(data === null){
  return null // spinner
}else return (

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
      <View
        style={modalImg?{display:"flex"}:{display:'none'}}
      >
        <Button
          onPress={() => setModalImg("")}
          title={"close modal-window"}
        />
        <Button
          onPress={sendQuery}
          title={"send to telegram"}
        />
        <Image
          style={styles.modalImg}
          source={{
            uri: modalImg.webformatURL,
          }}
        />
        <Text>Like:{modalImg.Like}</Text>
        <Text>Tags:{modalImg.Tags}</Text>
        <Text>Comments:{modalImg.comments}</Text>
      </View>
      <Button
        onPress={toggleHandler}
        title={'show image'}
      />


      <SafeAreaView style={toggle ? styles.mainContainer : styles.modalOff}>
      <ScrollView style={styles.text}>
        { data.hits.map((el,index)=>{

         return  index>pagination ? false : (
            <View key={index} style={styles.container}>
              <Image
                style={styles.cardImg}
                source={{
                  uri: el.previewURL,
                }}
              />
              <Text>Tags:{el.tags}</Text>
              <Button
                title={"Узнать больше"}
                onPress= {() => setModalImg({ webformatURL: el.webformatURL,
                                                    Like:el.likes,
                                                    Tags:el.tags,
                                                    comments:el.comments}

                )}
              />
            </View>
          )
        })}
        <Button
        title={"показать больше!"}
        onPress={()=>setPagination(pagination+5)}
        />
        <Button
        title={"показать меньше!"}
        onPress={()=>setPagination(pagination-5)}
        />

      </ScrollView>
</SafeAreaView>
  </>
  );
}

const styles = StyleSheet.create({
  container: {
    display:"flex",
    alignItems: 'center',
    width: '100%',
    marginTop: 20
  },
  cardImg:{
    width:'100%',
    height:200,
  },
  mainContainer:{
    flex:1,
    marginTop:40,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    marginTop:50,
  },
  modalImg:{
    width:'100%',
    height:300,
  },
  modalOff:{
    display: 'none'
  },
});
