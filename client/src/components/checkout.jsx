import React, {useState} from 'react';
import axios from 'axios';

function Checkout(){
    const initiatePayment =async ()=>{
        const {data} =await axios.post('/create_order', {amount:100});
        
        const options={
            key:process.env.REACT_APP_RAZORPAY_KEY,
            amount: data.amount,
            currency:"INR",
            order_id:data.order_id,
            name:"polaroid prints",
            handler: function(response){
                console.log("payment successful:", response);
            }       
         };
         const rzp = new window.Razorpay(options);
         rzp.open();
    };

    return (
        <div>
            <h2>Order Summary</h2>
            <button on Click={initiatePayment}> Pay with Razorpay </button>
        </div>
    );
}