//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose")

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));


mongoose.connect("mongodb://localhost:27017/todolistDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true

})

const itemsSchema = {
  name: String
}

const listSchema = {
  name: String,
  items: [itemsSchema]
}

const List = mongoose.model("List", listSchema);

const Item = mongoose.model("Item", itemsSchema);


app.get("/", function (req, res) {

  Item.find({}, function (err, foundItems) {

    res.render("list", {
      listTitle: "Today",
      newListItems: foundItems

    })
  })
})

app.get("/:customListName", function (req, res) {
  const customListName = (req.params.customListName);

  List.findOne({
    name: customListName
  }, function (err, foundList) {
    if (!err) {
      if (!foundList) {
        console.log("doesn't exist");
        const list = new List({
          name: customListName,
          items: []
        })

        list.save();
        res.redirect("/" + customListName)

      } else {
        console.log("exist");
        res.render("list", {
          listTitle: foundList.name,
          newListItems: foundList.items
        })
      }
    }
  })
});


app.post("/", function (req, res) {

  const itemName = req.body.newItem;
  const listName = req.body.list;

  const item = new Item({
    name: itemName
  })

  if (listName === "Today") {
    item.save()
    res.redirect("/")
    console.log("Successfully added new item");
  } else {
    List.findOne({name: listName}, function (err, foundList) {
          foundList.items.push(item)
          foundList.save()
          res.redirect("/" + listName)
    })
    }
})

app.post("/delete", function (req, res) {
  const checkedItemId = (req.body.checkbox);

  Item.findByIdAndRemove(checkedItemId, function (err) {
    if (!err) {
      console.log("Success delete");

    }
  })
  res.redirect("/")
})


app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});


// const item1 = new Item({
//   name: "Welcome+++"
// })

// const item2 = new Item({
//   name: "Hit the + button, to add a few items"
// })

// const item3 = new Item({
//   name: "Hit this button to delete something"
// })

// const defaultItems = []