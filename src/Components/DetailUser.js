import React, { Component } from "react";
import {
  Container,
  Content,
  Button,
  Icon,
  Text,
  Header,
  Title,
  Left,
  Right,
  Body,
  Card,
  CardItem
} from "native-base";
import { StyleSheet, Alert, ToastAndroid } from "react-native";
import { USER_URL } from "../Config/URLs";
import { connect } from "react-redux";
import { logout } from "../Actions";
import axios from "axios";

class DetailUser extends Component {
  componentDidUpdate(prevProps) {
    const { user, navigation } = this.props;
    if (user !== prevProps.user) {
      const id = navigation.getParam("id");
      const data = user.find(data => data.id === id);
      if(!data)
        navigation.goBack();
    }
  }

  onRemove = () => {
    const { navigation, auth, logout } = this.props;
    const deleteHeader = {
      headers: {
        Authorization : `Bearer ${auth.access_token}`
      }
    };

    const id = navigation.getParam("id");

    axios.delete(`${USER_URL}/${id}`, deleteHeader)
    .then(response => {
      ToastAndroid.show("Anda berhasil menghapus pengurus", ToastAndroid.SHORT);
    })
    .catch(error => {
      if(!error.response) {
        ToastAndroid.show("Tidak bisa terhubung ke server", ToastAndroid.SHORT);
      } else if(error.response.status === 401) {
        ToastAndroid.show("Autentikasi gagal", ToastAndroid.SHORT);
        logout();
      }
    });
  };

  render() {
    const { navigation, user } = this.props;
    const id = navigation.getParam("id");
    const data = user.find(data => data.id === id)
    if(!data)
      return null;
    return (
      <Container>
        <Header>
          <Left style={{ flex: 1 }}>
            <Button
              onPress={() => navigation.goBack()}
              transparent
              rounded
            >
              <Icon name="close" />
            </Button>
          </Left>
          <Body style={{ flex: 3 }} />
          <Right style={{ flex: 1 }}>
            <Button
              onPress={() => navigation.navigate("EditUser", {id})}
              transparent
              rounded
            >
              <Icon name="create" />
            </Button>
            <Button
              onPress={() => Alert.alert(
                "Hapus Pengurus",
                "Apakah kamu benar ingin menghapus ?",
                [
                  {
                    text: "Ya",
                    onPress: this.onRemove
                  },
                  {
                    text: "Tidak"
                  }
                ]
              )}
              transparent
              rounded
            >
              <Icon name="trash" />
            </Button>
          </Right>
        </Header>
        <Content>
          <Card style={styles.card}>
            <CardItem>
              <Left>
                <Icon name="person" style={styles.icon} />
                <Text>{data.name}</Text>
              </Left>
            </CardItem>
            <CardItem>
              <Left>
                <Icon name="mail" style={styles.icon} />
                <Text>{data.email}</Text>
              </Left>
            </CardItem>
          </Card>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    marginTop: 0,
    marginBottom: 15
  },
  icon: {
    width: 30,
    color: "#777"
  }
});

const mapStateToProps = state => ({
  user: state.user,
  auth: state.auth
});

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DetailUser);
