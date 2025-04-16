const express=require('express');
const monk= require('monk');
const joi= require('joi')

const db= monk(process.env.MONGO_URI)
const faqs= db.get('faqs');
const schema= joi.object({
    question: joi.string().trim().required(),
    answer: joi.string().trim().required(),
    video_url: joi.string().uri(),

});

const router= express.Router();
//READ ALL
router.get('/',async (req,res,next)=>{
        try{
            const items= await faqs.find({});
            res.json(items);
        }catch(error){
            next(error);

        }

})


//read one
router.get('/:id', (req,res,next)=>{
    res.json({
        message:"hello read one"
    })

})

//Create one
router.post('/', async(req,res,next)=>{
   try{
    console.log(req.body);
    const value= await schema.validateAsync(req.body);
    const inserted = await faqs.insert(value);
    res.json(value);
   }catch(error){
    next(error);
   }

})

//Update one
router.post('/:id', (req,res,next)=>{
    res.json({
        message:"hello update one"
    })

})

//Delete One
router.delete('/:id', (req,res,next)=>{
    res.json({
        message:"hello delete one"
    })

})
module.exports= router;