const fs = require( "fs" );
const mime = require( "mime-types" );
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
    var dir = path.join( __dirname, dirname ).replace( "/utilities", "" );
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

module.exports.capitalize = capitalize;
module.exports.directoryInfo = directoryInfo;
module.exports.fileInfo = fileInfo;