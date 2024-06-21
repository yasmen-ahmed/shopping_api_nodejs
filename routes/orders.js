var express = require('express');
var router = express.Router();

const Order = require ('../models/Order')



router.post('/addOrder', (req,res,next)=>{
    const newOrder = new Order ({
        user : req.body.user,
        product : req.body.product
    })
    newOrder.save().
    then(result=>{
        res.status(200).json({
            message : 'order added',
            order : result
        })
    }).
    catch(err=>{
        res.status(404).json({
            message : err.message
        })
    })
})

//get all order
router.get('/', (req,res,next)=>{
    Order.find({}).populate('user','username').
    then(result=>{
        res.status(200).json({
            message : 'orders found',
            orders : result
        })
    }).
    catch(err=>{
        res.status(404).json({
            message : err.message
        })
    })
})



// update order quantity
router.patch('/:id', (req,res,next)=>{
    const newOrder ={
        user : req.body.user,
        product : req.body.product
    }
//    const newProduct = req.body.product
    Order.findById(req.params.id).
    then(
        resualt=>{
            if(resualt){
                 console.log(resualt[0].product)
                 console.log(newOrder.product)
              
            var oldproduct =newOrder.product
               for(var indexNewProduct =0 ; indexNewProduct < newOrder.product.length ; indexNewProduct ++){
                  
                for(var indexOldProduct =0 ; indexOldProduct < oldproduct.length ; indexOldProduct ++){
                  if(newOrder.product[indexNewProduct]._id === oldproduct[indexOldProduct]._id ){
                     oldproduct[indexOldProduct].quantity =  oldproduct[indexOldProduct].quantity + newOrder.product[indexNewProduct].quantity
                     newOrder.product.splice(indexNewProduct , 1)
                    }
                }  

               }



            //    console.log(newOrder.product)
            //    console.log(oldproduct)

                res.status(200).json({
                    message:'order  already updated',
                    Neworder : newOrder
                })
            }
        }
    ).
    catch(err=>{
        res.status(404).json({
            message : err.message
        })
    })



})

// router.patch('/:id', (req,res,next)=>{
//     const newOrder ={
//         user : req.body.user,
//         product : req.body.product
//     }

//     Order.findById(req.params.id)
//     .then(order => {
//         if(!order) {
//             return res.status(404).json({
//                 message: 'Order not found'
//             });
//         }

//         // Merge the new products with the existing products
//         newOrder.product.forEach(newProduct => {
//             const existingProduct = order.product.find(p => p._id.toString() === newProduct._id.toString());
//             if(existingProduct) {
//                 existingProduct.quantity += newProduct.quantity;
//             } else {
//                 order.product.push(newProduct);
//             }
//         });

//         // Save the updated order
//         return order.save();
//     })
//     .then(updatedOrder => {
//         res.status(200).json({
//             message: 'Order updated',
//             order: updatedOrder
//         });
//     })
//     .catch(err => {
//         res.status(500).json({
//             message: err.message
//         });
//     });
// });


// delete order
router.delete('/:id', function(req, res) {
    Order.deleteOne({_id: req.params.id}).
    then(result=>{
        res.status(200).json({
                        message: 'Order deleted successfully'
                    });
    }).
    catch(err => {
                res.status(500).json({
                    message: err.message
                });
            });

})


module.exports = router;