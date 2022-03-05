import { Op } from 'sequelize';
import { ControllerFunction } from "../../utils/types";
import {errorResponse, successResponse} from "../../utils";
import {Category, Event, EventSubscription, User} from '../../database/models';
import * as moment from 'moment';

export const home: ControllerFunction = async (req, res) => {
    try{
        let { user_id } = req.body;
        let my_events = null;
        let event_categories = null;
        let ongoing_events = null;
        let upcoming_events = null;
        let today = moment(new Date()).format('YYYY-MM-DDThh:mm:ss');

        if(user_id){
            my_events = await Event.findAll({
                include: [ { model: Category, required: false }, { model: EventSubscription, required: true, where: { user_id: user_id || 0 }} ]
            })
        }

        event_categories = await Category.findAll({
            include: [ { model: Event, required: true }]
        });

        ongoing_events = await Event.findAll({
            where: {
            [Op.and]: [
                { start_date: { [Op.lte]: today } },
                { end_date: { [Op.gt]: today}}
            ]
            },
            include: [ { model: Category, required: false }, { model: EventSubscription, required: false, where: { user_id: user_id || 0 }} ],
            limit: 3
        });

        upcoming_events = await Event.findAll({
            where: {
                start_date: { [Op.gt]: today }
            },
            include: [ { model: Category, required: false }, { model: EventSubscription, required: false, where: { user_id: user_id || 0 }} ],
            limit: 3
        });

        return successResponse(res, 200, 'retrieved successfully', {
            my_events,
            event_categories,
            ongoing_events,
            upcoming_events
        })
    }catch(err){
        return errorResponse(res, 500, err?.message || 'server error');
    }
}

export const subscribe: ControllerFunction = async (req, res) => {
    try{
        let { user_id, event_id } = req.body;
        //check if already exists
        let r: any = await EventSubscription.findAll({where: {
            [Op.and]: [
                { user_id },
                { event_id }
            ]
            }});

        if(r && r?.length) return successResponse(res, 200, 'already subscribed');
        await EventSubscription.create({user_id, event_id});
        return successResponse(res, 200, 'subscribed successfully');
    }catch(err){
        return errorResponse(res, 500, err?.message || 'server error');
    }
}

export const unsubscribe: ControllerFunction = async (req, res) => {
    try{
        let { user_id, event_id } = req.body;
        if(!user_id || !event_id) return successResponse(res, 400, 'missing required fields');
        await EventSubscription.destroy({ where: { user_id, event_id }});
        return successResponse(res, 200, 'success');
    }catch(err){
        return errorResponse(res, 500, err?.message || 'server error');
    }
}