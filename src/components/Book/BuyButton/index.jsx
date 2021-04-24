import React, { useState, useEffect, useCallback } from 'react'
import { BookContext } from '../../BookContextProvider'
import Price from '../Price'
import BookActions from '../../BookActions'
import { Dialog, DialogActions, DialogContent, DialogContentText, Button } from '@material-ui/core';

const BuyButton = React.memo(({ ebook, variant = "contained", color = "primary" }) => {
    const [open, setOpen] = useState(false);
    const [countdown, setCountdown] = useState(9);
    const timer = React.useRef(null);
    const { volume } = React.useContext(BookContext);
    const saleability = (() => {
        const forSale = volume.saleInfo?.saleability === "FOR_SALE";
        const isEbook = ebook ? volume.saleInfo?.isEbook ?? false : true;
        return forSale && isEbook;
    })();
    const isPurchased = volume.userInfo?.isPurchased ?? false;


    const redirect = useCallback(() => {
      window.location.href = volume.saleInfo.buyLink;
    }, [volume.saleInfo.buyLink]);

    const handleClickOpen = () => {
        setOpen(true);
        setCountdown(9);
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        open
            ?
            timer.current = setInterval(() => setCountdown(prev => prev - 1), 1000)
            :
            clearInterval(timer.current);
    }, [open]);


    useEffect(() => {
        // redirect to link on countdown end
        if (countdown <= 0) {
            clearInterval(timer.current);
            redirect();
        }
    }, [countdown, redirect]);


    return (
        isPurchased
            ?
            <BookActions.DownloadButton variant="contained" color="primary">Download</BookActions.DownloadButton>
            :
            saleability
                ?
                <>
                    <Button variant={variant} color={color} onClick={handleClickOpen}>
                        {ebook ? 'Ebook' : 'Buy'} <Price saleInfo={volume.saleInfo} />
                    </Button>
                    <Dialog
                        open={open}
                        onClose={handleClose}
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                To perform the purchase, will be redirect to google books site.
                        </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose} color="primary">
                                Discard
                        </Button>
                            <Button onClick={redirect} color="primary" autoFocus>
                                Continue ({countdown})
                        </Button>
                        </DialogActions>
                    </Dialog>
                </>
                :
                <Button variant={'outlined'} color={color} disabled>Not available</Button>
    );
});

export default BuyButton;