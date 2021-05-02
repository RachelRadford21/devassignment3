let express = require('express');

let bodyParser = require('body-parser');

let MongoClient = require('mongodb').MongoClient;

//Path allows me to join files
let path = require('path');

let app = express();

app.use(express.urlencoded({extended:true}));

 app.use(express.static(__dirname));

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
 * Creates login in form and links to css page.
 * The other links allow me to add the fire icon to queue
 */
app.get('/login', (req, res) => {
    let form = `
    <link rel="stylesheet" type="text/css" href="static/login.css">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
   
    <nav class="loginNav">
   
    <a class="navbar-brand" href="/index.html">que<i class="fas fa-fire">e</i></a>
   
    <div class='rightSide'>
      
    <a href="signup" class="signup">sign up</a>&nbsp;&nbsp;
   
    </div>
    </nav>
    
    <div class="main">
   
    <form action="/login" method="post" name="logForm" class="logForm">
   
    Enter Username:
    <input type="text" name="username"/>
    <br/>
    <br/>
    
    Enter Password:
    <input type="password" name="password"/>
    <br/>
    <br/>
    <button type="submit">Submit</button>
  
    </form>
    </div>
    <script src="https://kit.fontawesome.com/19621eb927.js" crossorigin='anonymous'></script>
      `;
      
        res.send(form)
  
});
/**
 * Post the login form to the server and validates users credentials.
 * If user is not authenticated, the user is shown a 406 error and an option to
 * return to the login pg to try again.
 */
 app.post('/login', (req, res) => {
    
    MongoClient.connect('mongodb://localhost:27018/customers', (err, db) => {
       
        let formName = req.body.username;
        let passWord = req.body.password;
    
        if (err) throw err
      
          let dbCollection = db.collection("users");

               dbCollection.findOne({"Username":formName}, (err, document ) => {
 
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
 * Creates the sign up pg/form(new user) and css styles for this page
 */
 app.get("/signup", function (req, res) {
    let form = `
         <link rel="stylesheet" type="text/css" href="static/signup.css">
         <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
         <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
        
         <nav class="signUpNav">
         <a class="navbar-brand" href="/index.html">que<i class="fas fa-fire">e</i></a>
         <div class='rightSide'>

         <a href="login" class="login">log in</a>&nbsp;&nbsp;
         </div>
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
         
         Enter E-mail:<br/>
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
         <script src="https://kit.fontawesome.com/19621eb927.js" crossorigin='anonymous'></script>
         `;
             res.send(form);
    
});

/**
 * Posts the sign up form data to the server and stores the data in mongodb. 
 * Then redirects user to pg where the tasks are listed.
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
 *  Creates tasks page and styling for this page.
 */

 app.get("/tasks", (req, res)=>{
    let task = `
       <link rel="stylesheet" href="static/task.css">
       <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
       <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    
       <nav class="taskNav">
    
       <a class="navbar-brand" href="/index.html">que<i class="fas fa-fire">e</i></a>

        <div class='rightSide'>

       <a href="default" class="default">task list</a>
       </div> 
       </nav>
    
       <div class="mainThree">
    
       <form action="/tasks" method="post" name="taskAction" class="taskAction" >
    
       Task Input :
       <input type = 'text' name='task' value="Enter A Task"/>
       <button type="submit">Submit</button>
       </form>
       </div> 
       <script src="https://kit.fontawesome.com/19621eb927.js" crossorigin='anonymous'></script>
       ` ;
   
          res.send(task);
    });

/**
 * Posts tasks entered into the input and saves them to mongodb.
 * Then redirects user to the page where tasks are listed.
 */
    app.post('/tasks', (req, res) => {

        let todo = req.body.task;
    
           MongoClient.connect('mongodb://localhost:27018/customers', (err, db) => {

               if (err) throw err
        
               let dbCollection = db.collection("users");
        
                dbCollection.insert({ "task": todo }, (err, result) => {
      
                db.close();
            });
        });
 
     res.redirect("/default");
});

/**
 * Sets up the task list page(default), which, lists the tasks, and the css styling for this page.
 * The tasks entered on the task page are pulled from mongodb and displayed on the "default" page.
 */

 app.get('/default', (req, res) => {
    let navi = `
       <link rel="stylesheet" href="static/default.css"></link>
       <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
       <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">        
      
        <nav class="defNav">

        <a class="navbar-brand" href="/index.html">que<i class="fas fa-fire">e</i></a>

        <div class='rightSide'>

        <a href="signup" class="signup">sign up</a>&nbsp;&nbsp;

        <a href="tasks" class="tasks">tasks</a>&nbsp;&nbsp;

        </div>
        </nav>
        <script src="https://kit.fontawesome.com/19621eb927.js" crossorigin='anonymous'></script>
`;

MongoClient.connect('mongodb://localhost:27018/customers', (err, db) => {
  
    if (err) throw err
   
      let dbCollection = db.collection('users');
   
           dbCollection.find().toArray((err, documents) => {
            
            let display = "";
            
               for(let i = 0; i < documents.length; i++){

             /** Filters out the undefined task values that show up after the first task
              *  a new user creates
              */
                    if(documents[i].task !== undefined){

                        display += documents[i].task + "<br/>";
                  
                   }
               }
           
              /** Displays the navi var which contains the nav bar and general pg setup and
               *  the task items pulled from mongo
               */ 
              res.send(`${navi}` + `<h1 class='list'>${display}</h1>`)
          
              db.close();
        
            });
         });
    
     });
   

/**
 * Port to listen on
 */
app.listen(3000, ()=>{
console.log("Listening on port 3000")
});