/* eslint-disable import/no-anonymous-default-export */
import FavoriteButton from './FavoriteButton';
import ToReadButton from './ToReadButton'
import DownloadButton from './DownloadButton'
function BookActions() {
    return <></>;
}

BookActions.FavoriteButton = FavoriteButton;
BookActions.ToReadButton = ToReadButton;
BookActions.DownloadButton = DownloadButton;


export default BookActions;

export { FavoriteButton, ToReadButton, DownloadButton };