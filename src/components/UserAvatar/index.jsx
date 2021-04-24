import React from 'react'
import { useSelector } from "react-redux";
import { FaceTwoTone } from '@material-ui/icons'
import Avatar from '@material-ui/core/Avatar'


/**
 * Return an Avatar component for the user, based on auth status.
 * If authed -> user photo,
 * else -> generic icon.
 * Accept childrens
 */
export default function UserAvatar(props) {
    const user = useSelector((state) => state.user);

    return user.uid
            ?
            <Avatar alt={user.displayName} src={user.photoURL} { ...props } /> 
            :
            <Avatar { ...props }>
                {React.Children.toArray(props.children).length > 0 ? props.children : <FaceTwoTone />}
            </Avatar>
}