import { Channel, Playlist, PlayListItem, User, Video } from "../../database/models";
import { errorResponse, successResponse } from "../../utils";
import { ControllerFunction } from "../../utils/types";

export const list: ControllerFunction = (req, res) => {
    Playlist.findAll({include: [
        { model: Channel, required: false },
        { model: User, required: false }
    ]})
    .then(r => successResponse(res, 200, 'retrieved successfully', r))
    .catch(err => errorResponse(res, 500, err?.message || 'server error'))
}

export const getOne: ControllerFunction = (req, res) => {
    let { id } = req.params;

    Playlist.findAll({
        where: { id },
        include: [
            { model: Channel, required: false },
            { model: User, required: false},
            { model: PlayListItem, required: false, include: [
                { model: Video, required: false }
            ]}
        ]
    })
    .then(r => successResponse(res, 200, 'retrieved successfully', r))
    .catch(err => errorResponse(res, 500, err?.message || 'server error'))
}