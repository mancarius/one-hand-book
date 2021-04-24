import { useDispatch, useSelector } from "react-redux";
import { List, ListItem, ListItemText, ListItemSecondaryAction } from '@material-ui/core';
import VpnKeyRoundedIcon from '@material-ui/icons/VpnKeyRounded';
import ExitToAppRoundedIcon from '@material-ui/icons/ExitToAppRounded';
import action from '../../redux/actions'


function ListItemLink(props) {
  return <ListItem button component="a" {...props} />;
}


/**
 * Return a React component that contain a list with user related navigation
 */
export default function UserNav({ closePopover = ()=>{} }) {
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();

    function Logout() {
        dispatch( action.user.logout() );
    }

    return (
        <List aria-label="main user nav" onClick={closePopover} style={{minWidth: '10rem'}}>
            {
                user.uid ?
                    <>
                        <ListItem onClick={Logout}>
                            <ListItemText primary="Sign-out" />
                            <ListItemSecondaryAction><ExitToAppRoundedIcon /></ListItemSecondaryAction>
                        </ListItem>
                    </>
                    :
                    <>
                        <ListItemLink href="/auth">
                            <ListItemText primary="Sign-in" />
                            <ListItemSecondaryAction><VpnKeyRoundedIcon /></ListItemSecondaryAction>
                        </ListItemLink>
                    </>
            }
        </List>
    );
}