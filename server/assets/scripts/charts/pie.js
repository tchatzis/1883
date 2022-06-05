export default function Pie( config )
{
    var start = 0;
    var end = 0;
    var radius = Math.min( this.width, this.height ) / 2 - this.spacing;
    var circle = Math.PI * 2;
    var center = [ this.width / 2, this.height / 2 ];

    this.clear();

    config.value.forEach( ( value, index ) =>
    { 
        end = value * circle + start;
        
        this.ctx.beginPath();
        this.ctx.fillStyle = config.color[ index ];
        this.ctx.arc( ...center, radius, start, end );
        this.ctx.lineTo( ...center );
        this.ctx.closePath();
        this.ctx.fill();
        
        start = end;
    } );
}