export const catchError = (controller) => {
    return (req, res, next) => {
        controller(req, res, next).catch((error) =>{
            return res.json({result: false, message: error.message, stack: error.stack});
        });
    }
}