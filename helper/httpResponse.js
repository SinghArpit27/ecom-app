
const httpResponse = ( res, statusCode, responseStatus, responseMessage, data ) => {

    if(data !== 'undefined'){
        res.status(statusCode).json({
            success: responseStatus,
            message: responseMessage,
            data: data
        });
    }else{
        res.status(statusCode).json({
            success: responseStatus,
            message: responseMessage
            
        });
    }

}

export default httpResponse;