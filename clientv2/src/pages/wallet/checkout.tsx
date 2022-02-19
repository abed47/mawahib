import React, { useState, useEffect } from 'react';
import {loadStripe} from '@stripe/stripe-js';
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Button, TextField } from '@mui/material';
import { useCtx } from '../../utils/context';
import { getServerPhoto, PurchasesRequests } from '../../utils/services/request';
import { useNavigate, useParams } from 'react-router-dom';
import CheerIcon from '../../assets/icons/cheer.png';

const stripePromise = loadStripe('pk_test_51Hrg9GLptxnxkf6KAC9lhuEdUOnP7GTX4nY7lvwGNqvNAfOchJ6WsaD4D9pEaatBp9VNd96XRrD4ewXhkizfWHPv00Ax7qnAIp');

const CheckoutForm: React.FC = props => {

    const [name, setName] = useState('');
    const [country, setCountry] = useState('');
    const [city, setCity] = useState('');
    const [address, setAddress] = useState('');
    const [product, setProduct] = useState<any>(null);
    const [amount, setAmount] = useState(0);
    const [price, setPrice] = useState(0);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState(false);
    const [errMessage, setErrMessage] = useState(false);
    const [formErrors, setFormErrors] = useState([false, false, false, false]);
    
    const stripe:any = useStripe();
    const elements = useElements();
    const params = useParams<{id: string}>();
    const ctx = useCtx();
    const navigate = useNavigate();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try{
            ctx.showPreloader();
            let pId:any = params.id;
            let { data } = await PurchasesRequests.getProduct(pId);
            ctx.hidePreloader()
            setProduct(data);
            setPrice(data.price);
            setAmount(data.amount);
        }catch(err){
            ctx.hidePreloader();
            console.log(err);
        }
    }

    const isValid = () => {
        let e = [false, false, false, false];
        setFormErrors(e);
        if(!name) e[0] = true;
        if(!country) e[1] = true;
        if(!address) e[2] = true;
        if(!city) e[3] = true;
        if(e[0] || e[1] || e[2] || e[3]) {
            setFormErrors(e);
            return false
        }
        return true;
    }
  
    const handleSubmit = async (event:any) => {
      event.preventDefault();

      if(!isValid()) return;

      let billingDetail = {
          name,
          address: {
              line1: address,
              city,
              country
          },
      }

      if (elements == null) {
        return;
      }
  
      try{
          const {error, paymentMethod} = await stripe.createPaymentMethod({
            type: 'card',
            card: elements.getElement(CardElement),
            billing_details: billingDetail
          });

          let pmId = paymentMethod.id;

          let { data: pIntent } = await PurchasesRequests.getPaymentIntent({amount: price * 100});
          
          let cSecret = pIntent.client_secret;

          const confirmPayment = await stripe.confirmCardPayment(cSecret, {
              payment_method: pmId
          });

          let payment = confirmPayment.paymentIntent;

          let body = {
              ref: payment.id,
              product_id: product.id,
              price,
              amount: product.amount,
              status: 3,
              user_id: ctx.currentUser?.id
          }

          let res = await PurchasesRequests.recordTransaction(body);
          if(res?.status !== true){
            res = await PurchasesRequests.recordTransaction(body);
          }

          ctx.hidePreloader()
          setProcessing(false);

          if(res?.status){
            ctx.showSnackbar('Payment successful', 'success');
            navigate('/wallet')
            return
          }

          if(!res?.status === false){
              ctx.showSnackbar(res.message, 'error');
              return
          }

      }catch(err: any){
          ctx.hidePreloader();
          setProcessing(false);
          ctx.showSnackbar(err?.message || 'error occurred try again', 'error');
          //TODO: handle errors.
          console.log(err);
      }

      
    };
  
    return (
        <div className="checkout-form-container">
            <form onSubmit={handleSubmit}>
                <div className="product-preview">
                    <img src={product?.photo ? getServerPhoto(product?.photo || '') : CheerIcon} alt="logo"/>
                    <p>{product?.name}</p>
                </div>
                {/* <div className="els"> */}
                    <input value={name} onChange={e => setName(e.target.value)} type="text" placeholder="Name" className={formErrors[0] ? 'error-active' : ''} />
                    <input value={country} onChange={e => setCountry(e.target.value)} type="text" placeholder="Country" className={formErrors[1] ? 'error-active' : ''} />
                    <input value={address} onChange={e => setAddress(e.target.value)} type="text" placeholder="Address" className={formErrors[2] ? 'error-active' : ''} />
                    <input value={city} onChange={e => setCity(e.target.value)} type="text" placeholder="City" className={formErrors[3] ? 'error-active' : ''} />
                {/* </div> */}
                <CardElement className='card-el' />
                <Button className="btn" type="submit" disabled={!stripe || !elements || processing}>
                Pay ${price}
                </Button>
            </form>
        </div>
    );
}

const CheckoutPage = () => {
    return (
        <div className="checkout-page">
            <Elements stripe={stripePromise}>
                <CheckoutForm />
            </Elements>
        </div>
    );
}

export default CheckoutPage;