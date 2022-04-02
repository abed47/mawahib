import React, {useState, useEffect, useImperativeHandle, forwardRef} from 'react';
import {CircularProgress, FormControl, FormControlLabel, Radio, RadioGroup, FormLabel, Checkbox} from '@material-ui/core';
import dataProvider from '../../utils/providers/local-http-provider';
import moment from 'moment';

const OrderView = ({data, invoice, id, ref}) => {
    
    const [loading, setLoading]             = useState(false);
    const [orderData, setOrderData]         = useState();
    const [orderItems, setOrderItems]       = useState([]);
    const [orderClient, setOrderClient]     = useState();
    const [shippingType, setShippingType]   = useState(1);
    const [isInvoice, setIsInvoice]         = useState(false);

    useEffect(() => {
        setLoading(true)
        if(id != 0){
            dataProvider.getOne('orders',id).then(res => {
                setLoading(false)
                setOrderData(res.data.data.order[0]);
                setOrderItems(res.data.data.items);
                setOrderClient(res.data.data.client);
            }).catch(err => {
                console.log(err)
            })
        }
    }, [id]);

    const getOrderStatusText = s => {

        if (s == 1) return "Pending"
        if (s == 2) return "Quoted"
        if (s == 3) return "Priced"
        if (s == 4) return "OTW"
        if (s == 5) return "Delivered"
        if (s == 6) return "Canceled"
    }

    const calcOrderTotal = () => {
        let shipping = calcAirShippingTotal();
        if(shippingType == 1) shipping = calcSeaShippingTotal();
        return shipping + calcSellingTotal();
    }

    const calcAirShippingTotal = () => {
        let total = orderItems.reduce((prev, curr, i) => {
            return (+prev || 0) + ((+curr.air_shipping_price * + curr.quantity) || 0);
        },0);

        return total
    }

    const calcSeaShippingTotal = () => {
        let total = orderItems.reduce((prev, curr, i) => {
            return ((+prev || 0) + ((+curr.sea_shipping_price * +curr.quantity)|| 0));
        },0);

        return total
    }

    const calcSellingTotal = () => {
        let total = orderItems.reduce((prev, curr, i) => {
            return ((+prev || 0) + ((+curr.selling_price * +curr.quantity) || 0));
        },0);

        return total
    }

    const calcShippingTotal = () => {
        if(shippingType == 1) return calcSeaShippingTotal();
        return calcAirShippingTotal();
    }

    const calcTotalProfit = () => {
        let cost = orderItems.reduce((prev, curr, i) => {
            return (+prev || 0) + ((+curr.selling_price - (+curr.price)) * +curr.quantity);
        },0);

        if(shippingType == 1) return cost - calcSeaShippingTotal();
        return cost - calcAirShippingTotal();
    }

    return (
        <div className="order-view-dialog-container printable">
            {
                loading ?
                <div className="loading-container">
                    <CircularProgress />
                </div> : ""
            }

            <h1 className="title text-blue">Order Information</h1>
            
            <div className="general-details">
                <ul>
                    <li>Order #: {orderData?.id}</li>
                    <li>Order Date: {moment(orderData?.created_at).format('YYYY/MM/DD')}</li>
                    <li>Order State: {getOrderStatusText(orderData?.status)}</li>
                    <li>Order Total: <span className="text-success">${calcOrderTotal()}</span></li>
                </ul>
            </div>

            <div className="billing-details">
                <div className="">
                    <h1>Shipping details</h1>
                    <ul>
                        <li>
                            name: {orderClient?.name}
                        </li>
                        <li>
                            address: {orderClient?.address}
                        </li>
                        <li>
                            email: {orderClient?.email}
                        </li>
                        <li>
                            phone: {orderClient?.phone}
                        </li>
                    </ul>
                </div>
                <div>
                    <h1 className="opacity-0">price details</h1>
                    <ul>
                        <li className={`${isInvoice && shippingType == 1 ? 'hidden' : ''}`}>
                            Air Shipping Price: ${calcAirShippingTotal()}
                        </li>
                        <li className={`${isInvoice && shippingType == 2 ? 'hidden' : ''}`}>
                            Sea Shipping Price: ${calcSeaShippingTotal()}
                        </li>
                        <li>
                            Selling Total: ${calcSellingTotal()}
                        </li>
                        <li className={`${isInvoice ? 'hidden' : ''}`}>
                            Total Profit: ${calcTotalProfit()}
                        </li>
                    </ul>
                </div>
            </div>

            <div className="products-container">
                <h1>Products</h1>
                <table>
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            orderItems.map(item => {
                                return <tr key={item.id}>
                                    <td>{item.description}</td>
                                    <td>${item.selling_price}</td>
                                    <td>{item.quantity}</td>
                                    <td>${item.selling_price * item.quantity}</td>
                                </tr>
                            })
                        }
                    </tbody>
                </table>
            </div>

            <div className="totals-container">
                <ul>
                    <li><span>Subtotal: </span> <span>${calcSellingTotal()}</span></li>
                    <li><span>Shipping Total:</span><span>${calcShippingTotal()}</span></li>
                    <li><span>Total:</span> <span>${calcOrderTotal()}</span></li>
                </ul>
            </div>

            <div className="controls hide-on-print">
                <FormControl component="fieldset">
                    <FormLabel component="legend">Shipping Type</FormLabel>
                    <RadioGroup  value={shippingType} onChange={e => setShippingType(e.target.value)}>
                        <div className="radio-group">
                        <FormControlLabel  value={"1"} control={<Radio />} label="Sea" />
                        <FormControlLabel value={"2"} control={<Radio />} label="Air" />
                        </div>
                    </RadioGroup>
                </FormControl>

                <FormControlLabel
                    control={
                    <Checkbox
                        checked={isInvoice}
                        onChange={e => setIsInvoice(e.target.checked)}
                        name="checkedB"
                        color="primary"
                    />
                    }
                    label="Invoice?"
                />
            </div>
        </div>
    );
}

const withPrintRef = forwardRef((props, ref) => {

    useImperativeHandle(ref, () => ({

        printPage() {
            window.print();
        }
    
      }));

      return <OrderView {...props} />
});

/*  add delivered order to income
    add delivered order shipping to expense
    add to batch edit total price
    add to batch edit total selling price
    add to batch edit totals for shippings
    add to china status filtration
    */
export default withPrintRef;