const client = require("./db.js");
const express = require("express");
const bodyParser = require("body-parser");
const { UNIQUE_VIOLATION } = require("pg-error-constants");
const md5 = require('md5');
const app = express();
app.use(bodyParser.json());

app.listen(3000, () => {
   console.log("Listening on port 3000");
});

client.connect();

app.post("/registration", (req, res) => {
   const registration = req.body;
   const insertQuery = `insert into users(user_name, email, password, gender, age) 
                       values('${registration.user_name}', '${registration.email}', 
                       '${md5(registration.password)}','${registration.gender}','${registration.age}')`;
   client.query(insertQuery, (err, result) => {
      if (!err) {
         res.send("Successfully Registered");
      } else {
         if (err.code === UNIQUE_VIOLATION) {
            res.send("Email already exists");
         }
      }
   });
   client.end;
});

/*app.delete("/registration/:id", async (req, res) => {
   try {
      const { id } = req.params;
      const deleteUser = await client.query(
         "DELETE FROM registration WHERE user_id = $1",
         [id]
      );
      res.json("User was deleted!");
   } catch (err) {
      console.log(err.message);
   }
});

app.put("/updateinfo/:id", async (req, res) => {
   try {
      const { id } = req.params;
      const { u_name } = req.body;
      const updateUser = await client.query(
         "UPDATE registration SET u_name = $1 WHERE user_id = $2",
         [u_name, id]
      );

      res.json("Username was updated!");
   } catch (err) {
      console.error(err.message);
   }
});*/

app.post("/category", (req, res) => {
   const category = req.body;
   console.log(category);
   const insertQuery = `insert into category(category_name, category_description) 
                       values('${category.category_name}', '${category.category_description}')`;
   client.query(insertQuery, (err, result) => {
      if (!err) {
         res.send("Category Added successfully");
      } else {
         console.log(err.message);
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
         res.send("Product Added");
      } else {
         console.log(err.message);
      }
   });
   client.end;
});

app.get("/products", (req, res) => {
   const allProducts = `Select * from product`;
   client.query(allProducts, (err, results) => {
      if (!err) {
         res.send(results.rows);
      } else {
         console.log(err.message);
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
         console.log(err);
      } else {
         console.log(result.rows);
         if (result.rows.length > 0) {
            if (result.rows[0].password === password) {
               res.send("successfully login");
            } else {
               res.send("No user found");
            }
         }
      }
   });
});
