var express = require('express');
var router = express.Router();


const Product = require ('../models/Product')
const multer =  require('multer');
const fileFilter = function (req, file, cb) {
  if(file.mimetype === 'image/jpeg') {
  cb(null,true)
}else{
  cb(new Error('please uplaod jpege file'),false)
}
 
}
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './productImage/')
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toDateString() + file.originalname)
  }
});
const upload = multer({
    // dest :'productImage/'
    storage : storage,
    limits : {
        fileSize : 1024 * 1024 * 5
    },
    fileFilter:fileFilter
})

//get all product 
router.get('/',(req,res,next)=>{
 Product.find().
 select('_id name price').
  then(doc=>{
    // console.log(doc)
    var response = {
        doc : doc.map(doc =>{
            return{
                name : doc.name ,
                price : doc.price,
                _id : doc._id,
                 url:{
                    type : 'GET',
                    urls : "localhost:3000/products/" + doc._id
            }
           
            }
        })
    }
    res.status(200).json({
     products : response
    })
  }).
  catch(err=>{
    res.status(404).json({
      message : err.message
    })
  })
})


//get product by id
router.get('/:id',(req,res,next)=>{
   // Product.findById(req.params.id)
    Product.find({_id : req.params.id}).
    select('_id name price').
    then(doc=>{
       
        res.status(200).json({
         product : doc
        })
    }).
     catch(err=>{
        res.status(404).json({
          message : err.message
        })
      })
})


//add product
router.post('/addproduct', upload.single('myfile') ,(req,res,next)=>{
  console.log(req.file ) 
  const product = new Product ({
        name : req.body.name ,
        price : req.body.price,
        image :req.file.path
    })

    product.save().
    then(result=>{
      console.log(product)
      res.status(200).json({
        message:"product already added " ,
        product : result
      })
    }).
    catch(err=>{
      res.status(404).json({
        message : err.message
      })
    })
})


// update product
router.patch('/:id',(req,res,next)=>{
    const newProduct ={
        name : req.body.name ,
        price : req.body.price
    }

    Product.findOneAndUpdate({_id : req.params.id} ,{ $set : newProduct}).
    then(resualt=>{
        if(resualt){
            console.log(resualt)
            res.status(200).json({
              message:'product  already updated',
              Newproduct : newProduct
            })
          }else{
            console.log(resualt)
            res.status(404).json({
              message:'product Not found'
            })
          }
    }).
    catch(err=>{
        res.status(404).json({
          message : err.message
      })
      
      })
})


//delete product

router.delete('/:id',(req,res,next)=>{


    //Product.deleteOne({_id : req.params.id})
    Product.findOneAndDelete({_id : req.params.id}).
    then(resualt=>{
      if(resualt){
        console.log(resualt)
        res.status(200).json({
          message:'product already deleted'
        })
      }else{
        console.log(resualt)
          res.status(404).json({
            message:'product Not found'
          })
      }
   
    }).
    catch(err=>{
      res.status(404).json({
        message : err.message
    })
    
    })
  
  
  })




module.exports = router;