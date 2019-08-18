//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const _ = require('lodash');
const date = require(__dirname + "/date.js");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


mongoose.connect('mongodb+srv://manish:manish123@cluster0-rp3y8.mongodb.net/todoDB' , {useNewUrlParser: true}).
  catch(error => handleError(error));

function handleError(error){
  console.log(error);
}

const itemSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  checked: Boolean
});
const Item = mongoose.model('Item', itemSchema);


const item1 = new Item({
  name: 'Eat Today',
  checked: false
});
//item1.save();

app.get("/", function(req, res) {

  const day = date.getDate();

  
  Item.find(function(err, result){
    if(err){ 
      console.log(err);
      res.send(err);
    }
    else{
      //console.log(result);
      res.render("list", {listTitle: day, items: result});
    }
  });

  // res.send("can't connect to database.");

});

app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const listTitle = req.body.list;
  

  if(listTitle == date.getDate()){
    const item = new Item({
      name: itemName,
      checked: false
    });
    item.save();
    res.redirect("/");
  }
  else{
    const Model = mongoose.model(listTitle, itemSchema);
    const item = new Model({
      name: itemName,
      checked: false
    });
    item.save();
    res.redirect('/' + listTitle);
  }

  
});

app.post('/delete', function(req, res){
  // console.log(req.body.checkbox);
  const chekckedItemId = req.body.checkbox;
  const listTitle = req.body.listTitle;

  if(listTitle == date.getDate()){
    Item.findByIdAndDelete(chekckedItemId, function(err, res){
      if(err){
        console.log(err);
      }
      else{
        console.log(res);
      }
    });
    res.redirect("/");
  }
  else{
    const Model = mongoose.model(listTitle, itemSchema);
    Model.findByIdAndDelete(chekckedItemId, function(err,res){
      if(!err){
        console.log(res);
      }
    });
    res.redirect('/' + listTitle);
  }
  
  
  
  
  // Item.findByIdAndDelete(chekckedItemId, function(err, res){
  //   if(err){
  //     console.log(err);
  //   }
  //   else{
  //     console.log(res);
  //   }
  // });
  // res.redirect('/');
});


app.get('/:listName', function(req, res){
  const listName = req.params.listName;

  const Model = mongoose.model(listName, itemSchema);
  // const item = new Model({
  //   name: 'first',
  //   checked: false
  // });
  
  
  Model.find(function(err, result){
    if(!err){
      // if(result.length === 0){
      //   item.save();
      // }
      res.render('list', {listTitle: _.capitalize(listName), items: result});
    }
  });

});



// app.get("/work", function(req,res){
//   res.render("list", {listTitle: "Work List", items: workItems});
// });

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
