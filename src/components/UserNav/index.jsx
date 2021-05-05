import { useDispatch } from "react-redux";
import { Link, useHistory } from 'react-router-dom';
import { List, ListItem, ListItemText, ListItemSecondaryAction } from '@material-ui/core';
import VpnKeyRoundedIcon from '@material-ui/icons/VpnKeyRounded';
import ExitToAppRoundedIcon from '@material-ui/icons/ExitToAppRounded';
import action from '../../redux/actions'
import base_path from "../../helpers/base_path";
import firebase from '../../helpers/firebase'


function ListItemLink(props) {
  return <ListItem button component={Link} {...props} />;
}


/**
 * Return a React component that contain a list with user related navigation
 */
export default function UserNav({ closePopover = ()=>{} }) {
    const user = firebase.getCurrentUser();
    const history = useHistory();
    const dispatch = useDispatch();

    function Logout() {
        dispatch(action.user.logout());
        history.push(base_path);
    }

    return (
      <List
        aria-label="main user nav"
        onClick={closePopover}
        style={{ minWidth: "10rem" }}
      >
        {user?.uid ? (
          <>
            <ListItemLink onClick={Logout} to="#!">
              <ListItemText primary="Sign-out" />
              <ListItemSecondaryAction>
                <ExitToAppRoundedIcon />
              </ListItemSecondaryAction>
            </ListItemLink>
          </>
        ) : (
          <>
            <ListItemLink to={base_path + "/auth"}>
              <ListItemText primary="Sign-in" />
              <ListItemSecondaryAction>
                <VpnKeyRoundedIcon />
              </ListItemSecondaryAction>
            </ListItemLink>
          </>
        )}
      </List>
    );
}