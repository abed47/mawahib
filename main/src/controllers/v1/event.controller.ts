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
            my_events = await EventSubscription.findAll({where: { user_id }, include: [Event, User]});
        }

        event_categories = await Category.findAll({ include: [ { model: Event, required: true }]});

        ongoing_events = await Event.findAll({ where: {
            [Op.and]: [
                { start_date: { [Op.lt]: today } },
                { end_date: { [Op.gt]: today}}
            ]
            }});

        return successResponse(res, 200, 'retrieved successfully', {
            my_events
        })
    }catch(err){
        return errorResponse(res, 500, err?.message || 'server error');
    }
}