
const express = require('express');
const admin = require('firebase-admin');
const bcrypt = require('bcrypt');
const path =  require('path');
// const { static } = require('express');


// firebase admin setup 




let  serviceAccount = require("./ezzrent-d1771-firebase-adminsdk-79rpm-170309d6a2.json");
const { database } = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
let db= admin.firestore();

let staticPath =path.join(__dirname,);

const app =express();


app.use(express.static(staticPath));
app.use(express.json());


app.get ('/', (req, res) => {
    res.sendFile(path.join(staticPath,"index.html"));

})
app.get('/signup', (req,res)=>{
    res.sendFile(path.join(staticPath,'signup.html'));
})

app.post('/signup',(req, res) =>{
    // console.log(req.body);
    
    let{name ,email ,password , number, tac, notification} = req.body;

    //form validation
    if(name.length < 3){
        return res.json({'alert': 'name must be 3 letters long'})
    } else if(!email.length ){
        return res.json({'alert':'Email is required'});
    } else if(password.length < 8){
        return res.json({'alert':'Password must be at least 8 characters long'});
    }  else if(!number.length){
        return res.json({'alert':'Number is required'});

    } else if(!Number(number) || number.length < 10){
        return res.json({'alert':'Number must be at least 10 digits long'});
    } else if(!tac){
        return res.json({'alert':'You must agree to our terms and conditions'});
    } else{
        res.json('data recieved');
    }
    db.collection('users').doc(email).get()
    .then(user => {
        if(user.exists){
            return res.json({'alert':'User already exists'});
        } else{
// now we will encrypt before storing it.
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(password, salt, (err, hash) => {
                    req.body.password = hash;
                    db.collection('users').doc(email).set(req.body)
                    .then(data => {
                        res.json({
                            name: req.body.name,
                            email: req.body.email,
                            // seller: req.body.seller,
                        })
                    })
                })
            })

        }
    })
// })

})

app.listen(4000,()=>{
    console.log('listening on port 40000')
})