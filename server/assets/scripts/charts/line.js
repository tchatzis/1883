export default function Line( config )
{
    var size = this[ this.orientation.chart.axis ].size;
    var index = 0;
    
    this.clear();
    this.line( [ 0, size / 2 ], [ this[ this.orientation.chart.limit ].size, size / 2 ] );
    this.ctx.beginPath();
    this.ctx.strokeStyle = config.color[ index ];
    this.ctx.lineWidth = 2;

    for ( let i = 0; i < this.data.length; i++ )
    {    
        let offset = ( config.size + this.spacing ) * i;
        let value = this.normalize( this.data[ i ][ index ] ) * size;
        let point = [ offset, size - value ];
        let action = "lineTo";

        if ( !i )
            action = "moveTo";

        this.ctx[ action ]( ...point );
    }

    this.ctx.stroke();
    
    /*config.value.forEach( ( value, index ) =>
    {
        if ( index )
            return;

        //
        
        

        //
        this.ctx.strokeStyle = config.color[ index ];
        this.ctx.moveTo( ...point );
        if ( this.point )
            this.ctx.lineTo( ...this.point );

        //console.log( "moveTo", this.point, "lineTo", point );
 
        this.point = [ ...point ];
        this.ctx.stroke();


        

        var plot = {};
            plot.landscape = function()
            {
                //this.c
                //let shift = 0;
                //this.ctx.fillRect( shift, config.offset + index, value, config.size )
            };

            plot.portrait = function()
            {
                //let shift = size - value;
                //this.ctx.fillRect( config.offset + index, shift, config.size, value ); 
            };

            //plot[ this.orientation.item.name ].call( this );

        
    } );*/
}