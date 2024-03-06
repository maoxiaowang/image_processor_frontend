import * as React from 'react';
import {useFormik} from 'formik';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {Grid} from "@mui/material";
import '../../assets/styles/auth/Login.css'
import {useNavigate} from 'react-router-dom';
import ROUTES from "../../config/route";
import {useSnackbar} from "../../context/useSnackbar";
import {useAuth} from "../../context/useAuth";
import Typography from "@mui/material/Typography";
import InputContainer from "../../components/InputContainer";
import DefaultBackdrop from "../../components/Backdrop/DefaultBackdrop";
import useBackdrop from "../../hooks/useBackdrop";


const LoginPage = () => {

    const {backdropOpen, openBackdrop, closeBackdrop} = useBackdrop();
    const {openSnackbar} = useSnackbar();
    const navigate = useNavigate();

    const auth = useAuth();

    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
        },
        onSubmit: async (values) => {
            openBackdrop();
            try {
                await auth.login(values.username, values.password)
                navigate(ROUTES.homePage, {replace: true})
            } catch (err) {
                openSnackbar('用户名不存在或密码错误', "error")
            } finally {
                closeBackdrop();
            }
        },
        validate: (values) => {
            const errors = {};

            if (!values.username) {
                errors.username = 'Username is required.';
            }

            if (!values.password) {
                errors.password = 'Password is required.';
            }

            return errors;
        },
    });

    return (
        <>
            {/* 遮罩层 */}
            <DefaultBackdrop open={backdropOpen}/>
            <Grid
                container
                justifyContent="center"
                alignItems="center"
                style={{height: '100vh'}}
            >
                <Grid item xs={8} sm={6} md={4} lg={3} xl={2}>
                    <Typography variant="h4" component={'h1'} sx={{marginY: 2}}>
                        Login
                    </Typography>
                    <form onSubmit={formik.handleSubmit}>
                        <InputContainer>
                            <TextField
                                label="Username"
                                type="text"
                                {...formik.getFieldProps('username')}
                                fullWidth
                                autoFocus
                            />
                            {formik.touched.username && formik.errors.username && (
                                <Typography variant="caption" color="error">
                                    {formik.errors.username}
                                </Typography>
                            )}

                        </InputContainer>
                        <InputContainer>
                            <TextField
                                label="Password"
                                type="password"
                                {...formik.getFieldProps('password')}
                                fullWidth
                            />
                            {formik.touched.password && formik.errors.password && (
                                <Typography variant="caption" color="error">
                                    {formik.errors.password}
                                </Typography>
                            )}
                        </InputContainer>
                        <InputContainer>
                            <Button variant="contained" color="primary" size="large" type="submit" sx={{width: '100%'}}>
                                Login
                            </Button>
                        </InputContainer>
                    </form>
                </Grid>
            </Grid>
        </>
    );
};


export default LoginPage;