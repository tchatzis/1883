module.exports = ( req, res, next ) =>
{   
    if ( req.cookies.auth )
        return next();  

    if ( req.body.query )     
        return next(); 

    res.render( "login" );
};