import { useSelector } from 'react-redux'
import firebase from '../../helpers/firebase'

export default function IfUserAuthed({ children }) {
    const storedUser = useSelector(state => state.user);
    const firebaseUser = firebase.getCurrentUser();
    const isUserAuthed = (() => {
        if (!firebaseUser) return false;
        else
          return storedUser?.refreshToken === firebaseUser?.refreshToken;
    })();

    return <>{firebaseUser && children}</>;
} 