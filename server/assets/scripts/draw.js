export default function( config )
{
    var enabled = false,
        prevX = 0,
        currX = 0,
        prevY = 0,
        currY = 0,
        isdot = false;

    var color = "white",
        stroke = 2;

    var icon = { clear: "\u274c", save: "\u2705" };

    this.init = function ( canvas, data ) 
    {
        var parent = canvas.parentNode;
        var image;
        
        this.canvas = canvas;

        this.ctx = this.canvas.getContext( "2d" );

        if ( data )
        {
            image = new Image();
            image.src = data;
            image.onload = () => this.ctx.drawImage( image, 0, 0 );
        }

        this.image = document.createElement( "img" );
        this.image.style.width = this.canvas.width + "px";
        this.image.style.height = this.canvas.height + "px";
        this.image.style.display = "none";
        this.image.style.cursor = "not-allowed";

        parent.appendChild( this.image );

        [ "move", "down", "up", "out" ].forEach( command =>
            this.canvas.addEventListener( `mouse${ command }`, ( e ) =>
                handle( e, command ), false ) );

        [ "save", "clear" ].forEach( action =>
        {
            var button = document.createElement( "input" );
                button.type = "button";
                button.value = icon[ action ];
                button.style.display = "inline";
                button.addEventListener( "click", this[ action ], false );

            parent.appendChild( button );
        } );
    };

    this.clear = () =>
    {
        var confirmed = confirm( "Want to clear?" );

        if ( confirmed ) 
        {
            this.canvas.style.display = "inline";
            
            this.ctx.clearRect( 0, 0, this.canvas.width, this.canvas.height );
            this.image.style.display = "none";
        }
    };

    this.save = () =>
    {
        this.canvas.style.display = "none";

        let data = this.canvas.toDataURL();
        
        this.image.src = data;
        this.image.style.display = "inline";

        if ( config )
            config.doc.data[ config.name ] = data;
    };

    const dot = () =>
    {
        if ( isdot ) 
        {
            this.ctx.beginPath();
            this.ctx.fillStyle = color;
            this.ctx.fillRect( currX, currY, stroke, stroke );
            this.ctx.closePath();

            isdot = false;
        }
    };

    const draw = () =>
    {
        this.ctx.beginPath();
        this.ctx.moveTo( prevX, prevY );
        this.ctx.lineTo( currX, currY );
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = stroke;
        this.ctx.stroke();
        this.ctx.closePath();
    };

    const position = ( e ) =>
    {
        prevX = currX;
        prevY = currY;
        currX = e.clientX - this.canvas.offsetLeft;
        currY = e.clientY - this.canvas.offsetTop;
    };

    const handle = ( e, command ) => 
    {
        if ( command == 'down' ) 
        {
            position( e );

            enabled = true;
            isdot = true;
            
            dot();
        }

        if ( command == 'up' || command == "out" ) 
        {
            enabled = false;
        }

        if ( command == 'move' ) 
        {
            if ( enabled )
            {
                position( e );
                draw();
            }
        }

        this.canvas.style.cursor = enabled ? "crosshair" : "wait";
    }
};