import { useContext, useEffect, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import { searchVideos, getVideoPublicPath, getVideoThumbnailPublicPath } from '../../../utils/services/request';
import { AuthContext } from '../../../utils/context/auth';
import { LayoutContext } from '../../../utils/context/layout';
// import OwlCarousel from 'react-owl-carousel2';
import PlaceHolder from '../../../assets/images/placeholder.jpg'
import { CarouselWrapper } from 'react-pretty-carousel';

const Banner3 = (props) => {

    const [videoList, setVideoList] = useState([]);

    const authCtx = useContext(AuthContext);
    const layoutCtx = useContext(LayoutContext);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        
        try{
            let res = await searchVideos({fields: {channel_id: 1}});
            
            if(res.status){
                setVideoList(res.data);
                return;
            }

            layoutCtx.showSnackBar('Error: ' + res.message, 'error')
        }catch(err){
            layoutCtx.showSnackBar('Error: ' + err.message, 'error')
        }
    }

    const handleHover = (e) => {
        console.log('mouse over')
    }

    const handleMouseOut = (e) => {
        console.log('mouse out')
    }

    return (
        <div className="home-banner">
            <CarouselWrapper items={3} mode="gallery">
                {/* {
                    videoList.map((v,i) => {
                        return (
                            // <div className="carousel-item" key={`banner_vid_${i}`} onMouseEnter={handleHover} onMouseOut={handleMouseOut}>
                                <img src={getVideoThumbnailPublicPath(v.thumbnail)} alt="" />
                            // </div>
                        );
                    })

                    
                } */}
               <div>
                <img src={PlaceHolder} alt="" width="200" />
               </div>
               <div>
                <img src={PlaceHolder} alt="" width="200" />
               </div>
               <div>
                <img src={PlaceHolder} alt="" width="200" />
               </div>
               <div>
                <img src={PlaceHolder} alt="" width="200" />
               </div>
                
            </CarouselWrapper>
        </div>
    );
}

export default Banner3;