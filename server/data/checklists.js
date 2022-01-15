const allergen = "Contains allergen";
const bitesized = "Bite-sized pieces";
const condiments = [ "Ketchup", "Mayo", "Mustard", "Relish" ];
const hotbox = "Warm in hot box";
const hp = "Half Pan";
const nonuts = "No nuts";
const overfry = "Do not fry too long. Finish in oven if darkening too soon. 165 F internal temp";
const quesadillas = "Fill one half of tortilla. Do not overfill. Fold over and cook on flat top. Cut the half moon into quarters. Place parchment paper on bottom of pan and between layers";
const wash = "Washed";

// options
const options =
{
    "6 inch Tortillas":
    [
        {
            option: "Flour",
            notes: hotbox
        }, 
        {
            option: "Corn",
            notes: hotbox
        },        
    ],

    
    "Assorted Sliced Cheese Tray":
    [
        {
            option: "Cheddar",
        },
        {
            option: "Pepper Jack"
        },
        {
            option: "American"
        },
        {
            option: "Mozzarella"
        },
        { 
            option: "Provolone"
        }
    ],
    "Berries":
    [
        {
            option: "Blackberries",
            notes: wash
        },
        {
            option: "Blueberries",
            notes: wash
        },
        {
            option: "Raspberries",
            notes: wash
        },
        {
            option: "Strawberries",
            notes: wash
        },       
    ],   
    "Cookies":
    [
        {
            option: "Sugar",
            notes: nonuts
        },
        {
            option: "Double Chocolate",
            notes: nonuts
        },
        {
            option: "Carnival",
            notes: nonuts
        },
        {
            option: "Chocolate Chip",
            notes: nonuts
        },
        {
            option: "White Chocolate Macadamia",
            notes: allergen
        },
        {
            option: "Peanut Butter",
            notes: allergen
        }
    ],
    "Fruit":
    [
        {
            option: "Canteloupe",
            notes: bitesized
        },
        {
            option: "Grapes",
            notes: "Washed and separated"
        },
        {
            option: "Honeydew",
            notes: bitesized
        },
        {
            option: "Pineapple",
            notes: bitesized
        },   
    ],
    "Fajita Toppings":
    [
        {
            option: "Guacamole",
            notes: "Make 1 hour max before delivery"
        },   
        {
            option: "Cheddar",
            notes: "Shredded"
        },        
    ],      
    "Grilled Vegetables":
    [
        { 
            option: "Asparagus",
            notes: ""
        },
        { 
            option: "Broccoli",
            notes: "Florets"
        },
        { 
            option: "Cauliflower",
            notes: "Slabs"
        },
        { 
            option: "Green Beans",
            notes: "Blanched"
        },
        { 
            option: "Green Onions",
            notes: "Trimmed"
        },
        { 
            option: "Green Peppers",
            notes: "Julienned"
        },
        { 
            option: "Red Peppers",
            notes: "Julienned"
        },
        { 
            option: "Red Onions",
            notes: "Sliced"
        },
        {
            option: "Squash",
            notes: "Cut on bias"
        },
        {
            option: "Zucchini",
            notes: "Cut on bias"
        }       
    ],
    "Hamburger Buns":
    [
        {
            option: "Sourdough",
            notes: "Preferred"
        },
        {
            option: "Kaiser",
            notes: ""
        },  
        {
            option: "Brioche",
            notes: ""
        }
    ],
    "Hot Dog Toppings":
    [
        {
            option: "Cheddar",
            notes: "Shredded"
        },
        {
            option: "White Onions",
            notes: "Diced"
        },           
    ],   
    "LTOP Tray":
    [
        {
            option: "Lettuce",
            notes: wash
        },
        {
            option: "Tomatoes",
            notes: "Sliced"
        }, 
        {
            option: "Red Onions",
            notes: "Thinly Sliced"
        }, 
        {
            option: "Pickles",
            notes: "Chips"
        }, 
    ],
    "Shredded Cheese":
    [
        {
            option: "Cheddar",
            notes: ""
        },
        {
            option: "Monterey Jack",
            notes: ""
        },         
    ],      
    "Tortilla Chips":
    [
        {
            option: "Tri-Color - Frozen",
            notes: "Deep Fry Day Of Event"
        },
        {
            option: "Tri-Color - Bagged",
            notes: "Remove Small Pieces"
        },           
    ],

    "Queso":
    [
        {
            option: "Plain",
            notes: "Mix in Green Chiles"
        },
        {
            option: "Bravo",
            notes: "DO NOT Add Green Chiles"
        }
    ],
    "Vegetables":
    [
        { 
            option: "Baby Carrots",
            notes: ""
        },
        { 
            option: "Broccoli",
            notes: "Florets"
        },
        { 
            option: "Carrots",
            notes: "Sticks"
        },
        { 
            option: "Cauliflower",
            notes: "Florets"
        },
        { 
            option: "Celery",
            notes: "Sticks"
        },
        { 
            option: "Green Beans",
            notes: "Blanched"
        },
        { 
            option: "Green Peppers",
            notes: "Julienned"
        },
        { 
            option: "Red Peppers",
            notes: "Julienned"
        },
        {
            option: "Squash",
            notes: "Sticks"
        },
        {
            option: "Zucchini",
            notes: "Sticks"
        }       
    ],
    "Wings":
    [
        { 
            option: "Texas Hot"
        },
        {
            option: "Texas Mild"
        },
        {
            option: "BBQ"
        }
    ]
};

const Options = function( name, type )
{
    this.name = name;
    this.value = options[ name ];
    this.type = type || "radio";
}

// data
var data =
[
    {
        title: "All Beef Hot Dog Bar",
        quantity: 16,
        item: "Grilled 1/4 lb Franks",
        with: [ "Buns" ],
        options: [],
        extras: [ hp + " of Chili" ],
        sides: [ new Options( "Hot Dog Toppings" ) ],
        condiments: condiments,
        notes: "Warm buns in hot box",
        plating: hp
    },
    {
        title: "Mini All Beef Corn Dogs",
        quantity: "Top Up",
        item: "Beef Corn Dogs",
        with: [],
        options: [],
        extras: [],
        sides: [],
        condiments: [ "Ketchup", "Mustard" ],
        notes: "Be sure not to use the chicken corn dogs",
        plating: hp
    },
    {
        title: "Beef Sliders",
        quantity: 24,
        item: "Assembled Sliders",
        with: [ "Slider Bun" ],
        garnish: [ "Skewered Grape Tomato & Pickle Chip" ],
        options: [],
        extras: [],
        sides: [ new Options( "Assorted Sliced Cheese Tray", "checkbox" ) ],
        condiments: condiments,
        notes: "Warm buns in hot box. Split cheese slices into 2 triangles",
        plating: hp
    },
    {
        title: "Fresh Angus Beef Burgers",
        quantity: 16,
        item: "Grilled Patties",
        with: [ "Angus Beef Patties", "Buns" ],
        options: [ new Options( "Hamburger Buns" ) ],
        extras: [],
        sides: [ new Options( "Assorted Sliced Cheese Tray", "checkbox" ), new Options( "LTOP Tray", "checkbox" ) ],
        condiments: condiments,
        notes: "Warm buns in hot box",
        plating: hp
    },
    { 
        title: "Blackened Chicken Sliders",
        quantity: 24,
        item: "Assembled Sliders",
        with: [ "Grilled Chicken Breast", "Toasted Slider Bun", "Chimichurri", "Triangle of Sliced Cheese" ],
        garnish: [ "Skewered Grape Tomato & Pickle Chip" ],
        options: [],
        extras: [],
        sides: [],
        condiments: [],
        notes: "Slice breast in half, on a bias, to about 2 1/2 oz",
        plating: hp
    },
    {
        title: "Chicken and Cheese Quesadillas",
        quantity: 3,
        item: "12 inch Flour Tortillas",
        with: [ "Diced Grilled Chicken", "Diced Fire Roasted Red Peppers", "Shredded Monterey Jack Cheese", "Shredded Cheddar Cheese", "Cilantro" ], 
        options: [],
        extras: [],
        sides: [],
        condiments: [ "Chipotle Sour Cream" ],
        notes: quesadillas,
        plating: hp
    },
    {
        title: "Fire Roasted Red Peppers and Cheese Quesadillas",
        quantity: 3,
        item: "12 inch Flour Tortillas",
        with: [ "Diced Fire Roasted Red Peppers", "Shredded Monterey Jack Cheese", "Shredded Cheddar Cheese", "Cilantro" ], 
        options: [],
        extras: [],
        sides: [],
        condiments: [ "Chipotle Sour Cream" ],
        notes: quesadillas,
        plating: hp
    },
    {
        title: "Crispy Hand Battered Peppered Chicken Tenders",
        quantity: "5 lbs",
        item: "Breaded Chicken Tenders",
        with: [],
        options: [],
        extras: [],
        sides: [],
        condiments: [ "Ranch", "Honey Mustard", " BBQ" ],
        notes: overfry,
        plating: hp
    },
    {
        title: "Traditional Wings",
        quantity: "5 lbs",
        item: "Chicken Wings",
        with: [ "Carrot Sticks", "Celery Sticks" ],
        options: [ new Options( "Wings" ) ],
        extras: [],
        sides: [],
        condiments: [ "Ranch" ],
        notes: "",
        plating: hp        
    },
    {
        title: "Seasonal Fresh Vegetable Display",
        quantity: "Fill",
        item: "Vegetables",
        with: [],
        options: [ new Options( "Vegetables", "checkbox" ) ],
        extras: [],
        sides: [],
        condiments: [ "Ranch" ],
        notes: "Use available vegetables. Blanche what is required. Make it beautiful",
        plating: "18 x 18 Platter"        
    },
    {
        title: "Seasonal Grilled Vegetable Display",
        quantity: "Fill",
        item: "Grilled Vegetables",
        with: [],
        garnish: [ "Chopped Parsley" ],
        options: [ new Options( "Grilled Vegetables", "checkbox" ) ],
        extras: [],
        sides: [],
        condiments: [],
        notes: "Use available vegetables. Grill peppers whole then cut. Make it beautiful",
        plating: "18 x 18 Platter"        
    },
    {
        title: "Seasonal Fresh Fruit Bowl",
        quantity: "Fill",
        item: "Sliced Fruit and Berries",
        with: [],
        options: [ new Options( "Fruit", "checkbox" ), new Options( "Berries", "checkbox" ) ],
        extras: [],
        sides: [],
        condiments: [ "Black Currant Dip" ],
        notes: "Use what is available. Nicely decorated",
        plating: "18 x 18 Platter"        
    },
    {
        title: "Southwestern Chicken Egg Rolls",
        quantity: 12,
        item: "Southwestern Chicken Egg Rolls",
        with: [],
        options: [],
        extras: [],
        sides: [],
        condiments: [ "Chipotle Sour Cream" ],
        notes: "Cut in half, on a 45 degree bias",
        plating: hp        
    },
    {
        title: "Bevo Bites",
        quantity: 3,
        item: "Assorted Appetizers each",
        with: [ "Southwestern Chicken Egg Rolls", "Popcorn Chicken", "Mini Corn Dogs" ],
        options: [],
        extras: [],
        sides: [],
        condiments: [ "Ranch", "Chipotle Sour Cream", "Ketchup" ],
        notes: "8 egg rolls per order, cut in half, on a 45 degree bias. " + overfry,
        plating: "1/3 Pan"        
    },
    {
        title: "Longhorn Trio",
        quantity: "Fill",
        item: "Tri-color Tortilla Chips",
        with: [],
        options: [ new Options( "Tortilla Chips" ) ],
        extras: [],
        sides: [],
        condiments: [ "Red Salsa", "Salsa Verde", "Guacamole" ],
        notes: "Guacamole to be made within an hour before pickup. Press the plastic wrap right up against the surface to prevent color change",
        plating: "#5 Bowl"        
    },
    {
        title: "1883 Chips and Queso",
        quantity: "1 bag",
        item: "Queso",
        with: [ "#5 Bowl of Tri-Color Tortilla Chips" ],
        options: [ new Options( "Tortilla Chips" ), new Options( "Queso" ) ],
        garnish: [ "Pico de Gallo" ],
        extras: [ "Chorizo" ],
        sides: [],
        condiments: [],
        notes: "Spray pan with non-stick. Steam queso for 30 minutes or bring temp to 145 F",
        plating: hp        
    },
    {
        title: "Frank Erwin Fajita Bar",
        quantity: 1,
        item: "of Chicken and Beef Fajita each",
        with: [ "Chicken", "Beef" ],
        garnish: [ "Chopped Cilantro" ],
        options: [],
        extras: [ "Refried Beans", "Spanish Rice" ],
        sides: [ new Options( "Fajita Toppings", "checkbox" ), new Options( "6 inch Tortillas", "checkbox" )  ],
        condiments: [ "Sour Cream", "Red Salsa", "Salsa Verde" ],
        notes: "",
        plating: hp        
    },
    {
        title: "Bandera Salad",
        quantity: "Pile",
        item: "Mixed Greens",
        with: [],
        garnish: [ "Grated Queso Fresco", "Black Beans", "Tri-color Tortilla Strips", "Roasted Corn", "Avocado Slices", "Pico de Gallo" ],
        options: [],
        extras: [],
        sides: [],
        condiments: [ "Cilantro Vinagrette", "Chipotle Ranch" ],
        notes: "Lay bands of the garnish across the salad",
        plating: "Large Oval Platter"        
    },   
    {
        title: "Assorted Sweet Street Dessert Bars",
        quantity: 24,
        item: "Frozen Dessert",
        with: [],
        garnish: [ "Berries", "Mint" ],
        options: [],
        extras: [],
        sides: [],
        condiments: [],
        notes: "",
        plating: "18 x 18 Platter"        
    },
    {
        title: "Assorted Cookies and Brownies",
        quantity: 12,
        item: "Total of each Fresh Cookies and Frozen Brownies",
        with: [],
        garnish: [ "Berries", "Mint" ],
        options: [ new Options( "Cookies", "checkbox" ) ],
        extras: [],
        sides: [],
        condiments: [],
        notes: "",
        plating: "Large Rectangular Platter"        
    },
    {
        title: "Assorted Cookies",
        quantity: 14,
        item: "Fresh Cookies",
        with: [],
        garnish: [ "Berries", "Mint" ],
        options: [ new Options( "Cookies", "checkbox" ) ],
        extras: [],
        sides: [],
        condiments: [],
        notes: "",
        plating: "Small Rectangular Platter"        
    },
    /*{
        title: "",
        quantity: "",
        item: "",
        with: [],
        garnish: [],
        options: [],
        extras: [],
        sides: [],
        condiments: [],
        notes: "",
        plating: hp        
    }*/
];

var submenu = data.sort( ( a, b ) => ( a.title > b.title ) ? 1 : -1 );

module.exports.location = function( title )
{   
    return data.findIndex( ( obj ) => obj.title == title );
};

module.exports.submenu = submenu;
module.exports.data = data;