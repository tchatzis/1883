export async function load()
{
    let tabs = await import( `./tabs.js` );
    await tabs.load.call( this );

    let thead = await import( `./thead.js` );
    await thead.load.call( this ); 

    let tbody = await import( `./tbody.js` );
    await tbody.load.call( this );
};