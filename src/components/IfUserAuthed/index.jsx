import { useSelector } from 'react-redux'

export default function IfUserAuthed({ children }) {
    const user = useSelector(state => state.user);

    return <>{ user?.uid && children }</>;
} 