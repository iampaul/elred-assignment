const jwt = require('jsonwebtoken');
const { ApiException } = require('../errors/api-exception');

const isUserLoggedin = async (request, response, next) => {
        try {
            //Get JWT Token from authorization headers
            const authorizationToken = request.headers.authorization;
            if (!authorizationToken)
            {
                return next(
                    new ApiException(
                        401,
                        'Authorization Required'
                    )
                )            
            }            

            if (!authorizationToken.startsWith('Bearer'))
            {
                return next(
                    new ApiException(
                        401,
                        'Invalid Authorization token'
                    )
                )            
            }            

            const split = authorizationToken.split(' ');        
            if (split.length !== 2)
            {
                return next(
                    new ApiException(
                        401,
                        'Invalid Authorization token'
                    )
                )            
            }

            const token = split[1];
            
            //Verify Firebase Token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            request.user = decoded.user;
            next();
   
        } catch (e) {            
             return next(
                 new ApiException(
                     401,
                     'You are not authorized to make this request'
                 )
             )            
        } 
}

module.exports = {
    isUserLoggedin
}