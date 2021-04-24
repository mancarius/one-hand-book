/* eslint-disable import/no-anonymous-default-export */
import React, { useState, useEffect, useContext, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useSnackbar } from 'notistack';
import { BookContext } from '../../BookContextProvider'
import styles from '../styles/index.module.css';
import { Menu, MenuItem, Link, Button } from '@material-ui/core';
import GetAppRoundedIcon from '@material-ui/icons/GetAppRounded';



export default function FavoriteButton({ children, color='default', variant='text', ...props }) {
    const user = useSelector(state => state.user);
    const { volume } = useContext(BookContext);
    const { epub, pdf } = volume?.accessInfo ?? {};
    const { isPurchased } = volume?.userInfo ?? false;
    const enabled = isPurchased && (Boolean(epub?.isAvailable) || Boolean(pdf?.isAvailable));
    const { enqueueSnackbar } = useSnackbar();
    const [anchorEl, setAnchorEl] = useState(null);

    const handleButtonClick = (event) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLinkClick = e => {
        e.preventDefault();
        handleClose();
        window.location.href = e.currentTarget.href;
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popper' : undefined;


    return (
        volume &&
        <>
            <Button
                variant={variant}
                color={color}
                aria-describedby={id}
                type="button"
                onClick={handleButtonClick}
                disabled={!enabled}
                startIcon={<GetAppRoundedIcon />}>
                {children}
            </Button>
            {
                enabled &&
                <Menu id={id} open={open} anchorEl={anchorEl} keepMounted onClose={handleClose}>
                    {
                        Boolean(epub?.isAvailable) &&
                        <MenuItem>
                            <Link href={epub.downloadLink} onClick={handleLinkClick}>Download ePub</Link>
                        </MenuItem>
                    }
                    {
                        Boolean(pdf?.isAvailable) &&
                        <MenuItem><Link href={pdf.downloadLink} onClick={handleLinkClick}>Download Pdf</Link></MenuItem>
                    }
                </Menu>
            }
        </>
    )
}