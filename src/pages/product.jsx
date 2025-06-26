import React from 'react';
import {
  Page,
  Navbar,
  BlockTitle,
  Block,
  Card,
  CardContent,
  CardFooter,
  Button
} from 'framework7-react';

const newProducts = [
  {
    id: '1',
    name: 'Endo Motor X300',
    brand: 'TeoDental',
    description: 'Precizan i efikasan motor za endodonciju sa višestrukim modovima.',
    price: 119.99,
    taxRate: 0.2,
    image: 'https://focusdental.hr/wp-content/uploads/2023/12/AR-Kofferdam-110-025-1-17-pcs-2-scaled.jpg',
  },
  {
    id: '2',
    name: 'LED Curing Light',
    brand: 'DentLux',
    description: 'Brzo sušenje i moderna LED tehnologija za dentalne procedure.',
    price: 89.5,
    taxRate: 0.2,
    image: 'https://focusdental.hr/wp-content/uploads/2023/12/AR-Kofferdam-110-025-1-17-pcs-2-scaled.jpg',
  },
  {
    id: '3',
    name: 'Glass Ionomer Cement',
    brand: 'GC Europe',
    description: 'Pouzdano rešenje za restauracije uz odličnu hemijsku adheziju.',
    price: 42,
    taxRate: 0.2,
    image: 'https://focusdental.hr/wp-content/uploads/2023/12/AR-Kofferdam-110-025-1-17-pcs-2-scaled.jpg',
  },
];

const BrandNewProductsPage = ({ f7router }) => {
  return (
    <Page name="brand-new-products">
      <Navbar title="Brand New Products" backLink="Back" />

      <BlockTitle className="text-xl">Explore the Latest Arrivals</BlockTitle>
      <Block className="grid grid-cols-1 grid-gap">
        {newProducts.map((item) => (
          <Card key={item.id} className="elevation-2" style={{ borderRadius: '16px' }}>
            <img
              src={item.image}
              alt={item.name}
              style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '16px 16px 0 0' }}
            />
            <CardContent>
              <div className="text-lg font-bold">{item.name}</div>
              <div className="text-sm text-color-gray mb-2">{item.brand}</div>
              <div className="text-sm">{item.description}</div>
              <div className="mt-2">
                <b>€{item.price.toFixed(2)}</b> <span className="text-xs">+ PDV €{(item.price * item.taxRate).toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button fill small onClick={() => f7router.navigate(`/product/${item.id}`)}>
                View Details
              </Button>
              <Button outline small>❤️ Wishlist</Button>
            </CardFooter>
          </Card>
        ))}
      </Block>
    </Page>
  );
};

export default BrandNewProductsPage;
