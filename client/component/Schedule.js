import React, { useEffect, useState } from "react";
import { View, Button, Text, StyleSheet, FlatList, Alert, Image, Linking } from "react-native";
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, StackActions } from '@react-navigation/native';
import axios from "axios";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons } from '@expo/vector-icons';
import ScheduleAdd from "./ScheduleAdd";
import Modify from "./Modify";
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/FontAwesome';
// import Icon from 'react-native-vector-icons/Feather';


function GetSchedule({ id, navigation, update, setUpdate }) {
  const [data, setData] = useState([]);
  const [curData, setCurData] = useState("");

  const otherBanks = () =>
    Alert.alert(
      "은행 선택",
      "",
      [
        {
          text: "우리은행",
          onPress: () => Linking.openURL("SmartBank2WIB://"),
        },
        {
          text: "신한은행", 
          onPress: () => Linking.openURL("sbankmoasign://")
        },
        {
          text: "국민은행", 
          onPress: () => Linking.openURL("kbStarbank://")
        },
        {
          text: "농협은행", 
          onPress: () => Linking.openURL("newsmartbanking://")
        },
        {
          text: "기업은행", 
          onPress: () => Linking.openURL("ibksmartbanking://")
        },
        {
          text: "취소",
          onPress: () => console.log("cancel"),
          style: "cancel"
        },
        
      ],
    );
  
  const createAlert = (item) =>
    Alert.alert(
      "추가 및 삭제",
      "",
      [
        {
          text: "Cancel",
          onPress: () => console.log("cancel"),
          style: "cancel"
        },
        {
          text: "Edit", onPress: () => {
            handleModify(item);
          }
        },
        {
          text: "Remove",
          onPress: () => {
            handleRemove(item.id);
          }
        },
      ],
      { cancelable: false }
    );


  function handleRemove(item) {
    console.log(item)
    axios.delete(`https://don-forget-server.com/schedule/${id}`, {
      params: {
        schedule_id: item
      }
    })
      .then((res) => res.data)
      .then(() => {
        console.log(data);
        setUpdate(true);
      })
  }

  function handleModify(item) {
    console.log(item);
    navigation.navigate("Modify", { data: item })
  }

  function getSchedule() {
    axios.get(`https://don-forget-server.com/schedule/${id}`)
      .then((res) => res.data)
      .then((info) => {
        info = info.sort(function (a, b) {
          return new Date(a.date) - new Date(b.date);
        });
        return info
      })
      .then((info) => {
        setData(info);
      })
      .catch((err) => console.log("err!!!"))
  }

  useEffect(() => {
    if (update) {
      getSchedule();
      setUpdate(false);
    }
  });

  console.log(data);
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.icon} onPress={() => {
        navigation.navigate("ScheduleAdd")
      }}>
        <Text style={styles.addText}>Add Schedule + </Text>
      </TouchableOpacity>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <>
            <TouchableOpacity style={styles.list} onPress={() => {
              createAlert(item);
            }}>
                <Text style={styles.date}>{(item.date).slice(5, 7)} / {(item.date).slice(8, 10)} </Text>
              <Text style={styles[item.type]}>{item.giveandtake === "give" ? "|→ " : "|← "}</Text>
              <Text style={styles.text}>{item.event_target}</Text>
              <Text style={styles.textType}>{item.type}</Text>
              <Text style={styles.gift}>{item.gift.slice(0, 2) === "선물" ?
                " " + item.gift.slice(3) : " ₩" + item.gift.slice(3)}</Text>
            </TouchableOpacity>
          </>)}
      />
      <ActionButton buttonColor="#3b23a6" renderIcon={active => active ? (<Icon name="plus" style={styles.actionButtonIcon} /> ) : (<Icon name="won" style={styles.actionButtonIcon} />)}>
          <ActionButton.Item buttonColor='rgb(254, 228, 9)' title="카카오뱅크" onPress={() => Linking.openURL("kakaobank://")}>
            <Image style={styles.kakao} source={require('../../client/kakaobank_app.png')}/>
          </ActionButton.Item>
          <ActionButton.Item buttonColor='rgb(246, 246, 246)' title="토스" onPress={() => Linking.openURL("supertoss://")}>
            <Image style={styles.toss} source={require('../../client/toss_app.png')}/>
          </ActionButton.Item>
          <ActionButton.Item buttonColor='#1abc9c' title="기타 은행" onPress={() => {otherBanks();}}>
            <Icon style={styles.others} name="ellipsis-h" />
          </ActionButton.Item>

        </ActionButton>
    </View>
    
  )
}

const ScheduleStack = createStackNavigator();

export default function Schedule({ id }) {
  //데이터가 변경되면 reload
  const [update, setUpdate] = useState(true);

  return (
    <>
      <ScheduleStack.Navigator initialRouteName="GetSchedule">
        <ScheduleStack.Screen name="GetSchedule" options={{ title: 'Schedule' }} >
          {(props) => <GetSchedule {...props} id={id} setUpdate={setUpdate} update={update} />}
        </ScheduleStack.Screen>
        <ScheduleStack.Screen name="ScheduleAdd" options={{ title: '스케쥴 추가하기' }} >
          {(props) => <ScheduleAdd {...props} id={id} setUpdate={setUpdate} />}
        </ScheduleStack.Screen>
        <ScheduleStack.Screen name="Modify" options={{ title: '스케쥴 추가하기' }} >
          {(props) => <Modify {...props} userId={id} setUpdate={setUpdate} />}
        </ScheduleStack.Screen>
      </ScheduleStack.Navigator>
    </>
  )

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    backgroundColor: "white",
  },
  list: {
    position: "relative",
    margin: 10,
    width: "95%",
    borderBottomWidth: 1,
    borderColor: "white",
    backgroundColor: "white",
    borderRadius: 10,
    shadowRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    padding: 10,
    paddingLeft: 20,
    elevation: 7,
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: "8%",
  },
  생일: {
    fontSize: 20,
    color: "#FFB65B",
    fontWeight: "800",
  },
  결혼식: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFCECE"
  },
  장례식: {
    fontSize: 20,
    fontWeight: "800",
    color: "#737272"
  },
  집들이: {
    fontSize: 20,
    fontWeight: "800",
    color: "#6BACF8"
  },
  취직: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFF00C"
  },
  입학: {
    fontSize: 20,
    fontWeight: "800",
    color: "#A4F256"
  },
  돌잔치: {
    fontSize: 20,
    fontWeight: "800",
    color: "#97ECCF"
  },
  기념일: {
    fontSize: 20,
    fontWeight: "800",
    color: "#E1C5FF"
  },
  기타: {
    fontSize: 20,
    fontWeight: "800",
    color: "#CECECE"
  },
  text: {
    fontSize: 17,
    paddingLeft: 10,
    fontWeight: "600"
  },
  gift: {
    position: "relative",
    left: "90%",
    top: "100%",
    fontSize: 18,
    color: "grey"
  },
  date: {
    fontWeight: "200",
    fontSize: 20,
    position: "relative",
    top: "50%"
  },
  icon: {
    position: "relative",
    left : "25%",
    backgroundColor : "#759aff",
    padding : "4%",
    borderRadius : 30,
    // width : "100%",
    // height : "35%",
    width : "50%",
    alignItems : "center"
  },
  addText : {
    color : "white",
    fontWeight : "800",
  },
  textType : {
    position : "relative",
    fontSize: 16,
    paddingLeft: 10,
    paddingTop : 3,
    fontWeight: "300",
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
  kakao: {
    height: 40,
    width: 40
  },
  toss: {
    height: 50,
    width: 50
  },
  others: {
    fontSize: 25
  }
})