import { useAuth0 } from "@auth0/auth0-react";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { useEffect, useState } from 'react';

const theme = createTheme();

const Album = () => {
    const { user, isAuthenticated, isLoading } = useAuth0();
    const { logout } = useAuth0();

    const [visible, setVisible] = React.useState(true);
    const [status, setStatus] = React.useState('No image');
    const [size, setSize] = React.useState('');
    const [dim, setDim] = React.useState('');
    const [time, setTime] = React.useState('');
    const [picture, setPicture] = React.useState(null);
    const [imgData, setImgData] = React.useState(null);

    if (isAuthenticated && status === 'No image') {
        fetch("https://eq9lycfst4.execute-api.us-east-1.amazonaws.com/submit/" + user.email, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setImgData("https://cloud-project-2.s3.amazonaws.com/img/" + data.Item.name);
                const img = new Image();
                img.src = "https://cloud-project-2.s3.amazonaws.com/img/" + data.Item.name;
                setStatus("Image Uploaded");
                setDim(data.Item.dim);
                setSize(data.Item.size);
                setTime(data.Item.time);
            }
            )
            .catch(err => {
                console.log(err);
            }
            );
    }


    function previewImg(e) {
        if (e.target.files[0]) {
            console.log("picture: ", e.target.files);
            setPicture(e.target.files[0]);
            const reader = new FileReader();
            reader.addEventListener("load", () => {
                //get width and height of image
                const img = new Image();
                img.src = reader.result;
                img.onload = () => {
                    setDim(img.width + "x" + img.height);
                };
                setStatus("Image Preview");
                setImgData(reader.result);
                setSize((e.target.files[0].size / 1024).toFixed(2));
                setTime((new Date()).toLocaleString());
            });
            reader.readAsDataURL(e.target.files[0]);
        }

    }

    function upload() {
        if (picture) {
            //get img name
            const imgName = picture.name;

            fetch("https://eq9lycfst4.execute-api.us-east-1.amazonaws.com/submit", {
                method: "PUT",
                body: JSON.stringify({
                    userID: user.email,
                    name: imgName,
                    size: size,
                    dim: dim,
                    time: time
                }),
            })
                .then(res => res.json())
                .then(data => {
                    console.log(data);
                    setStatus("Image Uploaded");

                    //put binary data to s3
                    fetch("https://h3dxr2ypl4.execute-api.us-east-1.amazonaws.com/dev/cloud-project-2/img" + imgName, {
                        method: "PUT",
                        body: picture,
                        headers: {
                            "Content-Type": "application/octet-stream",
                            "Access-Control-Allow-Origin": "*",
                            "Access-Control-Allow-Headers": "*",
                            "Access-Control-Allow-Methods": "*",
                            
                        }

                    })
                        .then(res => res.json())
                        .then(data => {
                            console.log(data);
                            setStatus("Image Uploaded");
                        }
                        )
                })
                .catch(err => {
                    console.log(err);
                });
            // fetch("https://api.cloudinary.com/v1_1/dxqjxqz5p/image/upload", {
            //     method: "POST",
            //     body: formData
            // })
            //     .then(res => res.json())
            //     .then(data => {
            //         console.log(data);
            //         setStatus("Image Uploaded");
            //     })
            //     .catch(err => {
            //         console.log(err);
            //     });
        }
    }




    if (isLoading) {
        return <div>Loading ...</div>;
    }
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppBar position="relative">
                <Toolbar>
                    {/* image profile */}
                    <img
                        src={user.picture}
                        alt={user.name}
                        style={{
                            borderRadius: '50%',
                            width: '50px',
                            height: '50px',
                            marginRight: '10px'
                        }}
                    />
                    {/* row */}
                    <Grid container rowSpacing={0} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                        <Grid item xs={12}>
                            <Typography variant="h6" color="inherit" noWrap>
                                {user.name}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography color="inherit" noWrap>
                                {user.email}
                            </Typography>
                        </Grid>
                    </Grid>

                    <Button
                        variant="contained"
                        color="secondary"
                        style={{
                            marginLeft: 'auto',
                            marginRight: '10px',
                            width: '100px',
                            height: '50px'
                        }}
                        onClick={() => logout({ returnTo: window.location.origin })}>
                        Log Out
                    </Button>

                </Toolbar>
            </AppBar>
            <main>
                {/* Hero unit */}
                <Box>
                    <Container maxWidth="sm">
                        <Typography
                            component="h1"
                            variant="h2"
                            align="center"
                            color="text.primary"
                            gutterBottom
                        >
                            QUIZ
                        </Typography>
                        <Grid container rowSpacing={0} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                            <Grid item xs={12}>
                                <Typography variant="h6" color="inherit" noWrap>
                                    จงอัปโหลดไฟล์ที่มีเงื่อนไขตรงตามต่อไปนี้
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="h6" color="inherit" noWrap>
                                    1. ไฟล์ต้องเป็นไฟล์รูปภาพ JPG เท่านั้น
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="h6" color="inherit" noWrap>
                                    2. ไฟล์ต้องมีขนาดไม่เกิน 50 kb
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="h6" color="inherit" noWrap>
                                    3. ไฟล์ต้องมีขนาดไม่เกิน 200x200 px
                                </Typography>
                            </Grid>
                        </Grid>
                    </Container>
                </Box>
                <Container sx={{ py: 4 }} maxWidth="md">
                    <Stack spacing={2} direction="row">
                        <TextField
                            id="outlined-basic"
                            variant="outlined"
                            type={'file'}
                            accept="image/*"
                            style={{
                                width: '100%',
                                height: '50px'
                            }}
                            onChange={(e) => previewImg(e)}

                        />
                        <Button
                            variant="contained"
                            color="primary"
                            style={{
                                width: '100px',
                                height: '50px'
                            }}
                            onClick={() => upload()}
                        >
                            ส่ง
                        </Button>
                    </Stack>

                    <Stack
                        sx={{ py: 4 }}
                        style={
                            {
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                visibility: visible ? 'visible' : 'hidden'
                            }
                        }
                        spacing={2}
                        direction="row">
                        {/* img */}
                        <Card
                            //center
                            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}

                        >
                            <CardMedia
                                component="img"
                                src={imgData}
                                style={{
                                    objectFit: 'fill',
                                    width: '200px',
                                    height: '200px',
                                }}
                                //center
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    {status}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    File type: {imgData == null ? "" : 'jpg'}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    File size: {imgData == null ? "" : size + ' bytes'}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    File dimension: {imgData == null ? "" : dim + ' px'}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Last updated: {imgData == null ? "" : time}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Stack>


                </Container>
            </main>
        </ThemeProvider>
    );
}

export default Album;

