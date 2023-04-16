// // 1) use npm i express mysql 


// var express = require("express");
// const { json } = require("express/lib/response");
// var mysql = require("mysql");
// var app = express();
// app.use(express.json());

// const con = mysql.createConnection({
//     host:'localhost',
//     user:'root',
//     password:"root123",
//     database:'p'
// })

// con.connect((err)=>{
//     if(err){
//         console.log(err);
//     }else{
//         console.log("Database Connected !!")
//     }
// })

// // // post data - sample
// // app.post('/post',(req,res)=>{
// //     const id = req.body.id;
// //     const pname = req.body.pname;
// //     con.query('insert into pn values (?,?)',[id,pname],(err,result)=>{
// //         if(err){
// //             console.log(err);
// //         }else{
// //          res.send("posted");
// //         }
// //     })
// // })

// // post data into actual db
// // app.post('/post',(req,res)=>{
// //     const CategoryName = req.body.CategoryName;
// //     const name = req.body.name;
// //     const img = req.img.id;
// //     const id = req.body.id;
// //     const id = req.body.id;
// //     const id = req.body.id;
// //     const pname = req.body.pname;
// //     con.query('insert into pn values (?,?)',[id,pname],(err,result)=>{
// //         if(err){
// //             console.log(err);
// //         }else{
// //          res.send("posted");
// //         }
// //     })
// // })


// // get data 
// app.get('/get',(req,res)=>{
//     const id = req.body.id;
//     con.query('select * from fooddata2',function(err,result,fields){
//         if(err){
//             console.log(err);
//         }else{
//          //res.send(result);
//          var r = JSON.parse(JSON.stringify(result)) // JSON must be capital
//         // console.log(r[0]); // I will get only 1 data 
//         console.log(r);
//         }
//     })
// })

// // get data by id 
// app.get('/getbyid/:id',(req,res)=>{
//     const fetchid = req.params.id;
//     con.query('select * from pn where id=?',fetchid,(err,result)=>{
//         if(err){
//             console.log(err);
//         }else{
//         // res.send(result);
//         if(result.length===0){
//             console.log("Id not found");
//         }else{
//          var value = JSON.parse(JSON.stringify(result)) // JSON must be capital
//          console.log(value);
//         }
//         }
//     })
// })

// // update data
// app.put('/update/:id',(req,res)=>{
//     const id = req.params.id;
//     const pname = req.body.pname;
//     con.query('UPDATE pn SET pname=? WHERE id=?',[pname,id],(err,result)=>{
//         if(err){
//             console.log(err);
//         }else{
//             if(result.affectedRows===0){
//                 console.log("id not found");
//                 res.send("id not found");
//             }
//             else{
//          res.send("Updated Successfully");
//          console.log(result);
//             }
//         }
//     })
// })

// //delete data
// app.delete('/delete',(req,res)=>{
//     const delid = req.body.id;
//     con.query('delete from pn WHERE id=?',delid,(err,result)=>{
//         if(err){
//             console.log(err);
//         }else{
//             if(result.affectedRows===0){
//                 console.log("id not found");
//                 res.send("id not found");
//             }
//             else{
//          res.send("Deleted Successfully");
//          console.log("Deleted Successfully");
//             }
            
//         }
//     })
// })



// app.listen(5000,(err)=>{
//     if(err){
//         console.log(err);
//     }else{
//     console.log("Listening On Port 5000");
//     }
// })




// chatgpt
const {customers,Otp,reset,Order} = require('./models/User');
// const Sequelize = require('sequelize');
const express = require('express');
const bodyParser = require('body-parser');

const { body, validationResult } = require('express-validator');
const mysql = require('mysql');

// const sequelize = new Sequelize('p', 'root', 'root123', {
//   host: 'localhost',
//   dialect: 'mysql'
// });

// sequelize.authenticate()
//   .then(() => {
//     console.log('Connected to MySQL server');
//   })
//   .catch((error) => {
//     console.error('Unable to connect to MySQL server:', error);
//   });

//   const customers = sequelize.define('customers', {
//     firstName: {
//       type: Sequelize.STRING,
//       allowNull: true
//     },
//     email: {
//       type: Sequelize.STRING,
//       allowNull: true,
//       unique: true
//     },
//     cpassword: {
//       type: Sequelize.STRING,
//       allowNull: true
//     }
//   });

//   sequelize.sync()
//   .then(() => {
//     console.log('Schema synchronized with database');
//   })
//   .catch((error) => {
//     console.error('Unable to synchronize schema with database:', error);
//   });
const cors = require('cors');

  const app = express();
  app.use(bodyParser.json());
  app.use(cors());
  // // post data into actual db
// Create a route to handle POST requests to create a new user
// app.post('/users', (req, res) => {
//     const { firstName, email, cpassword } = req.body;
//     customers.create({ firstName, email, cpassword })
//       .then((customers) => {
//         res.status(201).json(customers);
//       })
//       .catch((error) => {
//         res.status(400).json({ error: error.message });
//       });
//   });


// // signup actaul
const bcrypt = require('bcryptjs');
app.post('/userpost', [
  // Validate the name field
  body('name').notEmpty().isLength({ max: 255 }),

  // Validate the email field
  body('email').notEmpty().isEmail(),

  // Validate the password field
  body('cpassword').notEmpty().isLength({ min: 6 }),

  // Validate the confirm password field
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.cpassword) {
      throw new Error('Password confirmation does not match password');
    }
    return true;
  }),
], async  (req, res) => {
  var success=false;
  // Check if there are any validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({success, errors: errors.array() });
  }

 // Hash the password
 const salt = await bcrypt.genSalt(10);
 const hashedPassword = await bcrypt.hash(req.body.cpassword, salt);

 

  // Insert the user data into the MySQL database
  const { name, email, cpassword  ,confirmPassword } = req.body;
 
  customers.create({ name, email, cpassword : hashedPassword ,confirmPassword })
  .then((customers) => {
    const token = jwt.sign(customers.id, JWT_SECRET);
    console.log(token);
    success=true;
            res.status(201).json({success,customers,token});
          })
          .catch((error) => {
           console.log("Error hai");
              });
 
});



// login actaul
 const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');
const JWT_SECRET = "Parasisgoodb$oi"

app.post('/login', async (req, res) => {
  var success = false ;
  const { email, cpassword } = req.body;

  // Find the user in the MySQL database
  const user = await customers.findOne({ where: { email: email } });
  if (!user) {
    return res.status(400).json({success, message: 'Invalid credentials' });
  }

  // Compare the password with the hashed password in the database
  const isValidPassword = await bcrypt.compare(cpassword, user.cpassword);
  if (!isValidPassword) {
    return res.status(400).json({success, message: 'Invalid credentials' });
  }

  // Create and send a JWT token as a response
  success=true;
  const token = jwt.sign({ id: user.id }, JWT_SECRET);
  res.json({success, token });
});


//reset
const OTP_SECRET = "MyOTPSecret";
const OTP_LENGTH = 6;
// Generate a random OTP
function generateOTP() {
  let otp = '';
  for (let i = 0; i < OTP_LENGTH; i++) {
    otp += Math.floor(Math.random() * 10);
  }
  return otp; // giving otp as 6 characters
}
// Store the OTP in memory for testing purposes
let otpStore = {};


// Reset password endpoint
// app.post('/reset-password', async (req, res) => {
//   const { email } = req.body;

//   // Find the user in the MySQL database
//   const user = await customers.findOne({ where: { email: email } });
//   if (!user) {
//     return res.status(400).json({ message: 'Invalid email address' });
//   }

//   // Generate and store the OTP for the user
//   const otp = generateOTP();
//   otpStore[user.id] = otp;

//   // Create a JWT token containing the user ID and OTP
//   const token = jwt.sign({ id: user.id, otp: otp }, OTP_SECRET);

//   // Send the OTP to the user via email or SMS (not implemented here)
//   console.log(`OTP for user ${user.id}: ${otp}`);

//   // Return the JWT token to the client
//   res.json({ token });
// });

// Reset password endpoint - 2

// node mailer
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: 'parasraut821@gmail.com',
    pass: 'qzvvmvkboczsznhe'
  }
});


app.post('/reset-password', async (req, res) => {
  const { email } = req.body;
  const otp = req.body.otp;
  // Find the user in the MySQL database
  const user = await customers.findOne({ where: { email: email } });
  if (!user) {
    return res.status(400).json({ success: false, message: 'User not found' });
  }

  // Generate an OTP and sign it with a secret key
  const otpp = generateOTP();
  const otpToken = jwt.sign({ email: email, otpp: otpp }, OTP_SECRET);

  // Send the OTP to the user's email (or phone number, etc.)
  // ...

  // Return a response indicating success
  //res.json({ success: true, message: 'OTP sent successfully' });
     console.log(`OTP for user ${user.id}: ${otpp}`);
  
     //
     Otp.create({ email, otp : otpp})
     .then((Otp) => {
               success=true;
               res.status(201).json({success,Otp});
             })
             .catch((error) => {
              console.log("Error hai : ",error);
              return res.status(400).json({ success: false, message: 'User not found' });
             
                 });
                 const mailOptions = {
                  from: 'parasraut821@gmail.com',
                  to: email,
                  subject: 'Reset Password OTP',
                  text: `Your OTP is ${otpp} .
                  We Appreciate You Using Our Online Food Ordering Service.`
                };
                transporter.sendMail(mailOptions, (error, info) => {
                  if (error) {
                    console.log('Error sending email: ', error);
                  } else {
                    console.log('Email sent: ', info.response);
                  }
                });
});


// trying
//post data into actual db
app.post('/confirmation',async (req,res)=>{
  // Insert the user data into the MySQL database
  const { email,newPassword,otp} = req.body;
 await reset.create({email,newPassword,otp})
  .then((reset) => {
    success=true;
            res.status(201).json({success,reset});
          })
          .catch((error) => {
           console.log("Error hai");
              });
  const user = await customers.findOne({ where: { email } });
 if (!user) {
  return res.status(400).json({ success: false, message: 'User not found' });
  }

    // // Hash the new password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);
  

  // // Update the user's password
  user.cpassword = hashedPassword;
  user.confirmPassword = newPassword ;
  await user.save();
  // // Delete the OTP record
 res.json({ success: true, message: 'Password reset successfully' });
});


/*  ************************* Food Items **************************** */ 
// get food data data 
const con = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:"root123",
    database:'p'
})

con.connect((err)=>{
    if(err){
        console.log(err);
    }else{
        console.log("Database Connected Food Items !!")
    }
})
app.get('/get', async (req,res)=>{
    const id = req.body.id;
  await  con.query('select * from FoodDetails',function(err,result,fields){
        if(err){
            console.log(err);
        }else{
         //res.send(result);
         var r = JSON.parse(JSON.stringify(result)) // JSON must be capital
         global.Food_items = r ;
        //  console.log(global.Food_items);
      //  console.log(r);
        }
    })
    con.query('select * from FoodCategory',function(err,result,fields){
      if(err){
          console.log(err);
      }else{
       //res.send(result);
       var c = JSON.parse(JSON.stringify(result)) // JSON must be capital
       global.FoodCategory = c ;
      //  console.log(global.Food_items);
    //  console.log(r);
      }

     // console.log(global.Food_items,global.FoodCategory);
     res.send([global.Food_items , global.FoodCategory]);
  })
})


/* ****************************** ORDER BY USER **********************/



app.post('/myorders', async (req, res) => {
  try {
    let { userEmail, orderData, orderDate } = req.body;

    orderData = JSON.stringify(orderData);
    // Create a new order document
    const order = await Order.create({
      userEmail,
      orderData,
      orderDate
    });

    res.status(200).json({ message: 'Order saved successfully!', order: order.toJSON() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error saving order details!' });
  }
});


//get data
app.get('/orders', async (req, res) => {
  const userEmail = req.body.userEmail
  const sql = 'SELECT * FROM orders WHERE userEmail = ?';
  await  con.query(sql, [userEmail], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error retrieving orders data');
    } else {
      res.json(results);
    }
  });
});

  // Start the express app
app.listen(5000, () => {
    console.log('Server started on port 5000');
  });