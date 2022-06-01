export default function ( config )
{    
    this.populate = ( config ) => config.model.callback();

    ( async () => await config.model.data.load.call( this, config ) )(); 
}