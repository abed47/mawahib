const TopTalents: React.FC<{items: any[]}> = props => {

    return (
        <div className="top-talents">
            <h2>Top Talents</h2>

            <div className="channel-list">
                {
                    props.items.map((item, i) => {
                        return (
                            <div className="channel-list-item" key={`top-talent-under-banner-list-item-${i}`}>
                                {
                                    item.live === 2 ? <div className="live"> Live </div> : ''
                                }
                                <img src={item.photo} alt="" />
                                <p className="name">{item.title}</p>
                                <p className="category">{item.category}</p>
                            </div>
                        );
                    })
                }
            </div>
        </div>
    )
}

export default TopTalents;