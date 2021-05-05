import SearchRoundedIcon from '@material-ui/icons/SearchRounded';
import { Avatar, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import base_path from '../../../helpers/base_path';


export default function ExploreLink(props) {
    const { item, children, folder = "", secondary = "" } = props;
    const history = useHistory();
    const path = base_path + '/search?q='+folder+':' + encodeURI(item.toLowerCase().replaceAll(' ', '+'));

    return Boolean(item) && <ListItem button onClick={() => history.push(path)}>
        <ListItemIcon>
            <Avatar style={{backgroundColor:'transparent', color:'inherit'}}>
                <SearchRoundedIcon />
            </Avatar>
        </ListItemIcon>
        <ListItemText primary={children + item} secondary={secondary} />
    </ListItem>;
}