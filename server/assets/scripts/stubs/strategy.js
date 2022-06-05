import docs from "../docs.js";
//import apikeys from "../../../../apikeys.js";

export async function load()
{
    var delay = 5000;
    var iterations = 0;
    var movement = 0;
    var position;
    var charts = this.imports.charts;
    var widgets = this.imports.widgets;
    var chart;
    var debug = false;
    var balance = 10000;

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
            position.count.losses += ( 1 - !quantity );
            if ( quantity )
            {
                balance -= position.quote * quantity;
                position.count.gains = 0;
                widgets.add( { class: "Log", config: { value: `${ action } ${ quantity } @ ${ format( position.quote, 2 ) } | ${ format( balance, 2 ) }`, parent: parent, color: "red" } } );
            }

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
            {
                balance += position.quote * quantity;
                position.count.losses = 0;
                widgets.add( { class: "Log", config: { value: `${ action } ${ quantity } @ ${ format( position.quote, 2 ) } | ${ format( balance, 2 ) }`, parent: parent, color: "green" } } );
            }

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
                let quote = Math.random() * volatility * 0.01 * Math.sign( 0.5 - Math.random() ) * position.price;
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
                    "access_token": "a",
                    "refresh_token": "b",
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
        count();
        plot();

        position.price = position.quote;
    }

    function execute( action )
    {
        if ( position.quantity > 0 && position.quote > 0 )
        {
            actions[ action ].apply( null, [ action, position ] );

            iterations++;
        }
    }

    function count()
    {
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

        if ( debug )
            console.log( `%c ${ output }`, css );
    };

    var o =
    {
        ll: { w: 300, h: 100, o: "landscape" },
        lp: { w: 300, h: 100, o: "portrait" },
        pp: { w: 100, h: 300, o: "portrait" },
        pl: { w: 100, h: 300, o: "landscape" }
    };

    var t = "lp";
    var u = "Threshold";

    function init()
    {
        // ticker, price, quantity, low delta percent, high delta percent, size of shares percent
        position = new Position( "BKSY", 38, 100, 1, 1, 25 );
        
        charts.init( { parent: sub, width: o[ t ].w, height: o[ t ].h, spacing: 2 } );
        charts.add( { class: u, config: { size: 8, orientation: o[ t ].o, value: [ balance ], color: [ "red", "green" ] } } ); 
        //table();
        query();
    }

    function plot()
    {
        charts.add( { class: u, config: { size: 8, orientation: o[ t ].o, value: [ balance ], color: [ "red", "green" ] } } );  
    }

    init();
}