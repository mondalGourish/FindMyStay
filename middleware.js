module.exports.isLoggedIn = (req,res,next) =>{
    if(!req.isAuthenticated()){
        //redirectUrl save
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to create listing");
        return res.redirect("/login");
    }
    next();
};

//we are saving the redirectUrl in locals as the passport deletes the url once the job is done of logging, so to bypass that we are doing this, as locals can be accessed everywhere

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};