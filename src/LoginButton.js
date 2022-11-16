import { useAuth0 } from "@auth0/auth0-react";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import React from "react";
import { useNavigate } from "react-router-dom";
const LoginButton = () => {
    const { loginWithRedirect } = useAuth0();

    const { user, isAuthenticated, isLoading } = useAuth0();
    let navigate = useNavigate()
    const theme = createTheme();

    if (isLoading) {
        return <div>Loading ...</div>;
    }

    if (isAuthenticated) {
        navigate('/Main')
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        loginWithRedirect();
      };


    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <Box component="form" noValidate sx={{ mt: 1 }}>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            onClick={handleSubmit}
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign In
                        </Button>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>

    )
};

export default LoginButton;