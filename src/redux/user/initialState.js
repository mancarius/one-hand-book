/* eslint-disable import/no-anonymous-default-export */
import firebase from '../../helpers/firebase'

console.log('currentUser', firebase.getCurrentUser());
export default JSON.parse(localStorage.getItem("user")) || {}