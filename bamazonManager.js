var inquirer = require("inquirer");
var mysql = require("mysql");


var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("Connected as id: " + connection.threadId);
  managerPrompt();
});

function managerPrompt() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "Hello Bamazon manager, what would you like to do today?",
      choices: [
        "View Products for sale?",
        "View Low Inventory?",
        "Add to Inventory?",
        "Add a New Product?"
      ]
    })
    .then(function(answer) {
      switch (answer.action) {
        case "View Products for sale?":
        viewAllProducts();
        break;

        case "View Low Inventory?":
        viewLowInventory();
        break;

        case "Add to Inventory?":
        addInventory();
        break;

        case "Add a New Product?":
        addNewProduct();
        break;
      }

    });

}

function viewAllProducts() {

  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    console.log("All items currently available in marketplace:\n");
    console.log("\n-----------------------------------------\n");
    for (var i = 0; i < res.length; i++) {
      console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + "$" +res[i].price + " | " + res[i].stock_quantity);
    }
    console.log("\n-----------------------------------------\n");
  });

}

function viewLowInventory() {

  var query = "SELECT * FROM products";
  connection.query(query, function(err, res) {
    if (err) throw err;
    console.log("All items that need to be restocked:\n");
    console.log("\n-----------------------------------------\n");
    for (var i = 0; i < res.length; i++) {
      if (res[i].stock_quantity <= 5) {
        console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + "$" +res[i].price + " | " + res[i].stock_quantity);
      }
    }
    console.log("\n-----------------------------------------\n");
  });


}

function addInventory() {
  viewAllProducts();
  inquirer.prompt([
         {
             name: "id",
             type: "input",
             message: "Which item would you like to add inventory to?(Select ID number associated with desired item.)",
             validate: function(value) {
                 if (isNaN(value)) {
                     return false;
                 } else {
                     return true;
                 }
              }
           },
           {
               name: "newstock",
               type: "input",
               message: "How many of this item are we adding to inventory?",
               validate: function(value) {
                   if (isNaN(value)) {
                       return false;
                   } else {
                       return true;
                   }
                }
             }
    ])
    .then(function(answer) {
      var query = "SELECT product_name, item_id, stock_quantity FROM products WHERE ?";
      connection.query(query, {item_id: answer.id}, function(err,res) {
        if (err) throw err;
        var product = res[0].product_name;
        var id = res[0].item_id;
        var adjustedQuantity = parseInt(res[0].stock_quantity) + parseInt(answer.newstock);

        var query2 = "UPDATE products SET ? WHERE ?";
        connection.query(query2, [{ stock_quantity: adjustedQuantity }, { item_id: id }], function(err, res) {
          if (err) throw err;
          console.log("You now have " + adjustedQuantity + " " + product + "'s in stock!\n")
        });
      });



    });


}

function addNewProduct() {
  inquirer.prompt([
        {
             name: "product_name",
             type: "input",
             message: "What item would you like to add to the marketplace?\n",
         },
         {
              name: "department_name",
              type: "input",
              message: "Which department should this item be listed in?\n",
          },
         {
             name: "price",
             type: "input",
             message: "How much does this item cost?",
             validate: function(value) {
                 if (isNaN(value)) {
                     return false;
                 } else {
                     return true;
                 }
              }
           },
           {
               name: "stock_quantity",
               type: "input",
               message: "How many of this item are we adding to inventory?",
               validate: function(value) {
                   if (isNaN(value)) {
                       return false;
                   } else {
                       return true;
                   }
                }
             }
    ])
    .then(function(answer) {
      console.log("Your item was added succesfully!\n");
      var query = connection.query (
        "INSERT INTO products SET ?",
        {
          product_name: answer.product_name,
          department_name: answer.department_name,
          price: answer.price,
          stock_quantity: answer.stock_quantity
        }
      );
    });


}
