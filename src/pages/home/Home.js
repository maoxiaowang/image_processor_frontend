import React from 'react';
import {Link as RouterLink} from 'react-router-dom';
import ROUTES from "../../config/route";
import ButtonAppBar from "../../components/AppBar";
import {Breadcrumbs, Card, CardContent, CardMedia, Grid} from "@mui/material";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import {Container} from "@mui/system";

const Home = () => {

    const SectionCard = ({title, description, image, link}) => {
        return (
            <Card>
                <CardMedia component="img" height="140" image={image} alt={title}/>
                <CardContent>
                    <Typography variant="h5" component="div" sx={{marginBottom: '0.4rem'}}>
                        {title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{marginBottom: '0.8rem'}}>
                        {description}
                    </Typography>
                    <Button component={RouterLink} to={link} variant="contained" color="primary">
                        Explore
                    </Button>
                </CardContent>
            </Card>
        );
    };

    const sections = [
        {
            title: 'Image',
            description: 'Explore the latest images.',
            image: process.env.PUBLIC_URL + '/images/cover_13.jpg',
            link: ROUTES.image.imageListPage,
        },
        {
            title: 'News',
            description: 'Read the latest news.',
            image: process.env.PUBLIC_URL + '/images/cover_18.jpg',
            link: '/news',
        },
        // Add more sections as needed
    ];

    return (
        <Container>
            <ButtonAppBar/>
            <Typography variant="h4" component={'h1'} sx={{marginY: 2}}>
                Home
            </Typography>
            <Breadcrumbs aria-label="breadcrumb" sx={{
                marginTop: theme => theme.spacing(1),
                marginBottom: theme => theme.spacing(2)
            }}>
                <Typography color="text.primary">Home</Typography>
            </Breadcrumbs>
            <Grid container spacing={3}>
                {sections.map((section, index) => (
                    <Grid item key={index} xs={12} sm={6} md={4}>
                        <SectionCard {...section} />
                    </Grid>
                ))}
            </Grid>

        </Container>
    )
}
export default Home;