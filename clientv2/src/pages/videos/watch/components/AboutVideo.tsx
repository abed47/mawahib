import React from 'react';

const AboutVideo: React.FC<{description?: string}> = props => {

    return (
        <div className="about-video">
            <p>{props?.description}</p>
        </div>
    );
}

export default AboutVideo;