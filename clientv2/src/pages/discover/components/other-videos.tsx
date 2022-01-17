const OtherVideos: React.FC<{items: any[]}> = props => {

    return (
        <div className="other-videos">
            <h2>Other</h2>

            <div className="other-video-list">
                {
                    props.items.map(((item, i) => {
                        return (
                            <div className="list-item" key={`other-video-list-item-${i}`}>
                                <img src={item.thumbnail} alt="" />

                                <div className="info">
                                    <p className="title">
                                        {item.title}
                                    </p>

                                    <div className="row">
                                        <p className="channel">
                                            {item.channel}
                                        </p>
                                        <p className="views">
                                            {item.views} views
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    }))
                }
            </div>
        </div>
    );
}

export default OtherVideos;