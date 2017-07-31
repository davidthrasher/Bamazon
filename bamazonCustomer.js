var inquirer = require("inquirer");
var mysql = require("mysql");
var colors = require("colors");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("Connected as id: ".bold + connection.threadId);
});

function mainFunctionality() {

  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    console.log("Checkout the items we have for sale:\n".white.bold);
    console.log("\n-----------------------------------------\n");
    for (var i = 0; i < res.length; i++) {
      console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + "$".green +res[i].price + " | " + res[i].stock_quantity);
    }
    console.log("\n-----------------------------------------\n");
  });
  salePrompt();
}

function salePrompt() {
  inquirer.prompt([
        {
             name: "id",
             type: "input",
             message: "Which item would you like to purchase? (Enter id number associated with desired item.)\n".white.bold,
             validate: function(value) {
                 if (isNaN(value) === false) {
                     return true;
                 } else {
                     return false;
                 }
             }
         },
         {
             name: "quantity",
             type: "input",
             message: "How many would you like to purchase?\n".white.bold,
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
      var query = "SELECT department_name, stock_quantity, price FROM products WHERE ?"
      connection.query(query, {item_id: answer.id}, function(err, res) {
        if (res[0].stock_quantity >= answer.quantity) {
          var dept = res[0].department_name;
          var adjustedQuantity = res[0].stock_quantity - answer.quantity;
          var purchasePrice = ((answer.quantity * res[0].price) * 1.07).toFixed(2);

          var query2 = " UPDATE products SET ? WHERE ?";
                connection.query(query2, [{ stock_quantity: adjustedQuantity }, { item_id: answer.id }], function(err, res) {

                        if (err) throw err;
                        console.log("\n-----------------------------------------\n");
                        console.log("Success! Your total is ".white.bold + "$" + purchasePrice + "\nYour item(s) will arrive soon!".white.bold);
                        console.log("\n-----------------------------------------\n");
                    });
                mainFunctionality();
        }
        else {
                console.log("\n-----------------------------------------\n");
                console.log("Sorry, we do not currently have enough of this item to fulfill that amount.".white.bold);
                console.log("\n-----------------------------------------\n");

                mainFunctionality();


            }
      })
    });
}

mainFunctionality();
