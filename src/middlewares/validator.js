const { validationResult, ValidationError, Result }  = require('express-validator');

const handleValidationErrors = (req, res, next) => {
	const errors= validationResult(req)
	const messages = {};
	if (!errors.isEmpty()) {
		for (const i of errors.array()) {
			messages[i.param] = i.msg;
		}

        return res.status(400).json({            
			message: "Validation Failed",
            errors: messages
        })
	} else {
        return next();
    }
}

module.exports = handleValidationErrors;