import React, { useState, useEffect, useRef } from 'react';
import { useCtx } from '../../utils/context';
import { Button, CircularProgress } from '@mui/material';
import { BsPinAngleFill } from 'react-icons/bs';
import { CategoryRequests, getServerPhoto } from '../../utils/services/request';
import { FaCheck } from 'react-icons/fa';
import * as store from '../../utils/services/store';
import { useNavigate } from 'react-router-dom';

const CategoriesPage: React.FC = props => {

    const [dataList, setDataList] = useState<any[]>([]);
    const [editMode, setEditMode] = useState<boolean>(false);
    const [currentTab, setCurrentTab] = useState(0);
    const [processing, setProcessing] = useState(false);
    const [pinnedCategories, setPinnedCategories] = useState<any[]>([]);

    const ctx = useCtx();
    const navigate = useNavigate();
    const tab1Ref = useRef<HTMLDivElement>(null);
    const bottomLineRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        getPinnedCategories();
        handleMounted();
    };

    const getPinnedCategories = () => {
        let pinned: any = store.getItem('pinnedCategories');
        setPinnedCategories( pinned && pinned.length ? JSON.parse(pinned) : []);
    }

    const handleMounted = () => {
        if(bottomLineRef?.current?.style) bottomLineRef.current.style.left = tab1Ref.current?.offsetLeft + 'px';
        if(bottomLineRef?.current?.style && tab1Ref?.current) bottomLineRef.current.style.top = (tab1Ref.current?.offsetTop  + tab1Ref.current?.clientHeight) + 'px';
        if(bottomLineRef?.current?.style) bottomLineRef.current.style.width = tab1Ref.current?.clientWidth + 'px';
        setCurrentTab(0)
        loadTabData(0);
    }

    const handleTabChange = (e: React.MouseEvent<HTMLDivElement>, i: number) => {
        if(bottomLineRef?.current) bottomLineRef.current.style.left = e.currentTarget.offsetLeft + 'px';
        if(bottomLineRef?.current) bottomLineRef.current.style.width = e.currentTarget.clientWidth + 'px';
        if(bottomLineRef?.current) bottomLineRef.current.style.top = (e.currentTarget.offsetTop + e.currentTarget.clientHeight )+ 'px'
        setCurrentTab(i);
        loadTabData(i);
    }

    const handleEnterEditMode = () => {
        setEditMode(true);
    }

    const loadTabData = async (i: number) => {
        setDataList([])
        if(i === 0) {
            try{
                setProcessing(true);
                let res = await CategoryRequests.getMostViewed();
                setProcessing(false);

                if(res && res?.status){
                    setDataList(res.data);
                    return;
                }

                if(res && res?.status === false){
                    ctx.showSnackbar(res?.message || 'server error', 'error');
                }
            }catch(err: any){
                ctx.hidePreloader()
                ctx.showSnackbar(err?.message || 'server error', 'error');
            }
        };
        if(i === 1) {
            try{
                setProcessing(true);
                let res = await CategoryRequests.getNew();
                setProcessing(false);

                if(res && res?.status){
                    setDataList(res.data);
                    return;
                }

                if(res && res?.status === false){
                    ctx.showSnackbar(res?.message || 'server error', 'error');
                }
            }catch(err: any){
                ctx.hidePreloader()
                ctx.showSnackbar(err?.message || 'server error', 'error');
            }
        };
        if(i === 2) {
            try{
                setProcessing(true);
                let res = await CategoryRequests.getPopular();
                setProcessing(false);

                if(res && res?.status){
                    setDataList(res.data);
                    return;
                }

                if(res && res?.status === false){
                    ctx.showSnackbar(res?.message || 'server error', 'error');
                }

            }catch(err: any){
                ctx.hidePreloader()
                ctx.showSnackbar(err?.message || 'server error', 'error');
            }
        };
    }

    const getItemCheckedState: (item: any) => boolean = (item) => {
        let filteredItems = pinnedCategories.filter(el => el.id === item.id);
        if(filteredItems.length) return true;
        return false;
    }

    const handleSave = () => {
        store.setItem('pinnedCategories', JSON.stringify(pinnedCategories));
        ctx.setPinnedCategories(pinnedCategories);
        setEditMode(false);
    }

    const handleCancel = () => {
        // getPinnedCategories();
        setEditMode(false);
    }

    const handleItemClick: (e: React.MouseEvent<HTMLDivElement>, item: any, index: number) => void = (e, item, index) => {
        if(editMode){
            let itemForDeleteIndex = 0;
            let filteredItems = pinnedCategories.filter((el, i) => {
                if(el.id === item.id) itemForDeleteIndex = i;
                return el.id === item.id
            });
            if(filteredItems.length) {
                let newArr = [...pinnedCategories];
                newArr.splice(itemForDeleteIndex, 1);
                setPinnedCategories(newArr);
                return;
            };
            let newArr = [...pinnedCategories];
            newArr.push(item);
            setPinnedCategories(newArr);
            return;
        }

        navigate('/category/' + item.id);
    }

    return (
        <div className="categories-page">
            <header>
                <div className="left-side">
                    <h1 className="title">Categories</h1>

                    <div className="tabs-selector">
                        <div className={`tab ${currentTab === 0 ? 'active' : ''}`} ref={tab1Ref} onClick={(e) => handleTabChange(e, 0)}>Top Viewed</div>
                        {/* <div className={`tab ${currentTab === 1 ? 'active' : ''}`} onClick={(e) => handleTabChange(e, 1)}>New Videos</div> */}
                        <div className={`tab ${currentTab === 2 ? 'active' : ''}`} onClick={(e) => handleTabChange(e, 2)}>Most Popular</div>
                        <div ref={bottomLineRef} className="underLine"></div>
                    </div>
                </div>

                <div className="actions">
                    {
                        editMode ? <>
                            <Button className="btn primary-gradient" onClick={handleSave}>Save</Button>
                            <Button className="btn primary-gradient" onClick={handleCancel}>Cancel</Button>
                        </> : null
                    }
                    <Button onClick={handleEnterEditMode} className="btn primary-gradient"> <BsPinAngleFill className='mr-2' /> Pin Category</Button>
                </div>
            </header>

            <main>
                <div className="category-tabs">
                    <div className={`loader ${processing ? 'active' : ''}`}><CircularProgress className='progress' /></div>
                    <div className={`tab-content ${currentTab === 0 && !processing ? 'active' : ''}`}>
                        {
                            dataList.map((item, index) => {
                                return (
                                    <div className="category-card" key={`most-viewed-${index}`} onClick={(e) => handleItemClick(e, item, index)}>
                                        <img src={getServerPhoto(item.photo)} alt="category" />
                                        <div className="title">
                                            <p>{item.name}</p>
                                        </div>

                                        {
                                            editMode ? <div className={`mawahib-checkbox-1 ${getItemCheckedState(item) ? 'checked' : ''}`}> <FaCheck className='check-icon'/> </div> : null
                                        }
                                    </div>
                                );
                            })
                        }
                    </div>
                    <div className={`tab-content ${currentTab === 1 && !processing ? 'active' : ''}`}>
                        {
                            dataList.map((item, index) => {
                                return (
                                    <div className="category-card" key={`new-videos-${index}`} onClick={(e) => handleItemClick(e, item, index)}>
                                        <img src={getServerPhoto(item.photo)} alt="category" />
                                        <div className="title">
                                            <p>{item.name}</p>
                                        </div>

                                        {
                                            editMode ? <div className={`mawahib-checkbox-1 ${getItemCheckedState(item) ? 'checked' : ''}`}> <FaCheck className='check-icon'/> </div> : null
                                        }
                                    </div>
                                );
                            })
                        }
                    </div>
                    <div className={`tab-content ${currentTab === 2 && !processing ? 'active' : ''}`}>
                        {
                            dataList.map((item, index) => {
                                return (
                                    <div className="category-card" key={`most-popular-${index}`} onClick={(e) => handleItemClick(e, item, index)}>
                                        <img src={getServerPhoto(item.photo)} alt="category" />
                                        <div className="title">
                                            <p>{item.name}</p>
                                        </div>

                                        {
                                            editMode ? <div className={`mawahib-checkbox-1 ${getItemCheckedState(item) ? 'checked' : ''}`}> <FaCheck className='check-icon'/> </div> : null
                                        }
                                    </div>
                                );
                            })
                        }
                    </div>
                </div>
            </main>
        </div>
    );
}

export default CategoriesPage;