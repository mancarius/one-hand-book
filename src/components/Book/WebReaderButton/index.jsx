import React from 'react'
import { Button } from '@material-ui/core'
import { BookContext } from '../../BookContextProvider'


export default function WebReaderButton({ variant = "outlined", color = "primary" }) {
    const { volume } = React.useContext(BookContext);
    const link = React.useCallback(() => {
        return volume.accessInfo?.webReaderLink ?? null;
    }, [volume])();
    const isSample = React.useCallback(() => {
        const accessViewStatus = volume.accessInfo?.accessViewStatus ?? 'SAMPLE';
        return accessViewStatus === "SAMPLE";
    }, [volume])();

    return link &&
        <Button
            variant={variant}
            color={color}
            onClick={() => {
                window.location.href = link;
            }}>
            Read {isSample ? 'Preview' : 'Online'}
        </Button>;
}