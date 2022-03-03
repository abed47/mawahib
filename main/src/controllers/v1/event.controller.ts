import {ControllerFunction} from "../../utils/types";
import {errorResponse} from "../../utils";

export const home: ControllerFunction = (req, res) => {
    try{

    }catch(err){
        return errorResponse(res, 500, err?.message || 'server error');
    }
}