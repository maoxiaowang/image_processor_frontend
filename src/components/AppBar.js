import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import ImageIcon from '@mui/icons-material/Image'
import NewsIcon from '@mui/icons-material/Newspaper'
import LogoutIcon from '@mui/icons-material/Logout';
import {useAuth} from "../context/useAuth";
import {Link as RouterLink} from 'react-router-dom'
import ROUTES from "../config/route";
import {Drawer, Link, List, ListItem, ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import {useEffect} from "react";

const ButtonAppBar = React.memo(() => {
    const {isAuthenticated, logout, username} = useAuth();

    const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setIsDrawerOpen(true);
    };

    const handleDrawerClose = () => {
        setIsDrawerOpen(false);
    };

    useEffect(() => {
        console.log('useEffect AppBar');
        // ... existing code
    }, []);

    return (
        <Box sx={{flexGrow: 1}}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{mr: 2}}
                        onClick={handleDrawerOpen}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>

                    </Typography>
                    {isAuthenticated ? (
                        <Typography color="inherit">Welcome, {username}
                            <IconButton
                                size="large"
                                edge="end"
                                color="inherit"
                                aria-label="logout"
                                sx={{mr: 2}}
                                onClick={logout}
                            >
                                <LogoutIcon/>
                            </IconButton>
                        </Typography>
                    ) : (
                        <Button component={RouterLink} to={ROUTES.auth.loginPage} color="inherit">Login</Button>
                    )}
                </Toolbar>
            </AppBar>

            {/* Drawer组件 */}
            <Drawer anchor="left" open={isDrawerOpen} onClose={handleDrawerClose}>
                <List sx={{width: 250}} role="presentation">
                    <ListItem>
                        <ListItemButton>
                            <ListItemIcon>
                                <HomeIcon/>
                            </ListItemIcon>
                            <Link component={RouterLink} underline="none" color="inherit" to={ROUTES.homePage}
                                  onClick={handleDrawerClose}>
                                <ListItemText primary='Home'/>
                            </Link>
                            {/*<ListItemText primary={'Home'}/>*/}
                        </ListItemButton>
                    </ListItem>

                    <ListItem>
                        <ListItemButton>
                            <ListItemIcon>
                                <ImageIcon/>
                            </ListItemIcon>
                            <Link component={RouterLink} underline="none" color="inherit" to={ROUTES.image.imageListPage}
                                  onClick={handleDrawerClose}>
                                <ListItemText primary='Image'/>
                            </Link>
                        </ListItemButton>
                    </ListItem>

                    <ListItem>
                        <ListItemButton>
                            <ListItemIcon>
                                <NewsIcon/>
                            </ListItemIcon>
                            <ListItemText primary={'News'}/>
                        </ListItemButton>
                    </ListItem>
                </List>
            </Drawer>
        </Box>
    );
});

export default ButtonAppBar;