function plot()
    {
        var params = {};
            params.w = 8;
            params.x = ( params.w + 1 ) * iterations;
            params.lower = position.count.down / iterations;
            params.upper = position.count.up / iterations;

        graph.add( Dual, params );
        graph.remove( params.x, params.w + 1 );
    }

    function Container( w, h, parent )
    {  
        var x = 0;
        var object;
        var pad = 20;
        
        var container = docs.ce( "div" );
            container.style.border = "1px solid #333";
            container.style.position = "relative"; 
            container.style.width = w + px;
            container.style.height = h + pad * 2 + px;   
            container.style.overflowX = "hidden";  
        docs.ac( parent, container );  

        var slide = docs.ce( "div" );
            slide.style.position = "relative"; 
            slide.style.height = h + pad * 2 + px;
        docs.ac( container, slide );

        var bars = docs.ce( "div" );
            bars.style.position = "relative"; 
            bars.style.top = pad + px;
            bars.style.height = h + px;
        docs.ac( slide, bars );

        this.add = function( Class, params )
        {
            x = params.x;
            
            // x, y, w, h, value1, value2, parent, padding
            object = new Class( x, 0, params.w, h, params.lower, params.upper, slide, 0 );
            docs.ac( bars, object.container );
        };

        this.mark = function( message, color, pos )
        {
            let mark = new Mark( x, message, color, pos );
            docs.ac( slide, mark.container );

            setTimeout( () => mark.container.style.display = "none", delay );

            if ( object )
            {
                let current = object.container;
                
                current.style.backgroundColor = "black";

                current.addEventListener( "mouseout", () => 
                {
                    mark.container.style.display = "none";
                    current.style.backgroundColor = "black";
                } );

                object.container.addEventListener( "mouseover", () => 
                {
                    mark.container.style.display = "block";
                    current.style.backgroundColor = "yellow";
                } );
            }
        };

        this.remove = function( v, s )
        {
            if ( v >= container.clientWidth - s )
                slide.style.left = slide.offsetLeft - s + px;
        };
    }

    function Mark( x, message, color, pos )
    {
        this.container = docs.ce( "div" );
        this.container.style.padding = 2 + px;
        this.container.style.borderRadius = 4 + px;
        this.container.style.position = "absolute";
        this.container.style.left = x + px;
        this.container.style[ pos ] = 0;
        this.container.style.backgroundColor = color;
        this.container.style.fontSize = "0.7em";
        this.container.style.whiteSpace = "nowrap";
        this.container.innerText = message;
    }

    function Dual( x, y, w, h, lower, upper, parent, padding )
    {
        var container = docs.ce( "div" );
            container.style.position = "absolute";
            container.style.width = w + px;
            container.style.height = h + px;
            container.style.left = x + px;
            container.style.top = y + px;
        docs.ac( parent, container );

        this.container = container;
        this.lower = lower;
        this.upper = upper;
        this.value = upper - lower;

        var cw = container.clientWidth;  
        var ch = container.clientHeight; 
        var hw = cw / 2;
        var hh = ch / 2;

        var axis, cc, width, height; 
        var colors = [ "darkred", "green" ];

        if ( w > h )
        {
            axis = "x";
            cc = cw / 2;
            x = cc;
            y = 0;
            width = hw;
            height = ch - padding * 2;    
        }
        else
        {
            axis = "y";
            cc = ch / 2;
            x = 0;
            y = cc;
            width = cw - padding * 2;
            height = hh;
            colors.reverse();
        }

        new Bar( x, y, 0, 1, upper, container, { x: { size: width }, y: { size: height } }, axis, colors[ 0 ], true, padding );
        new Bar( x, y, 0, 1, lower, container, { x: { size: width }, y: { size: height } }, axis, colors[ 1 ], false, padding );
    }

    function Bar( x, y, min, max, val, parent, axes, axis, color, reverse, padding )
    {
        Object.assign( axes.x, { prop: "width", pos: "left" } );
        Object.assign( axes.y, { prop: "height", pos: "top" } );
        
        var translate = { x: x, y: y };
        var range = max - min;
        var value = val / range;
        var px = "px";
        var keys = Object.keys( axes );
        var a = keys.indexOf( axis );
        var b = 1 - a;
        var c = axes[ keys[ a ] ];
        var d = axes[ keys[ b ] ];
        var e = value * c.size;
        var f = translate[ keys[ a ] ];
        var g = translate[ keys[ b ] ];

        this.value = val;
        this.normalized = value;

        var bar = docs.ce( "div" );
            bar.style.position = "absolute";
            bar.style[ c.prop ] = e + px;
            bar.style[ d.prop ] = d.size + px;
            bar.style[ c.pos ] = padding + ( reverse ? ( f - e ) : f ) + px;
            bar.style[ d.pos ] = padding + g + px;
            bar.style.backgroundColor = color;
        docs.ac( parent, bar );
    }