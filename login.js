let express = require('express');

let bodyParser = require('body-parser');

let MongoClient = require('mongodb').MongoClient;

//Path allows me to join files
let path = require('path');

let app = express();

app.use(express.urlencoded({extended:true}));

 app.use(express.static(__dirname));

 app.use("static/styles", express.static(path.join(__dirname, "/bootstrap/dist/css"))); 

// Allows me to join the directory and the static files, so I can use css
app.use(express.static(path.join(__dirname, 'static')));

app.use(express.json());

app.use((req, res, next) => {
res.append("Access-Control-Allow-Origin", ["*"]);
res.append("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
res.append("Access-Control-Allow-Headers", "Content-Type");
next();
});

/**
 * Creates login in form and links to css page
 */
app.get('/login', (req, res) => {
    let form = `
    <link rel="stylesheet" type="text/css" href="static/login.css">
    <nav class="loginNav">
    <a href='/index.html' class='home'>queue</a>
    </nav>
    <div class="main">
      <form action="/login" method="post" name="logForm" class="logForm">
      Enter Username:
      <input type="text" name="username"/>
      <br/>
      <br/>
      Enter Password:
      <input type="text" name="password"/>
      <br/>
      <br/>
      <button type="submit">Submit</button>
  </form>
  </div>
      `;
      
  res.send(form)
  
});
/**
 * Post the login form to the server and validates users credentials
 */
 app.post('/login', (req, res) => {
    
  
    MongoClient.connect('mongodb://localhost:27018/customers', (err, db) => {
        let formName = req.body.username;
        let passWord = req.body.password;
    
        if (err) throw err
      
          let dbCollection = db.collection("users");

          let projection = {"Password":1,"Username":1,"_id":0}
     
               dbCollection.findOne({"Username":formName},(err, document ) => {
 
                      if(document.Password === passWord){
              
                      return res.redirect("/default")
            
                    }

                       else{

                       res.redirect(406,'login');
          
                    }
                       db.close();
    
                });
            });
        
        });

/**
 * Sets up the sign up page(new user) and css styles for this page
 */
 app.get("/signup", function (req, res) {
    let form = `
         <link rel="stylesheet" type="text/css" href="static/signup.css">
         <nav class="signUpNav">
            <a href='/index.html' class='home'>queue</a>
         </nav>
         <div class="mainTwo">
         <form action="/signup" method="post" name="signForm" class="signForm" >
          Enter Username:
         <input type="text" name="username"/>
         <br/>
         <br/>
          Enter First Name:
         <input type="text" name="fName"/>
         <br/>
         <br/>
          Enter Last Name:
         <input type="text" name="lName"/>
         <br/>
         <br/>
          Enter E-mail:
         <input type="text" name="email"/>
         <br/>
         <br/>
          Enter Password:
         <input type="password" name="password"/>
         <br/>
         <br/>
         <button type="submit">Submit</button>
         </form>
         </div>
         `;
             res.send(form);
    
});

/**
 * Posts the sign up form data to the server and store the data in mongodb
 */
app.post('/signup', (req, res) => {

    
    let username = req.body.username;
    let fName = req.body.fName;
    let lName = req.body.lName;
    let email = req.body.email;
    let password = req.body.password;
  
    MongoClient.connect('mongodb://localhost:27018/customers', (err, db) => {
        if (err) throw err
        let dbCollection = db.collection("users");
        
    
        dbCollection.insert({ "Username": username, "First Name": fName, "Last Name": lName, "E-mail": email, "Password": password }, (err, result) => {
            dbCollection.find().toArray((err, documents) => {

                console.log(documents);
                
                db.close();
            });
        });
    });
    res.redirect("/tasks")
});



/**
 * Port to listen on
 */
app.listen(3000, ()=>{
console.log("Listening on port 3000")
});