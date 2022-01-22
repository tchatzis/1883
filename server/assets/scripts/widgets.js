import Data from "./data.js";
import doc from "./doc.js";

//await data.query( { url: `/query`, sort: params.sort, query: params.query, key: "storage" } );




var Widgets = function()
{   
    var scope = this;
    
    async function load( params )
    {
        var d = new Data();

        if ( params.path )
        {
            await d.path( params );

            let values = [];
            let data = {};
            
            d.data.forEach( row =>
            {
                data.name = Object.keys( row )[ 0 ];
                data.values = row[ data.name ];
            } );

            this.data = data;
        }

        if ( params.query )
        {
            await d.query( { url: `/query`, sort: params.sort, query: params.query } );

            let values = [];
            
            d.data.forEach( row =>
            {
                values.push( row[ Object.keys( row ) ] );
            } );

            this.data = { name: params.name, values: values };
        }

        this.populate();
    }

    function block( params )
    {
        var label = doc.ce( "div" );
            label.classList.add( "column" );
        doc.ac( params.element, label );

        var div = doc.ce( "div" );
            div.classList.add( "input" );
        doc.ac( params.element, div );

        return { label: label, div: div };
    }

    this.Datalist = function( params )
    {
        var el = block( params );

        this.populate = function()
        {   
            if ( this.data )
            {
                el.label.innerText = this.data.name

                var input = doc.ce( "input" );
                    input.setAttribute( "list", this.data.name );
                    input.name = this.data.name;
                    input.value = params.value;
                doc.ac( el.div, input );

                var datalist = doc.ce( "datalist" );
                    datalist.id = this.data.name;
                doc.ac( el.div, datalist );
                
                this.data.values.forEach( ( value, i ) =>
                {
                    console.log( value, params );
                    let option = doc.ce( "option" );
                        option.value = value[ params.field ];
                    doc.ac( datalist, option );
                } ); 
            }
        };

        load.call( this, params );
    };
    
    this.Radio = function( params )
    {
        var el = block( params );

        this.populate = function()
        {
            if ( this.data )
            {
                el.label.innerText = this.data.name
                
                this.data.values.forEach( ( value, i ) =>
                {
                    let input = doc.ce( "input" );
                        input.type = "radio";
                        input.name = this.data.name;
                        input.id = `${ this.data.name }${ i }`;
                        input.value = value;
                    if ( params.value && params.value == value )
                        input.setAttribute( "checked", params.value );
                    if ( params.required )
                        input.setAttribute( "required", params.required );
                    doc.ac( el.div, input );

                    let label = doc.ce( "label" );
                        label.setAttribute( "for", input.id );
                        label.innerText = value + " ";
                    doc.ac( el.div, label );
                    
                    if ( !params.nobreak )
                    {
                        let br = doc.ce( "br" );
                        doc.ac( el.div, br );
                    }
                } ); 
            }
        };

        load.call( this, params );
    };
};

export default Widgets;