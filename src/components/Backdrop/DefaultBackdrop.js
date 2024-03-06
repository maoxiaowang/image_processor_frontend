import React from "react";
import {Backdrop, CircularProgress} from "@mui/material";
import Typography from "@mui/material/Typography";

const DefaultBackdrop = React.memo(({open, message}) => {
        return (
            <Backdrop open={open} sx={{zIndex: (theme) => theme.zIndex.drawer + 101}}>
                {/* Modal 1300, Drawer 1200 */}
                <CircularProgress sx={{color: "#fff"}}/>
                {message && <Typography sx={{color: '#fff', marginLeft: 2}}>{message}</Typography>}
            </Backdrop>
        )
    });

export default DefaultBackdrop;