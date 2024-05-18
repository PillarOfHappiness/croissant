import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';

var app = express();
const port = 3000;

//Middleware
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

//render ejs code when page launch
app.get("/", (req,res) => {
  res.render("home.ejs")
})

//upon user submission
app.post("/submit", async (req,res) => {
  const name = req.body.fullname.toLowerCase();
  const year = req.body.year;

  try{  //fetch api 
    const response = await axios.get("https://stephen-king-api.onrender.com/api/villains");
    const result = response.data['data'];
    let match = 0;
    let vilTag = 0;
    let vilNum = 0;
    let vilName = "";

    //itterate through api to compare names and years
    for (let y = 0; y < result.length; y++){
      match = 0;
      if(result[y].name[0].toLowerCase() == name[0] && year % 2 == result[y].id % 2){   //filter through to first matching letter and matching even/odd year 
        for (let x = 0; x < result[y].name.length; x++){
          if(result[y].name[x].toLowerCase() == name[x]){              
            match += 1;       //count which ever villain name has the most matching number of letters to user's
          }
        }
      }
      if(match > vilNum){
        vilNum = match;
        vilTag = y;
        vilName = result[y].name    //keep track of name for future ejs conditional and number placement for further villain details
      }
    }

    //disploy villian ejs and pass data through
    res.render("villain.ejs", {villain: vilName, gender: result[vilTag].gender, status: result[vilTag].status, books: result[vilTag].books}); //result[vilTag].books.forEach((b) => b.title)
    }

    //catch error if arises
    catch (error){
      console.error("Failed to make request:", error.message);
      res.render("home.ejs", {
        error: error.message,
      });
    }
})

//sucessful deployment of page
app.listen(port, () => {
  console.log('Example app listening on port 3000!');
});