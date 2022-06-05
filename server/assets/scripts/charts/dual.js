export default function Dual( config )
{
    var size = this[ this.orientation.chart.axis ].size;
    
    config.value.forEach( ( value, index ) =>
    {
        this.setScale( value, index );
 
        var origin = size / 2;
        var normalized = this.normalize( value );
        var value = normalized * origin;
        var flip = this.orientation.item.name == "portrait" ? index : this.not( index );
        var shift = origin - ( flip * value );

        this.ctx.beginPath();
        this.ctx.fillStyle = config.color[ index ];

        var plot = {};
            plot.landscape = function()
            {
                this.ctx.fillRect( shift, config.offset, value, config.size )
            };

            plot.portrait = function()
            {
                this.ctx.fillRect( config.offset, shift, config.size, value ); 
            };

            plot[ this.orientation.item.name ].call( this );
    } );

    this.line( [ 0, size / 2 ], [ this[ this.orientation.chart.limit ].size, size / 2 ] );
}