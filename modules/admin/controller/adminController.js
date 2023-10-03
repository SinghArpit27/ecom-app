import { responseMessage, responseStatus, statusCode } from '../../../core/constant.js';
import httpResponse from '../../../helper/httpResponse.js';
import User from '../../../models/userSchema.js';



export const userDeleteController = async(req,res) => {
    try {
        
        const id = req.params.id;
        const adminData = await User.findById({ _id: req.userId });
        if(adminData.user_role === 1){

            await User.findByIdAndUpdate({ _id: id }, { $set: { isDeleted: true } });
            httpResponse(res, statusCode.OK, responseStatus.SUCCESS, responseMessage.USER_DELETED_SUCCESS);
            
        }else{
            httpResponse(res, statusCode.BAD_REQUEST, responseStatus.FAILURE, responseMessage.UNAUTHORIZED);
        }
    } catch (error) {
        httpResponse(res, statusCode.INTERNAL_SERVER_ERROR, responseStatus.FAILURE, responseMessage.INTERNAL_SERVER_ERROR);
    }
}