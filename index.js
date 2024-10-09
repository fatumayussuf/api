import express from "express";
import path from "path";
import { fileURLToPath } from "url";




let app=express();
let port=4000;


let _fileName = fileURLToPath(import.meta.url);
console.log(_fileName);


let _dirName = path.dirname(_fileName);
console.log(_dirName);


// use static express

app.use(express.static("public"));

// set up templating engines
app.set('view engine', 'pug')
app.set('views', './views')



let API_KEY ="5d20eef406d84f11a710a412a6df0a0e" ;


// Define a route to fetch recipe and brewery data
app.get('/', async (req, res) => {
    try {
        // Fetch recipe data from the Spoonacular API using the complexSearch endpoint
        let response = await fetch("https://api.spoonacular.com/recipes/complexSearch?query=pasta&maxFat=25&apiKey=5d20eef406d84f11a710a412a6df0a0e");
        let data = await response.json();
        console.log({ data });
        let recipes = data.results || []; // Access the array of recipes from the 'results' field

        // Fetch brewery data from the Open Brewery DB API
        let breweryResponse = await fetch('https://api.openbrewerydb.org/v1/breweries');
        let breweryData = await breweryResponse.json();
        let breweries = breweryData.slice(0, 10); // Limit to the first 10 breweries

        // Render both recipes and breweries using the 'home' view
        res.render('home', { recipes, breweries });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});







// // Define a route to fetch recipe data
// app.get('/', async (req, res) => {
//     try {
//         // Fetch recipe data from the Spoonacular API using the complexSearch endpoint
//         let response = await fetch("https://api.spoonacular.com/recipes/complexSearch?query=pasta&maxFat=25&apiKey=5d20eef406d84f11a710a412a6df0a0e");

//         let data = await response.json();
//         console.log({data});
//         let recipes = data.results; // Access the array of recipes from the 'results' field

//         // Render the data using the 'recipes' view, passing the recipes data
//         res.render('recipe', { recipes });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Internal Server Error');
//     }
// });


// app.get('/', async (req, res) => {

//     let response = await fetch('https://api.openbrewerydb.org/v1/breweries');

//     let  data2 = await response.json();
//     console.log({data2});

//     let breweries= data2;

//     res.render('breweries', {breweries});

//     res.send('Ok');
// });

// // menu fetching
// app.get('/menus', async (req, res) => {
    
//         let response = await fetch(`https://api.spoonacular.com/food/menuItems/search?query=burger&apiKey=${API_KEY}`);
//         let menuItems  = await response.json();
//         console.log({menuItems});
//         res.render('menus', { menuItems });
     
//         // res.send ("ok")
    
// });

// fetching menu and drinks at the same time 
app.get('/menus', async (req, res) => {
    try {
        // Fetch both menu items and drinks simultaneously
        const [menuResponse, drinksResponse] = await Promise.all([
            fetch(`https://api.spoonacular.com/food/menuItems/search?query=burger&apiKey=${API_KEY}`),
            fetch('https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Non_Alcoholic')
        ]);

        const menuItems = await menuResponse.json();
        const drinksData = await drinksResponse.json();

        // Limit drinks to 15 items
        const drinks = {
            ...drinksData,
            drinks: drinksData.drinks.slice(0, 12)
        };

        // Log the responses for debugging
        console.log({ menuItems, drinks });

        // Render the 'menus' template with both menu items and drinks
        res.render('menus', { menuItems, drinks });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Failed to load menu and drinks.');
    }
});




  

// Serve the about page from the public folder
app.get('/about', (req, res) => {
    res.sendFile(path.join(_dirName, 'public', 'about.html'));
});

// Serve the blog page from the public folder
app.get('/blog', (req, res) => {
    res.sendFile(path.join(_dirName, 'public', 'blog.html'));
});

// Serve the events page from the public folder
app.get('/events', (req, res) => {
    res.sendFile(path.join(_dirName, 'public', 'events.html'));
});

// Serve the gallery page from the public folder
app.get('/gallery', (req, res) => {
    res.sendFile(path.join(_dirName, 'public', 'gallery.html'));
});

// Serve the contact us  page from the public folder
app.get('/contact', (req, res) => {
    res.sendFile(path.join(_dirName, 'public', 'contact.html'));
});

// Serve the service  page from the public folder
app.get('/service', (req, res) => {
    res.sendFile(path.join(_dirName, 'public', 'service.html'));
});
  
app.get('/menus', (req, res) => {
    res.redirect('/menus');
});


// forms
// body parser
app.use(express.urlencoded({extended:true}));
// form handling
app.post("/contact", (req, res)=>{
    let {name, email, message , phone} = req.body;
    let data = {
        name,
        email,
        message,
        phone

    };
    console.log({data});
    

    res.send("ok");
});
 
//specifying where to access our app
app.listen(port, ()=>console.log(`server started on port ${port}`));