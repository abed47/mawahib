import React, { useState, useEffect, useRef } from 'react';
import { useCtx } from '../../utils/context';
import { Button, Tabs, Tab } from '@mui/material';
import { BsPinAngleFill } from 'react-icons/bs';

const CategoriesPage: React.FC = props => {

    const [dataList, setDataList] = useState<any[]>([]);
    const [editMode, setEditMode] = useState<boolean>(false);
    const [currentTab, setCurrentTab] = useState(0)

    const ctx = useCtx();
    const tab1Ref = useRef<HTMLDivElement>(null);
    const bottomLineRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        loadData();
        handleMounted();
    }, []);

    const loadData = async () => {};

    const handleMounted = () => {
        if(bottomLineRef?.current?.style) bottomLineRef.current.style.left = tab1Ref.current?.offsetLeft + 'px';
        if(bottomLineRef?.current?.style && tab1Ref?.current) bottomLineRef.current.style.top = (tab1Ref.current?.offsetTop  + tab1Ref.current?.clientHeight) + 'px';
        if(bottomLineRef?.current?.style) bottomLineRef.current.style.width = tab1Ref.current?.clientWidth + 'px';
        setCurrentTab(0)
    }

    const handleTabChange = (e: React.MouseEvent<HTMLDivElement>, i: number) => {
        if(bottomLineRef?.current) bottomLineRef.current.style.left = e.currentTarget.offsetLeft + 'px';
        if(bottomLineRef?.current) bottomLineRef.current.style.width = e.currentTarget.clientWidth + 'px';
        if(bottomLineRef?.current) bottomLineRef.current.style.top = (e.currentTarget.offsetTop + e.currentTarget.clientHeight )+ 'px'
        setCurrentTab(i);
        loadTabData(i);
    }

    const loadTabData = (i: number) => {
        if(i === 0) return;
        if(i === 1) return;
        if(i === 2) return;
    }

    return (
        <div className="categories-page">
            <header>
                <h1 className="title">Categories</h1>

                <div className="tabs-selector">
                    <div className="tab" ref={tab1Ref} onClick={(e) => handleTabChange(e, 0)}>Tab 1</div>
                    <div className="tab" onClick={(e) => handleTabChange(e, 1)}>Tab 2</div>
                    <div className="tab" onClick={(e) => handleTabChange(e, 2)}>Tab 3</div>
                    <div ref={bottomLineRef} className="underLine"></div>
                </div>

                <div className="actions">
                    <Button className="btn primary-gradient">Save</Button>
                    <Button className="btn primary-gradient">Cancel</Button>
                    <Button className="btn primary-gradient"> <BsPinAngleFill className='mr-2' /> Pin Category</Button>
                </div>
            </header>

            <main>
                <div className="tabs">
                    <div className={`tab-content ${currentTab === 0 ? 'active' : ''}`}>tab 1</div>
                    <div className={`tab-content ${currentTab === 1 ? 'active' : ''}`}>tab 2</div>
                    <div className={`tab-content ${currentTab === 2 ? 'active' : ''}`}>tab 3</div>
                </div>
            </main>
        </div>
    );
}

export default CategoriesPage;