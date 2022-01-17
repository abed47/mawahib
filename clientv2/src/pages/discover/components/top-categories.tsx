const TopCategories: React.FC<{items: any[]}> = props => {
    return (
        <div className="top-categories">
            <h2>Top Categories</h2>

            <div className="category-list">
                {
                    props.items.map((item, i) => {
                        return (
                            <div className="list-item" key={`category-list-item-key-${i}`}>
                                <img src={item.photo} alt="category thumbnail" />
                                <div className="info">
                                    <p>{item.title}</p>
                                    <p>500 views</p>
                                </div>
                            </div>
                        );
                    })
                }
            </div>
        </div>
    );
}

export default TopCategories;