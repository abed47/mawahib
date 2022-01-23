import React, { useState, useEffect, useRef } from 'react';
import { useCtx } from '../../utils/context';
import { Button, Tabs, Tab } from '@mui/material';
import { BsPinAngleFill } from 'react-icons/bs';

const CategoriesPage: React.FC = props => {

    const [dataList, setDataList] = useState<any[]>([]);
    const [editMode, setEditMode] = useState<boolean>(false);
    const [currentTab, setCurrentTab] = useState(0)

    const ctx = useCtx();
    const tab1Ref = useRef(null);
    const tab2Ref = useRef(null);
    const tab3Ref = useRef(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {};

    return (
        <div className="categories-page">
            <header>
                <h1 className="title">Categories</h1>

                <div className="tabs-selector">
                    <div className="tab" ref={tab1Ref}>Tab 1</div>
                    <div className="tab" ref={tab2Ref}>Tab 2</div>
                    <div className="tab" ref={tab3Ref}>Tab 3</div>
                    <div className="underLine"></div>
                </div>

                <div className="actions">
                    <Button className="btn primary-gradient">Save</Button>
                    <Button className="btn primary-gradient">Cancel</Button>
                    <Button className="btn primary-gradient"> <BsPinAngleFill className='mr-2' /> Pin Category</Button>
                </div>
            </header>
        </div>
    );
}

export default CategoriesPage;