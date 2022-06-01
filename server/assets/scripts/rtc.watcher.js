import docs from "./docs.js";

export function Watcher( io )
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
    const source = "watcher";

    this.parent = document.querySelector( "#content" );

    this.initialize = async ( config ) =>
    {
        scope.data =
        {
            name: config.name,
            role: source
        };

        await ( async () =>
        {
            scope.video = docs.ce( "video" );
            scope.video.setAttribute( "autoplay", "" );
            scope.video.setAttribute( "height", 150 );
            scope.video.setAttribute( "width", 200 );

            docs.ac( config.parent, scope.video );
        } )();

        socket.emit( scope.data.role, scope.data );
    };

    socket.on( "offer", ( data ) => 
    {
        const id = data.id;
        
        scope.connection = new RTCPeerConnection( config );
        scope.connection.setRemoteDescription( data.description )
            .then( () => scope.connection.createAnswer() )
            .then( sdp => scope.connection.setLocalDescription( sdp ) )
            .then( () => 
            {
                let data = 
                {
                    description: scope.connection.localDescription,
                    event: "answer",
                    id: id,
                    source: source
                };

                socket.emit( data.event, data );
            } );
        scope.connection.ontrack = event => 
        {
            scope.video.srcObject = event.streams[ 0 ];
        };
        scope.connection.onicecandidate = event => 
        {   
            if ( event.candidate ) 
            {
                let data = 
                {
                    candidate: event.candidate,
                    event: "candidate",
                    id: id,
                    source: source
                };
            
                socket.emit( data.event, data );
            }
        };
    } );

    socket.on( "candidate", data => 
    {
        var candidate = new RTCIceCandidate( data.candidate );

        scope.connection.addIceCandidate( candidate )
          .catch( e => console.error( e ) );
    } );

    socket.on( "connect", () => scope.video.setAttribute( "id", socket.id ) );

    window.onunload = window.onbeforeunload = () => 
    {
        socket.close();
        scope.connection.close();
    };
};