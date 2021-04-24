import SearchRoundedIcon from '@material-ui/icons/SearchRounded';
import { Avatar, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { useHistory } from 'react-router-dom' 




export default function ExploreLink({ item, children, folder = "", secondary = "" }) {
    const history = useHistory();
    const path = '/search?q='+folder+':' + encodeURI(item.toLowerCase().replaceAll(' ', '+'));

    return <ListItem button onClick={() => history.push(path)}>
        <ListItemIcon>
            <Avatar style={{backgroundColor:'transparent', color:'inherit'}}>
                <SearchRoundedIcon />
            </Avatar>
        </ListItemIcon>
        <ListItemText primary={children + item} secondary={secondary} />
    </ListItem>;
}