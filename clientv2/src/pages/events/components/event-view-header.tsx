import React from 'react';
import moment from 'moment';
import Countdown from 'react-countdown';
import { handlePhotoUrl } from '../../../utils/services/request';
import { EventViewResponseData } from '../../../utils/types';
import SubmissionPlayer from './event-submission-player';

interface ComponentProps {
    data: EventViewResponseData;
    updateStatus?: (e: any) => void;
    showPlayer: boolean;
    hidePlayer: (e: boolean) => void;
    playerUrl: string
}

const EventViewHeader: React.FC<ComponentProps> = ({data, showPlayer, hidePlayer, playerUrl}) => {

    const getEventBadge = (status: number) => { 
        if(status > 0 && status < 3) return <div className="badge">upcoming</div>
        if(status > 2 && status < 4) return <div className="badge">ongoing</div>
        if(status === 5) return <div className="badge">Ended</div>
    }

    const renderer: any = ({ days, hours, minutes, seconds, completed }: any, status: number) => {
        if (completed) {
          // Render a completed state
          return <p>Event Ended</p>;
        } else {
          // Render a countdown
          return (
            <div className='event-inner-info'>

                {getEventBadge(status)}
                <p className="timer-title">{statusNumToString(status)}</p>           
                
                <span className='count-down-timer'>
                    <div className='block'>
                        <span>{days}</span>
                        <p>days</p>
                    </div>
                    <div className='block'>
                        <span>{hours}</span>
                        <p>hours</p>
                    </div>
                    <div className='block'>
                        <span>{minutes}</span>
                        <p>min</p>
                    </div>
                    <div className='block'>
                        <span>{seconds}</span>
                        <p>seconds</p>
                    </div>
                </span>
            </div>
          );
        }
    };

    const statusNumToString = (s: number) => {
        if(s === 1) return 'Registration start in: ';
        if(s === 2) return 'Registration will end in: ';
        if(s === 3) return 'Event will start in: ';
        if(s === 4) return 'Event will end in: ';
        if(s === 5) return 'Event Ended on: ';
    }

    // const getEventStatus: (registrationStart, EventStart) => "ongoing" | "upcoming" = (d) => {
    //     if(moment().isBefore(d)){}
    //     if(moment().isBefore(d))
    //     return "ongoing";
    // }

    const getCountDownEl = () => {
        let rStart = data?.registration_start;
        let rEnd = data?.registration_end;
        let eStart = data?.start_date;
        let eEnd = data?.end_date;
        if(moment().isBefore(moment(rStart))) return <Countdown date={moment(rStart, 'YYYY-MM-DDThh:mm:ssZ').valueOf()} renderer={ (e) => renderer(e, 1) } />
        if(moment().isBefore(moment(rEnd))) return <Countdown date={moment(rEnd, 'YYYY-MM-DDThh:mm:ssZ').valueOf()} renderer={ (e) => renderer(e, 2) } />
        if(moment().isBefore(moment(eStart))) return <Countdown date={moment(eStart, 'YYYY-MM-DDThh:mm:ssZ').valueOf()} renderer={ (e) => renderer(e, 3) } />
        if(moment().isBefore(moment(eEnd))) return <Countdown date={moment(eEnd, 'YYYY-MM-DDThh:mm:ssZ').valueOf()} renderer={ (e) => renderer(e, 4) } />
    }

    return (
        <header>
            {
                showPlayer && playerUrl ?
                <SubmissionPlayer hidePlayer={hidePlayer} url={playerUrl} /> :
                <>
                    <img src={handlePhotoUrl(data?.cover)} alt="Event cover" className='cover' />
                    <div className="info">
                        {
                            getCountDownEl()
                        }
                    </div>
                </>
            }
        </header>
    );
}

export default EventViewHeader;