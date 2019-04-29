import Vue from 'vue'
import Vuex from 'vuex'

import firebase from 'firebase/app'
import 'firebase/database'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    rooms: [],
    roomsObj: {},
    playlist: [],
    user: null
  },
  mutations: {
    setRooms (state, payload) {
      state.rooms = payload
    },
    setRoomsObj (state, payload) {
      state.roomsObj = payload
    },
    setPlaylist (state, payload) {
      state.playlist = payload
    },
    setUser (state, payload) {
      state.signup = payload
    }
  },
  actions: {
    listenRooms ({ commit }, payload) {
      firebase.database().ref('/rooms').on('value', snapshot => {
        let array = []
        let object = snapshot.val()
        Object.keys(object).forEach((key) => {
          array.push({ id: key, ...object[key] })
        })
        commit('setRooms', array)
        commit('setRoomsObj', object)
      })
    },
    addRoom ({ commit }, payload) {
      let newPostRef = firebase.database().ref('rooms').push()
      let update = {
        name: payload.name,
        description: payload.description
      }
      newPostRef.set(update, error => {
        console.log(error)
      })
    },
    setSong ({ commit }, payload) {
      firebase.database().ref(`rooms/${payload.roomId}/song`).set({
        src: payload.src,
        title: payload.title,
        thumbnail: payload.thumbnail
      }, error => {
        console.log(error)
      })
    },
    getPlaylistForRoom ({ commit }, payload) {
      // firebase.database().ref(`playlists/${payload.roomId}`).
      // commit('setPlaylist', snapshot.val())
    },
    signUserUp ({ commit }, payload) {
      firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
        .then(
          user => {
            const newUser = {
              id: user.uid,
            }
            commit('setUser', newUser)
          }
        )
        .catch(
          error => {
            console.log(error)
          }
        )
    },
    signUserin ({commit}, payload) {
      firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
        .then(
          user => {
            const newUser = {
              id: user.uid
            }
            commit('setUser', newUser)
          }
        )
        .catch(
          error => {
            console.log(error)
          }
        )
    }
  },
  getters: {
    rooms (state) {
      return state.rooms
    },
    roomsObj (state) {
      return state.roomsObj
    },
    playlist (state) {
      return state.playlist
    },
    user (state) {
      return state.user
    }
  }
})
