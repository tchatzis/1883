const fs = require( "fs" );
const path = require( "path" );

function capitalize( str )
{
    return str.charAt( 0 ).toUpperCase() + str.slice( 1 );
}

function directoryInfo( dirname, callback )
{
    var dir = path.join( __dirname, dirname ).replace( "/utilities", "" );

    fs.readdir( dir, ( err, files ) =>
    {
        var info =
        {
            path: dir,
            files: files,
            directory: dirname
        };

        callback( info );
    } );
};

function fileInfo( dirname, filename )
{
    var dir = path.join( __dirname, dirname );
    var file = path.join( dir, filename );
    var type = mime.lookup( file );
    var stream = fs.createReadStream( file );
    var stat = fs.statSync( file );
    
    return {
        dir: dir,
        file: file,
        filename: filename,
        stat: stat,
        stream: stream,
        type: type
    };
};

exports.capitalize = capitalize;
exports.directoryInfo = directoryInfo;
exports.fileInfo = fileInfo;