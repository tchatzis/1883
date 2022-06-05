import docs from "./docs.js";

export default function Charts()
{       
    var charts = this;
    
    this.data = [];
    this.marks = [];
    this.scale = {};
    this.initial = {};

    this.not = function( bool )
    {
        return 1 - Number( bool );
    };

    this.other = function( prop, value )
    {
        var index = this[ prop ].indexOf( value );

        return this[ prop ][ this.not( index ) ];
    };

    this.init = function( config )
    {
        var canvas = docs.ce( "canvas" );
            canvas.width = config.width;
            canvas.height = config.height;
            canvas.style.backgroundColor = config.background || "black";
        docs.ac( config.parent, canvas );

        var axes = [ "minor", "major" ];
        var props = [ "width", "height" ];
        var orientations = [ "landscape", "portrait" ];
        var predicate = config.height > config.width;
        var a = this.not( !predicate );
        var b = this.not( a );

        this.axes = axes;
        this.props = props;
        this.orientations = orientations;
        this.ctx = canvas.getContext( "2d" );
        this.width = config.width;
        this.height = config.height;
        this.orientation = 
        {
            chart: { name: orientations[ a ] },
            item: {}
        };
        this.spacing = config.spacing || 0;
        this.background = canvas.style.backgroundColor;

        this.major =
        {
            size: config[ props[ a ] ],
            prop: props[ a ]  
        };

        this.minor =
        {
            size: config[ props[ b ] ],
            prop: props[ b ]
        };

        return this;
    };

    this.add = function( parameters )
    {
        this.clear();

        this.orientation.item.name = parameters.config.orientation || this.orientation.chart.name;
        this.orientation.match = this.orientation.chart.name == this.orientation.item.name;

        this.orientation.chart.limit = this.orientation.match ? "minor" : "major";
        this.orientation.chart.axis = this.other( "axes", this.orientation.chart.limit );

        var length = parameters.class == "Multi" ? parameters.config.value.length : 1;
        var size = parameters.config.size + this.spacing;
        var count = Math.floor( this[ this.orientation.chart.limit ].size / ( size * length ) );
        var p = { ...parameters };

        if ( count && this.data.length == count )
            this.data.shift();

        this.data.push( parameters.config.value );
        this.data.forEach( ( value, index ) =>
        {
            p.config.value = value;
            p.config.index = index;
            p.config.offset = index * size;
            
            this.draw( p );
        } );
    };

    this.clear = function()
    {
        this.ctx.clearRect( 0, 0, this.width, this.height );
    };

    this.draw = function( parameters )
    {
        this[ parameters.class ].call( this, parameters.config );
    };

    this.line = ( from, to ) => 
    {
        this.ctx.beginPath();
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = "white";
        this.ctx.setLineDash( [ 5, 5 ] );
        this.ctx.moveTo( ...from );
        this.ctx.lineTo( ...to );
        this.ctx.stroke();
        this.ctx.setLineDash( [] );
    };

    this.max = ( value ) => Math.pow( 10, Math.ceil( Math.log10( value ) ) );

    this.normalize = ( value ) => value ? value / this.max( value ) : value;

    this.setScale = ( value, index ) =>
    {
        if ( !this.scale[ index ] )
        {
            this.scale[ index ] = this.max( value );
            this.initial[ index ] = { value: value };
        }
    };

    this.value = () => this.data;

    async function load( script )
    {
        let chart = await import( `./charts/${ script.toLowerCase() }.js` );

        charts[ script ] = chart.default;
    };

    [ 
        "Bar", 
        "Dual",
        "Line",
        "Multi",
        "Pie",
        "Ring",
        "Threshold"
    ].forEach( async ( script ) => await load( script ) );
};