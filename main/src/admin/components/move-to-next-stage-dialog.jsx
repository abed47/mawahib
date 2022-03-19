import React, { useState, useEffect } from 'react';
import { Loader, Input, Button, FormGroup, Label, Table, TableBody, TableHead, TableRow, TableCell, TableCaption } from '@adminjs/design-system';
import axios from 'axios';

const styles = {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between'
}

const MoveToNextStageDialog = props => {

    const [loading, setLoading] = useState(false);
    const [movingCount, setMovingCount] = useState(6)
    const [movingList, setMovingList] = useState([]);
    const [terminationList, setTerminationList] = useState([]);


    useEffect(() => {

        loadData();

        return () => {
            // let res = await axios.post('http://local')
        }
    }, [props.id]);

    const loadData = async () => {
        try{

        }catch(err){

        }
    }

    const getMovingList = async () => {
        try{
            setLoading(true);
            let res = await axios.post('http://localhost:4000/api/v1/event/move-to-next-stage-summary', {event_id: props.eventId, winner_count: movingCount});
            setLoading(false);

            if(res.status === 200){
                let d = res.data.data;
                setMovingList(d.winners);
                setTerminationList(d.eliminated_id);
                return;
            }

            return props.close();
        }catch(err){
            props.close();
        }
    }

    const handleMove = async () => {
        try{
            setLoading(true);
            let res = await axios.post('http://localhost:4000/api/v1/event/move-to-next-stage', { event_id: props.eventId, winner_count: movingCount});
            setLoading(false);

            if(res.status === 200){
                props.success();
                return;
            }

            props.close();
        }catch(err){
            props.close();
        }
    }

    return (
        <div style={styles}>
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'flex-end'}}>
                <FormGroup style={{margin: 0}}>
                    <Label>Moving Count:</Label>
                    <Input label={"Moving Count"} type={"number"} value={movingCount} onChange={e => setMovingCount(e.target.value)} />
                </FormGroup>

                <Button onClick={getMovingList}>Apply</Button>
            </div>
            {
                loading ? <Loader /> : null
            }
            {
                movingList?.length > 0 ?
                    <div style={{maxHeight: 200, overflow: 'auto', width: '100%', position: 'relative'}}>
                        <div style={{height: 50}}></div>
                        <Table>
                            <TableCaption>Moving to next stage</TableCaption>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Channel</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    movingList.map((item, index) => {
                                        return <TableRow>
                                            <TableCell>
                                                {item.participation_id}
                                            </TableCell>
                                            <TableCell>
                                                {item.name}
                                            </TableCell>
                                        </TableRow>
                                    })
                                }
                            </TableBody>
                        </Table>
                    </div>
                     : null
            }
            {
                terminationList?.length > 0 ?
                    <div style={{maxHeight: 200, overflow: 'auto', width: '100%', position: 'relative'}}>
                        <div style={{height: 50}}></div>
                        <Table>
                            <TableCaption>Terminated on next stage</TableCaption>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Channel</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    terminationList.map((item, index) => {
                                        return <TableRow>
                                            <TableCell>
                                                {item.id}
                                            </TableCell>
                                            <TableCell>
                                                {item.channel.name}
                                            </TableCell>
                                        </TableRow>
                                    })
                                }
                            </TableBody>
                        </Table>
                    </div>
                    : null
            }
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%'}}>
                <Button onClick={() => props.close()}>Cancel</Button>
                <Button onClick={handleMove}>Move To Next Stage</Button>
            </div>
        </div>
    );
}

export default MoveToNextStageDialog;