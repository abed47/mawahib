import {Button, IconButton} from '@mui/material';
import {Share as ShareIcon} from '@mui/icons-material';
import Banner from './components/Banner';
import Banner2 from './components/Banner2';
import Banner3 from './components/Banner3';
const Home = () => {
    return (
        <div className="page-home">
            

            <div className="header">
                <h1>Tune in to the biggest event</h1>
                <h1> in arab talent history</h1>

                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Numquam sequi molestias aut eos exercitationem tenetur. Vitae dolores reprehenderit facere aliquam explicabo! Nulla iusto quaerat repellat enim officiis quos fugiat error.</p>
                
                <div className="actions">
                    <Button className="btn theme-gradient" variant="contained">Subscribe</Button>
                    <IconButton>
                        <ShareIcon className="btn text-primary" />
                    </IconButton>
                </div>
            
            </div>

                <Banner2 />

                {/* <Banner3 /> */}

        </div>
    );
}

export default Home;