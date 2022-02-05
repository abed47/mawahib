import { Button } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const VideoListing: React.FC = props => {

    const navigation = useNavigate();

    const navigateTo = (url: string) => {
        navigation(url);
    }


    return (
        <div className="page-video-listing">
            <header>
                <h1>Videos</h1>
                <Button className='btn secondary' onClick={() => navigateTo('/videos/upload')}>Upload</Button>
            </header>

            <hr />

            <main>

                <table>
                    <thead>
                        <tr>
                            <td><input type="checkbox" /></td>
                            <td>Video</td>
                            <td>Visibility</td>
                            <td>Views</td>
                            <td>Comments</td>
                            <td>Likes</td>
                        </tr>
                    </thead>
                </table>
            </main>
        </div>
    );
}

export default VideoListing;