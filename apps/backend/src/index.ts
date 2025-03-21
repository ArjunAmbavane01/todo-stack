import express from 'express';
const PORT = 3001;

const app = express();

app.get('/',(req,res)=>{
    res.send('Welcome to API');
})

app.listen(PORT,()=>{
    console.log(`Listening on port ${PORT}`)
})