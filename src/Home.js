import React, { Component } from "react";
import {
  Container,
  Header,
  Input,
  Item,
  Title,
  Content,
  Button,
  Left,
  Right,
  Body,
  Icon,
  Text,
  Thumbnail,
  Fab,
  Spinner
} from "native-base";
import {
  StyleSheet,
  View,
  FlatList,
  Dimensions,
  TouchableHighlight,
  TouchableOpacity,
  Alert,
  Modal,
  Animated
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import firebase from "firebase";
import fire from "./Fire";

// import items from "../Asset/Items";

export default class Home extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    loading: true,
    modalVisible: false,
    data: []
  };

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  // refresh = () => {
  //   firebase
  //     .database()
  //     .ref("todo")
  //     .on("value", val => {
  //       this.setState({ data: val.val(), loading: false });
  //     });
  // };

  fetchData = () => {
    let dbRef = firebase
      .database()
      .ref("todo")
      .child("default");
    dbRef.on("value", snapshot => {
      let data = snapshot.val();
      let items = Object.values(data);
      this.setState({ data: items, loading: false });
    });
  };

  active = data => {
    fire.shared.active(data);

    // let data = {
    //   title: this.state.title,
    //   desc: this.state.desc,
    //   category: this.state.category
    // };
    // fire.shared.create(data);
  };

  componentWillMount() {
    this.fetchData();
  }
  renderLeftActions = (progress, dragX) => {
    const trans = dragX.interpolate({
      inputRange: [0, 50, 100, 101],
      outputRange: [-20, 0, 0, 1]
    });
    return (
      <TouchableOpacity
        style={[
          styles.itemContainer,
          {
            backgroundColor: "#C0EB6A",
            justifyContent: "center"
          }
        ]}
      >
        <Animated.Text
          style={[
            {
              transform: [{ translateX: trans }]
            }
          ]}
        >
          <Icon name="checkmark-circle-outline" />
        </Animated.Text>
      </TouchableOpacity>
    );
  };

  _keyExtractor = (item, index) => index;

  renderItem = ({ item }) => (
    <Swipeable
      onSwipeableLeftWillOpen={() => this.active(item)}
      renderLeftActions={this.renderLeftActions}
    >
      <TouchableOpacity
        onLongPress={() =>
          Alert.alert(
            "Delete Todo",
            "Are you sure will you delete this",
            [
              { text: "Cancel" },
              {
                text: "Ok",
                onPress: () => {
                  this.setState({ modalVisible: "visible" });
                  fire.shared.delete(item.id);
                }
              }
            ],
            { cancelable: false }
          )
        }
        onPress={() => this.props.navigation.navigate("Edit", item)}
        style={[
          styles.itemContainer,
          {
          backgroundColor:
            item.status == "active"
              ? "#2FC2DF"
              : item.status == "done"
              ? "#fad43e"
              : "black"
        }
        ]}
      >
        {/* <Text style={styles.itemDate}>{this.setDate(item.created_at)}</Text> */}
        <Text style={styles.itemTitle}>{item.title}</Text>

        <Text style={styles.itemCategory}>Category: {item.category}</Text>
        <Text numberOfLines={2} style={styles.itemText}>
          {item.desc}
        </Text>
      </TouchableOpacity>
    </Swipeable>
  );

  render() {
    return (
      <Container>
        <Header style={{ backgroundColor: "#ffffff" }}>
          <Body style={{ flex: 1, alignItems: "center" }}>
            <Title style={{ color: "#000000" }}>To Do List</Title>
          </Body>
        </Header>

        {/* Modal Sort */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => this.setModalVisible(!this.state.modalVisible)}
            style={{ flex: 1 }}
          >
            <View style={styles.modalSort}>
              <TouchableHighlight
                onPress={() => {
                  this.setModalVisible(!this.state.modalVisible);
                }}
              >
                <Text>ASCENDING</Text>
              </TouchableHighlight>
              <TouchableHighlight
                onPress={() => {
                  this.setModalVisible(!this.state.modalVisible);
                }}
              >
                <Text>DESCENDING</Text>
              </TouchableHighlight>
            </View>
          </TouchableOpacity>
        </Modal>

        <Content>
          {this.state.loading ? (
            <Spinner />
          ) : (
            <FlatList
              data={this.state.data}
              keyExtractor={this._keyExtractor}
              renderItem={this.renderItem}
              style={styles.gridView}
              numColumns={1}
              // onEndReachedThreshold={0.1}
              // onEndReached={this.pageNotes}
              // refreshing={this.state.refreshing}
              // onRefresh={() => {
              //   this.fetchData();
              //   this.setState({
              //     page: 1
              //   });
              // }}
            />
          )}
        </Content>
        <Fab
          direction="up"
          containerStyle={{}}
          style={{ backgroundColor: "#FFFCFC" }}
          position="bottomRight"
          onPress={() => this.props.navigation.navigate("Todo")}
        >
          <Icon name="md-add" style={{ color: "#000000" }} />
        </Fab>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  modalSort: {
    borderRadius: 5,
    marginTop: 55,
    right: 20,
    padding: 10,
    backgroundColor: "#fcfcfc",
    alignSelf: "flex-end",
    position: "absolute",
    elevation: 7
  },
  container: {
    flex: 1,
    marginVertical: 20
  },
  itemContainer: {
    justifyContent: "flex-start",
    borderRadius: 5,
    height: 70,
    margin: 10,
    flex: 1,
    elevation: 10
  },
  item: {
    backgroundColor: "#4D243D",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    margin: 1,
    height: Dimensions.get("window").width / 2 // approximate a square
  },
  itemInvisible: {
    backgroundColor: "transparent"
  },
  gridView: {
    marginTop: 20,
    flex: 1
  },

  itemDate: {
    alignSelf: "flex-end",
    marginRight: 5,
    color: "#FFFFFF",
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: 10,
    lineHeight: 14
  },
  itemTitle: {
    alignSelf: "center",
    marginLeft: 5,
    color: "#FFFFFF",
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: 18,
    lineHeight: 20
  },
  textSwipe: {},
  itemCategory: {
    alignSelf: "baseline",
    marginTop: 5,
    marginLeft: 5,
    color: "#FFFFFF",
    fontStyle: "normal",
    fontWeight: "600",
    fontSize: 12,
    lineHeight: 14
  },
  itemText: {
    alignSelf: "baseline",
    marginLeft: 5,
    marginTop: 5,
    color: "#FFFFFF",
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: 10,
    lineHeight: 14
  },
  itemCode: {
    fontWeight: "600",
    fontSize: 12,
    color: "#fff"
  }
});
