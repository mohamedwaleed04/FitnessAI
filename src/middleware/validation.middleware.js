export const isValid = (schema) => {
    return (req, res, next ) => {
       const reqObj = { ...req.body, ...req.query, ...req.params};
        const ValidationResult = schema.validate(reqObj, {
            abortEarly:false,
        });
        if (ValidationResult.error){
const errorArray = ValidationResult.error.details.map((Element) => Element.message);
return next (new Error(errorArray));
    }
        return next();
    };

};