import docs from "./docs.js";

export function Broadcaster( io )
{
    var socket = io();
    var scope = this;
    var configuration = 
    { 
        "iceServers": [ { "url": "stun:stun2.1.google.com:19302" } ] 
    }; 

    this.parent = document.querySelector( "#content" );

    this.initialize = async ( name, audio, video ) =>
    {
        await ( async () =>
        {
            scope.video = docs.ce( "video" );
            scope.video.setAttribute( "autoplay", "" );
            scope.video.setAttribute( "height", 150 );
            scope.video.setAttribute( "id", name );
            scope.video.setAttribute( "width", 200 );

            docs.ac( scope.parent, scope.video );
        } )();
        
        navigator.getUserMedia( { video: video, audio: audio }, function( stream ) 
        { 
            var data =
            {
                name: name,
                role: "broadcaster"
            };

            scope.stream = stream;
            scope.video.srcObject = scope.stream;

            socket.emit( data.role, data );
        }, error );
    };

    socket.on( "watcher", data => 
    {
        console.log( data );
        /*var div = docs.ce( "div" );
            div.innerText = id;
        docs.ac( scope.parent, div );*/

        //var peerConnection = new RTCPeerConnection( configuration );
        //    peerConnection.addStream( scope.stream );

            //scope.connection = new RTCPeerConnection( configuration );
            //scope.connection.addStream( stream );


        //peerConnections[id] = peerConnection;
      
        //let stream = video.srcObject;
        //stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
          
        /*peerConnection.onicecandidate = event => {
          if (event.candidate) {
            socket.emit("candidate", id, event.candidate);
          }
        };
      
        peerConnection
          .createOffer()
          .then(sdp => peerConnection.setLocalDescription(sdp))
          .then(() => {
            socket.emit( "offer", id, peerConnection.localDescription );
          } );*/
      });

    // private functions
    function error( e )
    {
        console.error( e );
    } 
}