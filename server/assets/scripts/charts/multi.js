export default function Multi( config )
{
    var offset = config.offset * config.value.length;
    
    config.value.forEach( ( value, index ) =>
    {
        var size = this[ this.orientation.chart.axis ].size;
        var value = config.value[ index ] * size;

        this.ctx.beginPath();
        this.ctx.fillStyle = config.color[ index ];

        var plot = {};
            plot.landscape = function()
            {
                let shift = 0;
                this.ctx.fillRect( shift, offset + index * config.size, value, config.size )
            };

            plot.portrait = function()
            {
                let shift = size - value;
                this.ctx.fillRect( offset + index * config.size, shift, config.size, value ); 
            };

            plot[ this.orientation.item.name ].call( this );
    } );
}