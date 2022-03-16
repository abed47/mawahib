import React, { useLayoutEffect, useState, useRef } from 'react';
import { handlePhotoUrl } from '../../../utils/services/request';
interface ComponentProps {
    data: any[];
    setPlayerUrl: (e: any) => void;
};

const EventPerformances: React.FC<ComponentProps> = props => {

    const [dataList, setDataList] = useState<any[]>([]);
    const [tabCount, setTabCount] = useState(0);
    const [currentTab, setCurrentTab] = useState(0);
    const [tabContent, setTabContent] = useState<any[]>([])

    const bottomLineRef = useRef<HTMLDivElement>(null);
    const firstElRef = useRef<HTMLParagraphElement>(null);

    useLayoutEffect(() => {
        loadData();
    }, [bottomLineRef?.current, firstElRef?.current]);
    

    const loadData = () => {
        let l = props.data;
        setDataList(l);
        setTabCount(l.length);
        if(l.length){
            setTabContent(l[0].submissions);
        }
        handleMount();
    }

    const handleMount = () => {
        if(bottomLineRef?.current?.style) bottomLineRef.current.style.left = firstElRef.current?.offsetLeft + 'px';
        if(bottomLineRef?.current?.style && firstElRef?.current) bottomLineRef.current.style.top = (firstElRef.current?.offsetTop  + firstElRef.current?.clientHeight) + 'px';
        if(bottomLineRef?.current?.style) bottomLineRef.current.style.width = firstElRef.current?.clientWidth + 'px';
        setCurrentTab(0)
    }
    
    const handleTabChange = (e: any, item: any, i: number) => {
        setCurrentTab(i);
        if(bottomLineRef?.current?.style) bottomLineRef.current.style.left = e?.target.offsetLeft + 'px';
        if(bottomLineRef?.current?.style && firstElRef?.current) bottomLineRef.current.style.top = (e.target.offsetTop  + e.target.clientHeight) + 'px';
        if(bottomLineRef?.current?.style) bottomLineRef.current.style.width = e.target.clientWidth + 'px';

        setTabContent(item.submissions);
    }

    const handleItemClick = (e: any) => {
        props.setPlayerUrl(e);
    }

    return (
        <>
            {
                tabCount > 0 ?
                    <div className="event-performances">
                        <div className="tabs-titles">
                            {
                                dataList.map((item, index) => {
                                    return (
                                        <>
                                            {
                                                index === 0 ?
                                                <p onClick={(e) => handleTabChange(e, item, index)} className={`tab-title ${currentTab === index ? 'active': ''}`} ref={firstElRef} key={`tab-title-d-${index}`}>{item.title}</p> :
                                                <p onClick={(e) => handleTabChange(e, item, index)} className={`tab-title ${currentTab === index ? 'active': ''}`} key={`tab-title-d-${index}`}>{item.title}</p>
                                            }
                                        </>
                                    )
                                })
                            }
                            <div className="bottom-line" ref={bottomLineRef}></div>
                        </div>

                        <div className="event-performances-tab-contents">
                            <div className="event-performances-tab-content">
                                {
                                    tabContent.map((item: any, index: number) => {
                                        return (
                                            <div onClick={() => handleItemClick(item)} className="submission-list-item" key={`submission-list-item-${index}`}>
                                                <img src={handlePhotoUrl(item.video.thumbnail)} alt="" />

                                                <div className="info">
                                                    <div className="l">
                                                        <p>{item.video.title}</p>
                                                        <p>{item.channel.name}</p>
                                                    </div>
                                                    <p className="views"></p>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                : <div></div>
            }
        </>
    );
}

export default EventPerformances;