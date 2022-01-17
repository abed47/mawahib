const HomeRecommendedVideos: React.FC<{items: any[]}> = props => {

    return (
        <div className="recommended-videos">
            <h2>Recommended For You</h2>
            
            <div className="recommended-video-list">
                {
                    props.items.map((item, i) => {
                        if(i < 6) return (
                            <div className="list-item" key={`recommended-video-list-item-${i}`}>
                                <img src={item.thumbnail} alt="video thumb" />
                                <div className="info">
                                    <p className="title">{item.title}</p>
                                    <div className="row">
                                        <p className="channel">{item.channel}</p>
                                        <p className="views">{item.views} views</p>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>

            {
                props.items.length > 5 ? 
                <div className="show-all">
                    <hr />
                    <p>Show All</p>
                    <hr />
                </div> :
                <span></span>
            }
        </div>
    );
}

export default HomeRecommendedVideos;