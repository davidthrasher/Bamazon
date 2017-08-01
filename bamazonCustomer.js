//NPM requirements
var inquirer = require("inquirer");
var mysql = require("mysql");
var colors = require("colors");

//Storing credentials into connection variable
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "bamazon"
});

//Establishing MySql connection
connection.connect(function(err) {
  if (err) throw err;
  console.log("Connected as id: ".bold + connection.threadId);
});

//Main Function that prints all items available for sale to the user, then runs the salePrompt() function
function mainFunctionality() {

  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    console.log("Checkout the items we have for sale:\n".bold);
    console.log("\n-----------------------------------------\n");
    for (var i = 0; i < res.length; i++) {
      console.log("Id: ".bold + res[i].item_id + " | Product: ".bold + res[i].product_name + " | Department: ".bold + res[i].department_name + " | Price: ".bold + "$".green.bold +res[i].price + " | QOH: ".bold + res[i].stock_quantity);
    }
    console.log("\n-----------------------------------------\n");
  });
  salePrompt();
}

//Function that prompts user to pick an item to purchase and then asks them the quantity of the item they would like to purchase//
//Validates that there is enough QOH to fulfill customer's order, then totals up the price with 7% sales tax//
function salePrompt() {
  inquirer.prompt([
        {
             name: "id",
             type: "input",
             message: "Which item would you like to purchase? (Enter id number associated with desired item.)\n".bold,
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
             message: "How many would you like to purchase?\n".bold,
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
                        console.log("Success! Your total is ".bold + "$" + purchasePrice + "\nYour item(s) will arrive soon!".bold);
                        console.log("\n-----------------------------------------\n");
                    });
                mainFunctionality();
        }
        else {
                console.log("\n-----------------------------------------\n");
                console.log("Sorry, we do not currently have enough of this item to fulfill that amount.".bold);
                console.log("\n-----------------------------------------\n");

                mainFunctionality();


            }
      })
    });
}

//Start shopping!!//
mainFunctionality();
