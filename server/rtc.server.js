const { Server } = require( "socket.io" );

let broadcaster;

const start = ( server ) =>
{
    var io = new Server( server );  
        io.sockets.on( "error", e => console.log( e ) );
        
        io.on( "connection", ( socket ) => 
        {
            socket.on( "broadcaster", ( data ) => 
            {
                broadcaster = socket.id;
                data.id = socket.id;
                socket.emit( "broadcaster", data );
            } );

            socket.on( "watcher", ( data ) => 
            {
                data.id = socket.id;
                socket.to( broadcaster ).emit( "watcher", data );
            } );

            socket.on( "disconnect", ( data ) => 
            {
                data.id = socket.id;
                socket.to( broadcaster ).emit( "hangup", data );
            } );

            [ "answer", "candidate", "offer" ].forEach( event => socket.on( event, data => 
            { 
                var id = data.id;

                data.id = socket.id;
                socket.to( id ).emit( event, data );
            } ) );
    } );
};

module.exports.start = start;