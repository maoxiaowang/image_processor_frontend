import * as React from "react";
import {ListItemIcon, Menu, MenuItem} from "@mui/material";
import CropIcon from "@mui/icons-material/Crop";
import FlipIcon from "@mui/icons-material/FlipRounded";
import BlurIcon from "@mui/icons-material/BlurOn";
import RotateIcon from "@mui/icons-material/RotateLeft";

const RowActionMenu = (
    {
        rowId,
        menuAnchorEl,
        handleMenuClose,
        handleMenuItemClick
    }) => {
    return (
        <Menu
            id={`actions-menu-${rowId}`}
            anchorEl={menuAnchorEl[rowId]}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={Boolean(menuAnchorEl[rowId])}
            onClose={(event, reason) => handleMenuClose(event, reason, rowId)}
        >
            <MenuItem
                onClick={(event) => handleMenuItemClick(event, 'crop', rowId)}>
                <ListItemIcon>
                    <CropIcon fontSize="small"/>
                </ListItemIcon>
                裁剪
            </MenuItem>
            <MenuItem
                onClick={(event) => handleMenuItemClick(event, 'flip', rowId)}>
                <ListItemIcon>
                    <FlipIcon fontSize="small"/>
                </ListItemIcon>
                翻转
            </MenuItem>
            <MenuItem
                onClick={(event) => handleMenuItemClick(event, 'blur', rowId)}>
                <ListItemIcon>
                    <BlurIcon fontSize="small"/>
                </ListItemIcon>
                模糊
            </MenuItem>
            <MenuItem
                onClick={(event) => handleMenuItemClick(event, 'rotate', rowId)}>
                <ListItemIcon>
                    <RotateIcon fontSize="small"/>
                </ListItemIcon>
                旋转
            </MenuItem>
        </Menu>
    )
}

export default React.memo(P)
