import docs from "./docs.js";

export function Broadcaster( io )
{
    const scope = this;
          scope.connections = {};
    const socket = io.connect( window.location.origin );
    const config = 
    {
        iceServers: 
        [
            {
                urls: [ "stun:stun.l.google.com:19302" ]
            }
        ]
    };
    const source = "broadcaster";

    this.parent = document.querySelector( "#content" );

    this.initialize = async ( config ) =>
    {
        await ( async () =>
        {
            scope.video = docs.ce( "video" );
            scope.video.setAttribute( "autoplay", "" );
            scope.video.setAttribute( "height", 150 );
            scope.video.setAttribute( "width", 200 );

            docs.ac( config.parent, scope.video );
        } )();
        
        navigator.getUserMedia( { video: config.video, audio: config.audio }, function( stream ) 
        { 
            var user =
            {
                id: socket.id,
                name: config.name,
                role: "broadcaster"
            };

            scope.stream = stream;
            scope.video.srcObject = scope.stream;
            scope.video.setAttribute( "id", user.id );

            socket.emit( "broadcaster", user );
        }, error );
    };

    socket.on( "broadcaster", user => 
    {
        console.log( user );
    } );

    socket.on( "watcher", user => 
    {
        console.log( user );

        scope.connection = new RTCPeerConnection( config );
        scope.connection.addStream( scope.stream );
        scope.connection.createOffer()
            .then( sdp => scope.connection.setLocalDescription( sdp ) )
            .then( () => 
            {
                let data = 
                {
                    description: scope.connection.localDescription,
                    event: "offer",
                    id: user.id,
                    source: source
                };

                socket.emit( data.event, data );
        } );
        scope.connection.onicecandidate = event => 
        {
            if ( event.candidate ) 
            {
                let data = 
                {
                    candidate: event.candidate,
                    event: "candidate",
                    id: user.id,
                    source: source
                };

                socket.emit( data.event, data );
            }
        };   
        
        scope.connections[ user.id ] = scope.connection;
    } );

    socket.on( "answer", data => 
    {
        scope.connections[ data.id ].setRemoteDescription( data.description );
    } );  

    socket.on( "candidate", data => 
    {
        var candidate = new RTCIceCandidate( data.candidate );

        scope.connections[ data.id ].addIceCandidate( candidate );
    } );

    socket.on( "hangup", data => 
    {
        scope.connections[ data.id ].close();
        delete scope.connections[ data.id ];
    } );

    window.onunload = window.onbeforeunload = () => socket.close();

    // private functions
    function error( e )
    {
        console.error( e );
    } 
}