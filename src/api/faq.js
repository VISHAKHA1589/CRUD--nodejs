const express=require('express');
const monk= require('monk');
const joi= require('joi')

const db= monk(process.env.MONGO_URI)
const faqs= db.get('faqs');
const schema= joi.object({
    question: joi.string().trim().required(),
    answer: joi.string().trim().required(),
    video_url: joi.string().uri().allow('').optional()
    ,

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
router.get('/:id', async(req,res,next)=>{
    try{
        const {id}= req.params;
        const item= await faqs.findOne({
            _id: id,
        });
        //if item not find goes to not found handler
        if(!item) return next();
        return res.json(item);
    }
    catch(error){
        next(error);
    }

})

//Create one
router.post('/', async(req,res,next)=>{
   try{
    console.log(req.body);
    const value= await schema.validateAsync(req.body);
    const inserted = await faqs.insert(value);
    res.json(inserted);
   }catch(error){
    next(error);
   }

})

//Update one
router.put('/:id', async(req,res,next)=>{
    try{
        const {id}= req.params;
        const value= await schema.validateAsync(req.body);
        const item= await faqs.findOne({
            _id: id,
        });
        if(!item) return next();
        const updated = await faqs.findOneAndUpdate(
            { _id: id },
            { $set: value }
        );
        res.json(updated);
       }catch(error){
        next(error);
       }

   

})

//Delete One
router.delete('/:id', async(req,res,next)=>{
    try{
    const {id}= req.params;
    const item= await faqs.findOne({_id:id});
    if(!item) return res.status(404).json({
        message:"FAQ not found"
    });

    await faqs.remove({_id :id})
    res.json({ message: "Faq deleted sucessfully", deleteItem: item})
    }
    catch{

        next(error)
    }


})
module.exports= router;