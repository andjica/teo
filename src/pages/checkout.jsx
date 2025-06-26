import React, { useState } from 'react';
import {
  Page,
  Navbar,
  NavLeft,
  NavRight,
  NavTitle,
  Link,
  Icon,
  List,
  ListInput,
  Block,
  Button,
  Card,
  CardContent,
  BlockTitle,
  f7,
} from 'framework7-react';

const CheckoutPage = () => {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zip: '',
    country: '',
    notes: '',
    paymentMethod: 'card',
  });

  const [cartItems] = useState(JSON.parse(localStorage.getItem('checkoutCart')) || []);
  const total = cartItems.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    f7.dialog.alert(`Order placed! Thank you, ${form.fullName}`);
  };

  return (
    <Page name="checkout">
      <Navbar>
        <NavLeft>
          <Link back>
            <Icon f7="arrow_left" />
          </Link>
        </NavLeft>
        <NavTitle sliding>
          <img src="assets/images/logo.png" alt="Teo Market Logo" style={{ height: '57px' }} />
        </NavTitle>
        <NavRight />
      </Navbar>

      <BlockTitle>1. Your Cart</BlockTitle>
      <Block strong>
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          cartItems.map((item, index) => (
            <Card key={index} style={{ marginBottom: '10px' }}>
              <img src={item.images[0]} alt={item.name} style={{ width: '100%', borderRadius: 10 }} />
              <CardContent>
                <div className="font-bold">{item.name}</div>
                <div className="text-color-gray">{item.brand}</div>
                <div>
                  Qty: {item.quantity || 1} | Size: {item.selectedSize} | Color: {item.selectedColor}
                </div>
                <b>€{(item.price * (item.quantity || 1)).toFixed(2)}</b>
              </CardContent>
            </Card>
          ))
        )}
        <div className="text-align-right text-lg font-bold">
          Total: €{total.toFixed(2)}
        </div>
      </Block>

      <BlockTitle>2. Shipping Information</BlockTitle>
      <Block strong>
        <List noHairlinesMd>
          <ListInput label="Full Name" type="text" placeholder="John Doe" value={form.fullName} onInput={(e) => handleChange('fullName', e.target.value)} />
          <ListInput label="Email" type="email" placeholder="email@example.com" value={form.email} onInput={(e) => handleChange('email', e.target.value)} />
          <ListInput label="Phone" type="tel" placeholder="+381..." value={form.phone} onInput={(e) => handleChange('phone', e.target.value)} />
          <ListInput label="Address" type="text" placeholder="Street, number" value={form.address} onInput={(e) => handleChange('address', e.target.value)} />
          <ListInput label="City" type="text" placeholder="City" value={form.city} onInput={(e) => handleChange('city', e.target.value)} />
          <ListInput label="ZIP" type="text" placeholder="11000" value={form.zip} onInput={(e) => handleChange('zip', e.target.value)} />
          <ListInput label="Country" type="text" placeholder="Serbia" value={form.country} onInput={(e) => handleChange('country', e.target.value)} />
          <ListInput label="Notes" type="textarea" placeholder="Delivery notes (optional)" value={form.notes} onInput={(e) => handleChange('notes', e.target.value)} />
        </List>
      </Block>

      <BlockTitle>3. Payment Method</BlockTitle>
      <Block strong className="grid grid-cols-1 grid-gap">
        <Button
          large
          fill={form.paymentMethod === 'card'}
          outline={form.paymentMethod !== 'card'}
          onClick={() => handleChange('paymentMethod', 'card')}
          className="justify-start"
        >
          <Icon f7="creditcard_fill" />&nbsp; Pay with Card
        </Button>
        <Button
          large
          fill={form.paymentMethod === 'cod'}
          outline={form.paymentMethod !== 'cod'}
          onClick={() => handleChange('paymentMethod', 'cod')}
          className="justify-start"
        >
          <Icon f7="money_dollar_circle_fill" />&nbsp; Cash on Delivery
        </Button>
        <Button
          large
          fill
          className="mt-4"
          onClick={handleSubmit}
        >
          Confirm & Place Order
        </Button>
      </Block>
    </Page>
  );
};

export default CheckoutPage;
