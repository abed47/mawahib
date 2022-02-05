import React, { useEffect, useRef, useState } from 'react'
import AboutVideo from './AboutVideo';
import RelatedVideos from './RelatedVideos';
import VideoComments from './VideoComments';

const ExtraInfoTabs: React.FC<any> = props => {

    const [currentTab, setCurrentTab] = useState(0);
    
    const bottomLineRef = useRef<HTMLDivElement>(null);
    const firstElRef = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        handleMount();
    },[]);

    const handleMount = () => {
        if(bottomLineRef?.current?.style) bottomLineRef.current.style.left = firstElRef.current?.offsetLeft + 'px';
        if(bottomLineRef?.current?.style && firstElRef?.current) bottomLineRef.current.style.top = (firstElRef.current?.offsetTop  + firstElRef.current?.clientHeight + 3) + 'px';
        if(bottomLineRef?.current?.style) bottomLineRef.current.style.width = firstElRef.current?.clientWidth + 'px';
        setCurrentTab(0)
    }

    const handleTabChange = (e: React.MouseEvent<HTMLHeadingElement, MouseEvent>, i: number) => {
        if(bottomLineRef?.current) bottomLineRef.current.style.left = e.currentTarget.offsetLeft + 'px';
        if(bottomLineRef?.current) bottomLineRef.current.style.width = e.currentTarget.clientWidth + 'px';
        if(bottomLineRef?.current) bottomLineRef.current.style.top = (e.currentTarget.offsetTop + e.currentTarget.clientHeight + 3 )+ 'px'
        setCurrentTab(i)
    }

    return (
        <div className="extra-info">
            <div className="tabs">

                <div className="tabs-header">
                    <div className="titles">
                        <h1 ref={firstElRef} className={`${currentTab === 0 ? 'active' : ''}`} onClick={ e => handleTabChange(e, 0)}>Related Videos</h1>
                        <h1 className={`${currentTab === 1 ? 'active' : ''}`} onClick={e => handleTabChange(e, 1)} >About Video</h1>
                        <h1 className={`${currentTab === 2 ? 'active' : ''}`} onClick={e => handleTabChange(e, 2)}>Comments</h1>
                    </div>
                    <div ref={bottomLineRef} className="bottom-bar"></div>
                </div>

                <div className={` ${currentTab === 0 ? 'active' : ''} tab-content`}>
                    <RelatedVideos videoId={props.videoId}  />
                </div>
                
                <div className={` ${currentTab === 1 ? 'active' : ''} tab-content`}>
                    <AboutVideo description={props?.data?.description} />
                </div>
                
                <div className={` ${currentTab === 2 ? 'active' : ''} tab-content`}>
                    <VideoComments videoId={props?.data?.id} />
                </div>

            </div>
        </div>
    );
}

export default ExtraInfoTabs;