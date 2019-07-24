import firebase from "firebase";

// 1.
class Fire {
  constructor() {
    this.init();
  }

  init = () =>
    firebase.initializeApp({
      apiKey: "AIzaSyDlIrY8lCukhELSgXvDPryoj01if4LfDu0",
      authDomain: "todo-f146f.firebaseapp.com",
      databaseURL: "https://todo-f146f.firebaseio.com",
      projectId: "todo-f146f",
      storageBucket: "",
      messagingSenderId: "704933002071",
      appId: "1:704933002071:web:c8a52a2b36abf12a"
    });


  create = data => {
    newPostKey = firebase
      .database()
      .ref("todo")
      .child("default")
      .push().key;

    var postData = {
      id: newPostKey,
      title: data.title,
      desc: data.desc,
      status: "active",
      category: data.category
    };

    var updates = {};
    updates["/todo/"+ "default/" + newPostKey] = postData;

    return firebase
      .database()
      .ref()
      .update(updates);
  };

  edit = data => {
    firebase
      .database()
      .ref("todo/"+ "default/" + data.id)
      .update({
        title: data.title,
        desc: data.desc,
        category: data.category
      });
  };

  active = data => {
    firebase
      .database()
      .ref("todo/"+ "default/" + data.id)
      .update({
        status: "done",
        title: data.title,
        desc: data.desc,
        category: data.category
      });
  };

  delete = data => {
    firebase
      .database()
      .ref("todo/"+ "default/" + data)
      .remove();
  };
}

Fire.shared = new Fire();
export default Fire;
