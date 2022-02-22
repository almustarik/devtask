const client = require("./db.js");
const express = require("express");
const bodyParser = require("body-parser");
const { UNIQUE_VIOLATION } = require("pg-error-constants");
const md5 = require("md5");
const app = express();
app.use(bodyParser.json());

app.listen(3000, () => {
   console.log("Listening on port 3000");
});

client.connect();

app.post("/registration", (req, res) => {
   const registration = req.body;
   const insertQuery = `insert into users(user_name, email, password, gender, age) 
                        values('${registration.user_name }', '${registration.email}', 
                        '${md5(registration.password)}','${registration.gender}','${registration.age}')`;
   client.query(insertQuery, (err, result) => {
      if (!err) {
         res.status(200).send("Successfully Registered");
      } else {
         if (err.code === UNIQUE_VIOLATION) {
            res.status(404).send("Email already exists");
         }
      }
   });
   client.end;
});

app.delete("/product/:id", async (req, res) => {
   try {
      const { id } = req.params;
      const deleteProduct = await client.query(
         "DELETE FROM product WHERE product_id = $1",
         [id]
      );
      res.status(200).json("Product deleted!");
   } catch (err) {
      res.status(404).json("No product found for delete");
   }
});

app.put("/updateproduct/:id", async (req, res) => {
   try {
      const { id } = req.params;
      const { product_name } = req.body;
      const updateProduct = await client.query(
         "UPDATE product SET product_name = $1 WHERE product_id = $2",
         [product_name, id]
      );
      res.status(200).json("Product was updated!");
   } catch (err) {
      res.status(404).send("Check fields");
   }
});

app.post("/category", (req, res) => {
   const category = req.body;
   console.log(category);
   const insertQuery = `insert into category(category_name, category_description) 
                       values('${category.category_name}', '${category.category_description}')`;
   client.query(insertQuery, (err, result) => {
      if (!err) {
         res.status(200).send("Category Added successfully");
      } else {
         // console.log(err.message);
         res.status(404).send("Fill all the fields");
      }
   });
   client.end;
});

app.post("/product", (req, res) => {
   const product = req.body;
   const insertQuery = `insert into product(category_id, product_name, product_image, description, product_price) 
                       values('${product.category_id}', '${product.product_name}', '${product.product_image}', 
                       '${product.description}', ${product.product_price})`;
   client.query(insertQuery, (err, result) => {
      if (!err) {
         res.status(200).send("Product Added");
      } else {
         res.status(404).send("Fill all the fields");
      }
   });
   client.end;
});

app.get("/products", (req, res) => {
   const allProducts = `Select * from product`;
   client.query(allProducts, (err, results) => {
      if (!err) {
         res.status(200).send(results.rows);
      } else {
         res.status(404).send("Product not found");
      }
   });
   client.end;
});

app.post("/login", (req, res) => {
   const email = req.body.email;
   const password = md5(req.body.password);
   const findUser = `Select * from users WHERE email='${email}'`;
   client.query(findUser, (err, result) => {
      if (err) {
         res.status(200).json(err);
      } else {
         // console.log(result.rows);
         if (result.rows.length > 0) {
            if (result.rows[0].password === password) {
               res.status(200).send("successfully login");
            } else {
               res.status(404).send("No user found, you should need to register");
            }
         }
      }
   });
});

app.post("/order", (req, res) => {
   // const order = req.body;
   const userId = req.body.user_id;
   const productId = req.body.product_id;
   const placeOrder = `insert into orders(user_id, product_id) 
                       values(${userId}, ${productId})`;

   client.query(placeOrder, (err, results) => {
      if (!err) {
         res.status(200).send("Order created successfully");
      } else {
         res.status(404).send("Fill all the fields");
         // res.send(err);
      }
   });
   client.end;
});

app.get("/orders", (req, res) => {
   const allOrders = ` select orders.order_id, orders.user_id, orders.product_id, users.user_name, users.user_id, 
                        product.product_id, product.product_name, product.product_price from orders 
                        join users on orders.user_id = users.user_id 
                        join product on orders.product_id = product.product_id`;
   client.query(allOrders, (err, result) => {
      if (!err) {
         res.status(200).send(result.rows);
      } else {
         res.status(404).send("No orders found");
      }
   });
   client.end;
});
