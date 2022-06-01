import docs from "../docs.js";

export async function load()
{
    var delay = 5000;
    var iterations = 0;
    var movement = 0;
    var position;
    var graph;

    const px = "px";
    const fields = [ "symbol", "bidPrice", "bidSize", "lastPrice", "lastSize", "askPrice", "askSize", "volatility" ];
    const parent = document.getElementById( "content" );
    const actions = {};
        actions.buy = function( action, position )
        {
            var qty = position.average() > position.quote ? position.size / ( Math.abs( movement ) * 100 ) : 0;
            var quantity = Math.ceil( position.quantity * qty );

            position.quantity += quantity;
            position.investment += position.value( position.quote, quantity );
            if ( quantity )
                position.count.gains = 0;
            position.count.losses += ( 1 - !quantity );

            log( action, position, quantity );
            
            setTimeout( query, delay );
        };
        actions.hold = function( action, position  )
        {
            var quantity = 0;

            position.quantity += quantity;
            position.investment += position.value( position.quote, quantity );

            log( action, position, quantity );
            
            setTimeout( query, delay );
        };
        actions.test = function( action, position )
        {   
            position.action = action;
            position.price = position.quote;
            position.investment = position.value( position.quote, position.quantity );
            position.initial =
            {
                price: position.price,
                quantity: position.quantity,
                investment: position.investment
            };

            log( "buy", position, position.quantity );
            
            setTimeout( query, delay );
        };
        actions.sell = function( action, position  )
        {
            var qty = position.average() < position.quote ? position.size : 0;
            var quantity = Math.ceil( position.quantity * qty );

            position.quantity -= quantity;
            position.investment -= position.value( position.quote, quantity );
            position.count.gains += ( 1 - !quantity );
            if ( quantity )
                position.count.losses = 0;

            log( action, position, quantity );
            
            setTimeout( query, delay );
        };

    function Position( ticker, price, quantity, lower, upper, size )
    {
        this.action = false;
        this.price = price;
        this.quote = price;
        this.change = () => this.quote - this.price;
        this.percentage = () => Math.round( this.change() / this.price * 100 ) / 100;
        this.quantity = quantity;
        this.ticker = ticker.toUpperCase();
        this.value = ( price, quantity ) => price * quantity;
        this.initial = { price: price, quantity: quantity, investment: this.value( price, quantity ) };
        this.investment = this.value( price, quantity );
        this.gains = 0;
        this.average = () => this.quantity ? this.investment / this.quantity : 0;
        this.limit = { lower: -lower / 100, upper: upper / 100 };
        this.gains = () => this.value( this.quote, this.quantity ) - this.investment;
        this.returns = 0;
        this.transactions = 0;
        this.size = ( size || 10 ) / 100;
        this.count = { gains: 0, losses: 0, up: 0, down: 0 };
    };

    async function getQuote( ticker )
    {
        var type = "random";

        switch ( type )
        {
            case "random":
                delay = 1000;
                let volatility = 5;
                let quote = Math.random() * volatility * 0.01 * Math.sign( 0.5 - Math.random() );
                return Math.max( position.price + quote, 0 ); 

            case "comparison":
                let quotes = [ 1.00, 0.98, 0.97, 0.95, 0.98, 0.94, 0.99, 0.97, 0.88, 0.97, 0.99, 1.00, 1.01 ];
                return quotes[ iterations % quotes.length ];

            case "loss":
                return position.initial.price + ( position.initial.price * iterations * position.limit.lower );

            case "gain":
                return position.initial.price + ( position.initial.price * iterations * position.limit.upper );

            case "real":
                const token = 
                {
                    "access_token": "TwHO6M9Ma1eGCPMcrc06hTaKuI+TO4fpuyw8Sz0M9QeOd5U/SqjpWKSBuADGHg+ku+fP6DSS/k8rUvBjvaw54kagrreP7DuAsblXQXVbo8FxE1L6ajS56u2l1tlkKhcpZbqyOmXtQikLSnwpe3IzhbS7cKf+aUbR92M21CVpXjIxAV+FL1QFCjNWaS302IYhnQn+Ck1tP1E7J04XiVT8De7wB2xfVgZTGgZLxozEYm4jkgbWnhu0IrODzLHklGeeQZxow4cPA3IezWtl+lIfpzxJq7Clb8LwBTlUeiZ16yDyGGlZw3PfFkcR3mFGGEZCURVgbWtryNlW6cnSVqJuq44tOHvEcawsUp3AyUlzEeF8syLgito3wOINznF8nCByjxU+Jvsq7E8hN2OShvrCaLZaCH32ERjL3xrjj5OSQD6BYlvfISubMcfcPU9cdKyXrQq+Vr93NPEoOo09PHEMIE/J8hbzOaegYsDVqPKwUVxAwdQLn1zSFBHYfpYRpxvuIjtTApaEdqCa2Ebikq0X7aqvjubqgyeDjjHJk100MQuG4LYrgoVi/JHHvlMcIpWo2zYroS5o8FiRrm1VG0qPAdTqtV2WGUhi0TxtCVG4M2eSyKABQSWzVrUF1eqTOL1Y3BlF6Kn0hfYogYI3uIViv5Tyj8ZvI+fndusewv4XSDwTbpWmRYcxXbYrJ2Bp6/tCbBJrG/SLzQn+emwA0wq1TKeb6/KRy9M/zr6GQcM++a8ScL0YaFv3CO7xblNos54TKks5vYiF53MuWd76MIx9PTNcfCKRbqPUjV332qGhlR5NkD7vbhpTi32WJXpyYA7PPvVgEPT504cIFQRuQcWtG4KM9ibEsMEeiiNFxo7ZKqKuR1JaSyEOR6xlJCnknxfcigSCVxUUxLCSggTVvA74sp8NljvrqDasd4MedLkBXm/0NIeKWN2mtKZUKHVcDE3zotONPFoJ7WrSxlK1TC80lIkmkVnwz2uKwX1QTSnn2X9JeTm+DVItTGQ0blfck5NOn4T5IsV7SDTkZHGURF/sOcOtn5FlglGWOIu9wldsDAyFljYkO9FLdHuxiqD7XM3v2CoRrH7zqxGpepRGV3u0odfdAHjKTWuw212FD3x19z9sWBHDJACbC00B75E",
                    "refresh_token": "clpj43ufi+uohYjcnJ1xu0XwwTq9HhIO74/W2JyZJVGA/B7l3g9zgxdoGaNmfEcnyfvfzn2PK7/8FtK8d9J7QjIWftZWm3Z4UTBySBeE+55DyaXKkNzbPselZNtlGedMOX26h3Br9SAWFrwJqUBFlNt7w6abwUI7QQjMB72vcMDNcPqhvdSRl20TRuiNBpktJnmLJAw287g46jdVOAJmeon6dwM3b78DiX2wBNcNzPamM1o4XtL1JQkTqMDCEth0NiS7qvfr8cD4Cxz4RnAaqgd9T7dtWg9QPdpBexKD4xo3k+CKDO9u3ePZ9iwzYtlD+HSpwFH9QAF2Wmpotsu6G77JVmEh8l6wDCwLDfAjaI29I3FypWhbEfX3Bg3+32mvtfF/sKb55E9kyPVFtP2dYF36HUNutB4zrdP1sm9yuudygF/u0oIMgsGKpL5100MQuG4LYrgoVi/JHHvlWBbi3s5mfZVYIKrsksXxaF8ISvM2S5V+lHTQX2DQ/BbM17OKcM1dUCmlEXWIi9X+WnZ4/UTP7FKciEzdTVRvlwliVQSv5uInQbw27sBdOPf1a6JWaSLuU/6x0JviR7q6xxHmukrlY/kb7/p6GV57yClIHIVUSOLVtc5xv6EDihOgTQOoglvjN8rhrSZiCOxzvu6TtuPX2w7w35zk04IsjcPJVxsfB+e1rQBr26hRWtrXmJMoiDsrte6H2KTnwA/8k2hvBn1iGMw5gCku5Qyk6wJGT9UYmJ/6Dqz3IZdiTK/OJaHLirvGh2IgAAp3S2U+y+ZoKKxaE9/GvzOGkLCZ4dxjOtLZP9XE+6d3EOtnRBUCAA6zQ46VEJdYYcL+/oyYPenwMTMNzEa16RogiQHp2MUq98SArNEH6cIJneXgeEW2KBloG2X2il6zXUo=212FD3x19z9sWBHDJACbC00B75E",
                    "scope": "PlaceTrades AccountAccess MoveMoney",
                    "expires_in": 1800,
                    "refresh_token_expires_in": 7776000,
                    "token_type": "Bearer"
                }
        
                let url = `https://api.tdameritrade.com/v1/marketdata/${ ticker }/quotes`;

                let config = 
                {
                    method: "GET",
                    mode: "cors",
                    headers: 
                    {
                        "Authorization": `${ token.token_type } ${ token.access_token }`
                    }
                };

                let response = await fetch( url, config );

                if ( response.ok );
                {
                    let json = await response.json();
                    let data = json.getValue();

                    return data.lastPrice;
                }

                return 0;
        }
    }

    function refresh( token )
    {
        var payload = 
        {
            grant_type: "refresh_token",
            refresh_token: token.refresh_token,
            client_id: token.client_id
        };

        var url = "https://developer.tdameritrade.com/authentication/apis/post/token-0";
        var request = new XMLHttpRequest();
            request.open( "POST", url );
            request.setRequestHeader( "Authorization", `${ token.token_type } ${ token.access_token }` );
            request.addEventListener( "load", ( e ) => console.log( e ) );
            request.addEventListener( "error", ( e ) => console.log( e ) );
            request.send( JSON.stringify( payload ) );

        console.error( token );
    }

    function format( value, precision )
    {
        var factor = Math.pow( 10, precision );
        
        return ( Math.round( value * factor ) / factor ).toFixed( precision );
    }

    async function query()
    {
        var action;

        position.quote = await getQuote( position.ticker );

        movement = position.percentage();

        if ( !position.price && position.quantity )
        {
            action = "test";  
        }
        else if ( movement >= position.limit.upper / ( position.count.gains + 1 ) )
        {
            action = "sell";
        }
        else if ( movement <= position.limit.lower * ( position.count.losses + 1 ) )
        {
            action = "buy";  
        }
        else
        {
            action = "hold";
        }

        execute( action ); 
    }

    function execute( action )
    {
        if ( position.quantity > 0 && position.quote > 0 )
        {
            actions[ action ].apply( null, [ action, position ] );

            iterations++;

            var w = 2;
            var value = 0;//( position.count.up - position.count.down ) / iterations;

            graph.add( new Split( ( w + 1 ) * iterations, 0, value, w, 100, 0 ) );
        }

        position.price = position.quote;

        // count movements
        if ( movement < 0 )
            position.count.down++;
        else if ( movement > 0 )
            position.count.up++;
    }

    function timeline( quote )
    {

    }

    function table()
    {
        var table = docs.ce( "table" );
        docs.ac( parent, table );

        var thead = docs.ce( "thead" );
        docs.ac( table, thead );

        var columns = docs.ce( "tr" );
        docs.ac( thead, columns );

        fields.forEach( field =>
        {
            var cell = docs.ce( "td" );
                cell.classList.add( "column" );
                cell.innerText = field;
            docs.ac( columns, cell );
        } );

        var tbody = docs.ce( "tbody" );
            tbody.id = "data";
        docs.ac( table, tbody );
    }

    function display( request, token )
    {
        var response = JSON.parse( request.response );

        if ( response.hasOwnProperty( "error" ) )
        {
            refresh( token );
            return;
        }

        var quote = response.getValue();

        position.price = quote.lastPrice;
        position.quote = quote.lastPrice;

        console.log( quote );
        console.log( position );

        var tbody = document.getElementById( "data" );

        var tr = docs.ce( "tr" );
            tr.setAttribute( "data-id", quote.symbol );
        docs.ac( tbody, tr );

        fields.forEach( field =>
        {
            var cell = docs.ce( "td" );
                cell.classList.add( "cell" );
                cell.innerText = quote[ field ];
            docs.ac( tr, cell );
        } );
    }

    function standardize( input )
    {
        var output = {};

        return output;
    }

    function log( action, position, quantity )
    {
        let css;
        let tab = "\t";
        //let price = format( position.price, 2 );
        let quote = format( position.quote, 2 );
        let amount = format( position.value( position.quote, quantity ), 2 );
        let value = format( position.value( position.quote, position.quantity ), 2 );
        let average = format( position.average() , 2 );
        let investment = format( position.investment, 2 );
        let gains = format( position.gains(), 2 );
        let returns = 0;

        switch ( action )
        {
            case "sell":
                if ( !quantity )
                {
                    css = "color: #060";
                    position.action = false;
                }
                else
                {
                    css = position.quantity ? "background: #060" : "background: #660";
                    position.returns += position.gains();
                    position.transactions++;
                    position.action = action;
                    returns = format( position.returns, 2 );
                }
            break;

            case "buy":
                if ( !quantity )
                {
                    css = "color: #600";
                    position.action = false;
                }
                else
                {
                    css = "background: #600";
                    position.transactions++;
                    position.action = action;
                }
            break;

            case "hold":
                css = "color: #666";
                position.action = false;
            break;
        }

        let actions = position.action ? `${ position.action.toUpperCase() } ${ quantity } x ${ quote } = ${ amount }` : `${ action } ${ quantity } @ ${ quote } = ${ amount }`;     
        let fields = 
        [ 
            iterations, 
            //new Date().toLocaleTimeString(), 
            //`previous: ${ price }`,
            position.transactions,
            `${ actions }`,  
            `quantity: ${ position.quantity }`,
            `value: ${ value }`, 
            `average cost: ${ average }`, 
            `total cost: ${ investment }`,
            `gains: ${ gains }`,
            `returns: ${ returns }`,
            `trend: ${ JSON.stringify( position.count ) }`,
            //`change: ${ format( position.percentage(), 2 ) }%`,
            //`$${ format( position.quote - position.price, 2 ) }`
        ];
        let output = fields.join( tab );

        console.log( `%c ${ output }`, css );
    };
 
    function init()
    {
        // ticker, price, quantity, low delta percent, high delta percent, size of shares percent
        position = new Position( "BKSY", 0.3, 100, 1, 1, 25 );
        
        //;
        graph = new Graph( parent );
        //table();
        query();
    }

    // plotting functions
    function Graph( parent )
    {  
        var container = docs.ce( "div" );
            container.style.border = "1px solid #333";
            container.style.position = "relative"; 
            container.style.height = 100 + px;     
        docs.ac( parent, container );  

        this.add = function( object )
        {
            docs.ac( container, object.container );
        }
    }

    function Split( x, y, value, w, h, padding )
    {
        var container = docs.ce( "div" );
            container.style.position = "absolute";
            container.style.width = w + px;
            container.style.height = h + px;
            container.style.left = x + px;
            container.style.top = y + px;
        docs.ac( parent, container );

        this.container = container;
        this.value = value;

        var cw = container.clientWidth;  
        var ch = container.clientHeight; 
        var hw = cw / 2;
        var hh = ch / 2;
        
        var v = value * 0.5;
        var lower = ( v < 0 )  ? Math.abs( v ) : 1 - v;
        var upper = ( v > 0 )  ? v : 1 - Math.abs( v );

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

        console.log( lower, upper )

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

        var bar = docs.ce( "div" );
            bar.style.position = "absolute";
            bar.style[ c.prop ] = e + px;
            bar.style[ d.prop ] = d.size + px;
            bar.style[ c.pos ] = padding + ( reverse ? ( f - e ) : f ) + px;
            bar.style[ d.pos ] = padding + g + px;
            bar.style.backgroundColor = color;
        docs.ac( parent, bar );
    }

    init();
}