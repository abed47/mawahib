import React, { useEffect, useState } from 'react';
import { Box, Button, Input } from '@adminjs/design-system';
import moment from 'moment';
import axios from 'axios';
import {
    ActionsWrapper,
    CardsWrapper,
    CreateStageDialog,
    EventStageCard,
    moveToNextStageDialogStyles,
    StageCreateDialogStyles
} from './styles-components';
import Dialog from 'react-modal';
import Select from 'react-select';

import MoveToNextStageDialog from "./move-to-next-stage-dialog";
/**
 * @type {React.CSSProperties}
 */
const HeaderClass = {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flexWrap: 'wrap'
};

/**
 * @type {React.CSSProperties}
 */
const CardClass = {
    // padding: '20px',
    boxShadow: '1px 2px 6px rgba(0, 0, 0, .28)',
    boxSizing: 'border-box',
    margin: '10px 15px',
    width: '150px',
    height: '50px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'center',
    textAlign: 'center'
}

const hostUrl = 'http://localhost:4000/api/v1/';

const ViewPage = (props) => {

    const [ev, setEv] = useState(null);
    const [stages, setStages] = useState([]);
    const [createStageDialogOpen, setCreateStageDialogOpen] = useState(false);
    //create stage fields
    const [stageNumber, setStageNumber] = useState(0);
    const [submissionStart, setSubmissionStart] = useState(new Date());
    const [submissionEnd, setSubmissionEnd] = useState(new Date);
    const [stageStatus, setStageStatus] = useState({label: 'Felitering', value: 1}) //1 = filtering, 2 = published 
    const [stageTitle, setStageTitle] = useState('');

    //move to next stage dialog
    const [nextStageDialogOpen, setNextStageDialogOpen] = useState(false);
    
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try{
            let { data: res } = await axios.post(hostUrl + 'event/admin-display', { event_id: props.record.params.id });

            if(res && res?.status){
                setEv(res.data);
                loadEventStages(res.data);
            }
        }catch(err){
            console.log(err);
        }
    }

    const loadEventStages = (v) => {
        let num = v.stage_count;
        let arr = [];
        for(let i = 1; i <= num; i++){
            let obj = {};
            if(v?.event_stages?.length){
                let placeholder = v.event_stages.filter((el, index) => el.stage_number === i);
                if(placeholder?.length){
                    obj = placeholder[0];
                }else{
                    obj['stage_number'] = i;
                }
            }else{
                obj['stage_number'] = i;
            }

            arr.push(obj);
        }

        setStages(arr);
    }

    const canPublish = (num, current, date) => {
        if(num !== current) return false;
        if(moment(date).isAfter(new Date())) return false;
        return true;
    }

    const handleOpenCreateStageDialog = (stageNum) => {
        setStageNumber(stageNum);
        setCreateStageDialogOpen(true);
    }

    const hanldeCreateStage = async () => {
        if(!stageTitle || !stageStatus || !submissionEnd || !submissionStart) return;
        try{
            let { data: res } = await axios.post(hostUrl + 'event/stage', {
                stage_number: stageNumber,
                status: stageStatus.value,
                submission_start: submissionStart,
                submission_end: submissionEnd,
                title: stageTitle,
                event_id: ev.id
            });

            if(res?.status){
                setStageNumber(0);
                setStageTitle('');
                setSubmissionStart(new Date());
                setSubmissionEnd(new Date());
                setCreateStageDialogOpen(false);
                loadData()
                return;
            }
        }catch(err){
            return alert(err?.message);
        }
    }

    const handleDeactivateVoting = async () => {
        try{
            let { data: res } = await axios.post(hostUrl + 'event/deactivate-voting', {event_id: ev?.id});
            
            if(res && res?.status){
                loadData();
                return;
            }

            if(res && res?.status === false){
                alert(res?.message || 'message');
            }
        }catch(err){
            alert(err?.message);
        }
    }

    const handleActivateVoting = async () => {
        try{
            let { data: res } = await axios.post(hostUrl + 'event/activate-voting', {event_id: ev?.id});
            
            if(res && res?.status){
                loadData();
                return;
            }

            if(res && res?.status === false){
                alert(res?.message || 'message');
            }
        }catch(err){
            alert(err?.message);
        }
    }

    const handleStagePublish = async (num) => {
        try{
            let { data: res } = await axios.post(hostUrl + 'event/stage-publish', { stage_id: num });

            if(res && res?.status){
                loadData();
                return;
            }

            if(res && res?.status === false){
                alert(res?.message || 'message');
            }
        }catch(err){
            alert(err?.message || 'server error')
        }
    }

    const handleStageUnpublish = async (num) => {
        try{
            let { data: res } = await axios.post(hostUrl + 'event/stage-unpublish', { stage_id: num });

            if(res && res?.status){
                loadData();
                return;
            }

            if(res && res?.status === false){
                alert(res?.message || 'message');
            }
        }catch(err){
            alert(err?.message || 'server error')
        }
    }

    const closeMoveToNextDialog = () => {
        setNextStageDialogOpen(false);
    }

    const handleMoveSuccess = () => {
        setNextStageDialogOpen(false);
        loadData();
    }

    return (
        <Box style={{marginBottom: "25px"}}>
            <div style={HeaderClass}>
                <div style={CardClass}><h1>Title:</h1>{props.record.params.title}</div>
                
                <div style={CardClass}><h1>Start Date:</h1>{moment(props.record.params.start_date).format('DD/MM/YYYY')}</div>
                
                <div style={CardClass}><h1>End Date:</h1>{moment(props.record.params.end_date).format('DD/MM/YYYY')}</div>
                
                <div style={CardClass}>
                    <h1>Registration Start:</h1>
                    {moment(props.record.params.registration_start).format('DD/MM/YYYY')}
                </div>
                
                <div style={CardClass}>
                    <h1>Registration End:</h1>
                    {moment(props.record.params.registration_end).format('DD/MM/YYYY')}
                </div>
                
                <div style={CardClass}>
                    <h1>Subscription Count:</h1>
                    {ev?.subscription_count}
                </div>
                
                <div style={CardClass}>
                    <h1>Participants Count</h1>
                    {ev?.participants_count}
                </div>
                <div style={CardClass}>
                    <h1>Current Stage</h1>
                    {ev?.current_stage}
                </div>
                <div style={CardClass}>
                    <h1>Total Stages</h1>
                    {ev?.stage_count}
                </div>
            </div>

            <CardsWrapper>
                {
                    stages.map((item, i) => {
                        return (
                            item?.id ?
                            <EventStageCard key={`evenn-stage-card-${i}`}>
                                <p>Title: {item.title}</p>
                                <p>Submission Start: {moment(item.submission_start).format('DD/MM/YYYY')}</p>
                                <p>Submission End: {moment(item.submission_end).format('DD/MM/YYYY')}</p>
                                {
                                    item?.status === 1 ?
                                    <Button onClick={() => handleStagePublish(item.id)} disabled={!canPublish(item.stage_number, ev.current_stage, item.submission_end)} >Publish</Button> :
                                    <Button onClick={() => handleStageUnpublish(item.id)}>Unpublish</Button>                                    
                                }
                            </EventStageCard> :
                            <Button onClick={() => handleOpenCreateStageDialog(item.stage_number)} style={{margin: '0 5px'}} key={`evenn-stage-card-${i}`}>Create Event {item.stage_number}</Button> 
                        )
                    })
                }
            </CardsWrapper>

            <ActionsWrapper>
                {
                    ev?.can_vote ? 
                    <Button onClick={handleDeactivateVoting}>Deactivate Voting</Button> :
                    <Button onClick={handleActivateVoting}>Activate Voting</Button>
                }

                {
                    ev?.current_stage < ev?.stage_count ?
                    <Button style={{marginLeft: 10}} onClick={() => setNextStageDialogOpen(true)}>Move To Next Stage</Button> : null
                }
                {
                    ev?.current_stage === ev?.stage_count ?
                        <Button style={{marginLeft: 10}}>Finish Event</Button> : null
                }
            </ActionsWrapper>

            <Dialog style={StageCreateDialogStyles} isOpen={createStageDialogOpen}>
                <CreateStageDialog>
                    <h1 className="header">Create Stage: {stageNumber}</h1>
                    <div className="form-control">
                        <label>Title:</label>
                        <Input className='input' type="text" value={stageTitle} onChange={(e) => setStageTitle(e.target.value)} />
                    </div>
                    <div className="form-control">
                        <label>Submission Start:</label>
                        <Input min={new Date()} className='input' type="date" value={submissionStart} onChange={e => setSubmissionStart(e.target.value)} />
                    </div>
                    <div className="form-control">
                        <label>Submission end:</label>
                        <Input min={new Date()} className='input' type="date" value={submissionEnd} onChange={e => setSubmissionEnd(e.target.value)}/>
                    </div>
                    <div className="form-control">
                        <label>Status:</label>
                        <Select className='input' value={stageStatus} options={[{label: 'Filtering', value: 1}, {label: 'Published',  value: 2}]} onChange={(e) => setStageStatus(e.value)} />
                    </div>

                    <div className="actions">
                        <Button onClick={() => setCreateStageDialogOpen(false)} >Cancel</Button>
                        <Button style={{marginLeft: 10}} onClick={hanldeCreateStage}>Save</Button>
                    </div>
                </CreateStageDialog>
            </Dialog>

            <Dialog ariaHideApp={false} isOpen={nextStageDialogOpen} style={moveToNextStageDialogStyles} onRequestClose={closeMoveToNextDialog}>
                <MoveToNextStageDialog eventId={ev?.id} success={handleMoveSuccess} close={closeMoveToNextDialog}/>
            </Dialog>
        </Box>
    );
}

export default ViewPage;