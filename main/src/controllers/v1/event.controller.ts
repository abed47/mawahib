import Sequelize, { Op } from 'sequelize';
import { ControllerFunction } from "../../utils/types";
import {errorResponse, successResponse} from "../../utils";
import {Category, Channel, Event, EventStage, EventSubscription, User, Video} from '../../database/models';
import * as moment from 'moment';
import Submission from "../../database/models/submission";
import Participation from "../../database/models/participation";
import Vote from "../../database/models/vote";

export const home: ControllerFunction = async (req, res) => {
    try{
        let { user_id } = req.body;
        let my_events = null;
        let event_categories = null;
        let ongoing_events = null;
        let upcoming_events = null;
        let today = moment(new Date()).format('YYYY-MM-DDThh:mm:ssZ');

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
            limit: 4
        });

        upcoming_events = await Event.findAll({
            where: {
                start_date: { [Op.gt]: today }
            },
            include: [ { model: Category, required: false }, { model: EventSubscription, required: false, where: { user_id: user_id || 0 }} ],
            limit: 4,
            order: [['createdAt', 'DESC']]
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

export const view: ControllerFunction = async (req, res) => {
    try{
        let { id } = req.params;
        let { user_id, channel_id } = req.body;
        if(typeof +id !== "number") return errorResponse(res, 400, 'unacceptable event id');
        let participated = false;
        let subscribed = false;
        let user_vote = false;


        if(channel_id){
            let participationCheck = await Participation.findOne({
                where: {
                    channel_id, event_id: id
                }
            });

            if(participationCheck) participated = true;
        }

        if(user_id){
            let subscribeCheck = await EventSubscription.findOne({where: { event_id: id, user_id }});
            if(subscribeCheck) subscribed = true;
        }

        let event: any = await Event.findOne({
            where: { id },
            attributes: [
                "id",
                "title",
                "photo",
                "cover",
                "createdAt",
                "updatedAt",
                "current_stage",
                "description",
                "end_date",
                "start_date",
                "limit",
                "registration_start",
                "registration_end",
                "stage_count",
                "status",
                "category_id",
                "sponsor_name",
                "sponsor_url",
                "first_prize_amount",
                "second_prize_amount",
                "third_prize_amount",
                "prize_pool_description",
                "can_vote",
                [Sequelize.literal('(SELECT COUNT(id) FROM event_subscriptions WHERE event_id = "event"."id")'), "subscription_count"],
                [Sequelize.literal('(SELECT COUNT(id) FROM submissions WHERE event_id = "event"."id")'), "submission_count"]
            ],
            include: [
                { model: Category, required: false, attributes: ["id", "name"] },
                { model: EventSubscription, required: false, attributes: [] },
                { model: Submission, required: false, attributes: [] },
            ],
            group: ["event.id", "category.id"]
        });
        
        if(!event) return errorResponse(res, 404, 'event not found')

        let stages: any = await EventStage.findAll({ where: {
            [Op.and]: [
                { event_id: id },
                { stage_number: { [Op.lte]: event?.dataValues?.current_stage}},
                { status: 2}
            ]
        }});

        let can_submit: any = await EventStage.findOne({ where: { 
            [Op.and]: [
                { event_id: id },
                { stage_number: { [Op.lte]: event?.dataValues?.current_stage}},
                { submission_start: { [Op.lte]: new Date()}},
                { submission_end: { [Op.gt]: new Date()}}
            ]
         }});


        let performances = await EventStage.findAll({
            where: {
                [Op.and]: [
                    { event_id: id },
                    { status: 2 }
                ]
            },
            include: [
                { model: Submission, required: false, include: [
                        { model: Video },
                        { model: Channel, required: false },
                    ] }
            ],
            order: [['stage_number', 'DESC']]
        });

        let participants = await Participation.findAll({
            where: { event_id: id },
            include: [Channel]
        });

        if(user_id){
            let voteCheck: any = await Vote.findAll({ where: { user_id, event_id: id, stage_number: event.dataValues.current_stage }});
            user_vote = !voteCheck.length ? true : false;
        }
        
        return successResponse(res, 200, 'retrieved successfully', {
            ...event.dataValues,
            participated,
            subscribed,
            stages,
            can_submit,
            performances,
            participants,
            user_vote
        });
    }catch(err){
        return errorResponse(res, 500, err?.message || 'server error');
    }
}

/*=================================================Event Interactions=================================================*/
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

export const participate: ControllerFunction = async (req, res) => {
    try{
        let { channel_id, event_id } = req.body;
        if(!channel_id || !event_id) return errorResponse(res, 400, 'missing required fields');
        let e: any = await Event.findOne({ where: { id: event_id }});
        let c: any = await Channel.findOne({ where: { id: channel_id }});
        if(!e) return errorResponse(res, 404, 'event not found');
        if(!c) return errorResponse(res, 404, 'channel not found');

        //check if already participated
        let rCheck = await Participation.findOne({ where: { event_id, channel_id }});
        if(rCheck) return successResponse(res, 200, 'already subscribed');

        //validate that registration is still open
        let rStart = e.dataValues.registration_start
        let rEnd = e.dataValues.registration_end;
        let now = new Date();
        if(moment(rStart, 'YYYY-MM-DDThh:mm:ddZ').isAfter(now) || moment(rEnd, 'YYYY-MM-DDThh:mm:ddZ').isBefore(now)) return errorResponse(res, 400, 'cannot register');

        await Participation.create({event_id, channel_id});
        return successResponse(res, 200, 'successfully registered');
    }catch(err){
        return errorResponse(res, 500, err?.message || 'server error');
    }
}

export const withdraw: ControllerFunction = async (req, res) => {
    try{
        let { event_id, channel_id } = req.body;
        if(!event_id || !channel_id) return errorResponse(res, 400, 'missing required fields');

        await Participation.destroy({ where: { event_id, channel_id }});
        return successResponse(res, 200, 'withdrawal successful');
    }catch(err){
        return errorResponse(res, 500, err?.message || 'server error');
    }
}

export const createVote: ControllerFunction = async (req, res) => {
    try{
        let { user_id, submission_id, stage_number, participation_id, event_id } = req.body;
        if(!user_id || !submission_id || !stage_number || !participation_id || !event_id) return errorResponse(res, 400, 'missing required fields');

        //check if already voted;
        let voteCheck: any = await Vote.findOne({ where: { user_id, submission_id, stage_number, participation_id, event_id }});
        if(voteCheck?.id || voteCheck?.dataValues?.id) return errorResponse(res, 400, 'already voted');

        //check if votes are open
        let canVoteCheck: any = await Event.findOne({ where: { id: event_id }});
        if(canVoteCheck.can_vote === false || canVoteCheck.dataValues.can_vote === false) return errorResponse(res,400, 'voting not open');

        //create vote
        await Vote.create({ user_id, submission_id, stage_number, participation_id, event_id });
        return successResponse(res, 200, 'voted successfully');
    }catch(err){
        return errorResponse(res, 500, err?.message || 'server error');
    }
}



export const getOne: ControllerFunction = async (req, res) => {
    try{
        let { id } = req.params;
        let r = await Event.findOne({ where: { id }, include: [{model: EventStage, required: false}]});
        if(!r) return errorResponse(res, 404, 'event not found');
        return successResponse(res, 200, 'retrieved successfully', r);
    }catch(err){
        return errorResponse(res, 500, err?.message || 'server error');
    }
}


//TODO: create middleware for admin requests
export const eventAdminView: ControllerFunction = async (req, res) => {
    try{
        let { event_id } = req.body;
        if(!event_id) return errorResponse(res, 400, 'missing required fields');

        //event, event subscription count, event registration count
        let ev = await Event.findOne({
            where: { id: event_id },
            attributes: [
                'id',
                'title',
                'stage_count',
                'current_stage',
                'can_vote',
                [Sequelize.literal('(SELECT COUNT(id) FROM event_subscriptions WHERE event_id = "event"."id")'), 'subscription_count'],
                [Sequelize.literal('(SELECT COUNT(id) FROM participations WHERE event_id = "event"."id")'), 'participants_count'],
            ],
            include: [
                { model: EventStage, required: false}
            ]
        })

        if(!ev) return errorResponse(res, 404, 'event not found');
        return successResponse(res, 200, 'retrieved successfully', ev);
    }catch(err){
        return errorResponse(res, 500, err?.message || 'server error');
    }
}

export const createStage: ControllerFunction = async (req, res) => {
    try{
        let {stage_number, title, submission_start, submission_end, status, event_id } = req.body;
        if(!stage_number || !title || !submission_end || !submission_start || !status || !event_id) return errorResponse(res, 400, 'mission required fields');
        
        await EventStage.create({title, submission_end, submission_start, event_id, status, stage_number});

        return successResponse(res, 200, 'created successfully');
    }catch(err){
        return errorResponse(res, 500, err?.message || 'server error');
    }
}

export const activateVotes: ControllerFunction = async (req, res) => {
    try{
        let { event_id } = req.body;
        if(!event_id) return errorResponse(res, 400, 'missing required fields');

        await Event.update({ can_vote: true }, {where: { id: event_id }});

        return successResponse(res, 200, 'updated successfully')
    }catch(err){
        return errorResponse(res, 500, err?.message || 'server error');
    }
}

export const deactivateVotes: ControllerFunction = async (req, res) => {
    try{
        let { event_id } = req.body;
        if(!event_id) return errorResponse(res, 400, 'missing required fields');

        await Event.update({ can_vote: false }, {where: { id: event_id }});

        return successResponse(res, 200, 'updated successfully')
    }catch(err){
        return errorResponse(res, 500, err?.message || 'server error');
    }
}

export const publishStage: ControllerFunction = async (req, res) => {
    try{
        let { stage_id } = req.body;
        if(!stage_id) return errorResponse(res, 400, 'missing required fields');

        await EventStage.update({ status: 2 }, { where: { id: stage_id } });

        return successResponse(res, 200, 'updated successfully')
    }catch(err){
        return errorResponse(res, 500, err?.message || 'server error');
    }
}

export const unpublishStage: ControllerFunction = async (req, res) => {
    try{
        let { stage_id } = req.body;
        if(!stage_id) return errorResponse(res, 400, 'missing required fields');

        await EventStage.update({ status: 1 }, { where: { id: stage_id } });

        return successResponse(res, 200, 'updated successfully')
    }catch(err){
        return errorResponse(res, 500, err?.message || 'server error');
    }
}