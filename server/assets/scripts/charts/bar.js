export default function Bar( config )
{
    config.value.forEach( ( value, index ) =>
    {
        if ( !this.scale[ index ] )
            this.scale[ index ] = this.normalize( config.value[ index ] );

        console.warn( this.scale[ index ] );
        
        var size = this[ this.orientation.chart.axis ].size;
        var normalized = this.normalize( config.value[ index ] );
        var value = normalized * size;

        this.ctx.beginPath();
        this.ctx.fillStyle = config.color[ index ];

        var plot = {};
            plot.landscape = function()
            {
                let shift = 0;
                this.ctx.fillRect( shift, config.offset + index, value, config.size )
            };

            plot.portrait = function()
            {
                let shift = size - value;
                this.ctx.fillRect( config.offset + index, shift, config.size, value ); 
            };

            plot[ this.orientation.item.name ].call( this );
    } );
}