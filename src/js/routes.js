
import AboutPage from '../pages/about.jsx';
import FormPage from '../pages/form.jsx';
import CatalogPage from '../pages/catalog.jsx';
import ProductPage from '../pages/product/ProductView.jsx';
import SettingsPage from '../pages/settings.jsx';
import LoginPage from '../pages/login.jsx';
import RegisterPage from '../pages/register.jsx';
import AuctionsPage from '../pages/auctions.jsx';
import CheckoutPage from '../pages/checkout.jsx';
import DynamicRoutePage from '../pages/dynamic-route.jsx';
import RequestAndLoad from '../pages/request-and-load.jsx';
import NotFoundPage from '../pages/404.jsx';
import VerifyEmail from '../pages/VerifyEmail.jsx';
import VerifySuccess from '../pages/VerifySuccess.jsx';
import HomePage from '../pages/home.jsx';
import NewProductsPage from "../pages/NewProducts.jsx";
import SecondHandProductsPage from "../pages/SecondHandProducts.jsx";
import VerifyCode from '../pages/verify-code.jsx';

var routes = [
  {
    path: '/login/',
    component: LoginPage,
  },
  {
    path: '/register/',
    component: RegisterPage,
  },
  {
  path: '/verify-code/',
  component: VerifyCode,
},
  {
    path:'/verify-email/:id/:hash',
    component: VerifyEmail,
  },
  {
    path:'/verify-success/',
    component: VerifySuccess,
  },
  {
    path: '/home/',
    component: HomePage,
  },
  {
    path: '/new-products/',
    component: NewProductsPage,
  },
  {
    path: '/second-hand-products/',
    component: SecondHandProductsPage,
  },
  {
    path: '/checkout/',
    component: CheckoutPage,
  },
  {
    path: '/auctions/',
    component: AuctionsPage,
  },
  {
    path: '/about/',
    component: AboutPage,
  },
  {
    path: '/form/',
    component: FormPage,
  },
  {
    path: '/catalog/',
    component: CatalogPage,
  },
  {
    path: '/product/:id',
    component: ProductPage,
  },
  {
    path: '/settings/',
    component: SettingsPage,
  },

  {
    path: '/dynamic-route/blog/:blogId/post/:postId/',
    component: DynamicRoutePage,
  },
  {
    path: '/request-and-load/user/:userId/',
    async: function ({ router, to, resolve }) {
      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();

      // User ID from request
      var userId = to.params.userId;

      // Simulate Ajax Request
      setTimeout(function () {
        // We got user data from request
        var user = {
          firstName: 'Vladimir',
          lastName: 'Kharlampidi',
          about: 'Hello, i am creator of Framework7! Hope you like it!',
          links: [
            {
              title: 'Framework7 Website',
              url: 'http://framework7.io',
            },
            {
              title: 'Framework7 Forum',
              url: 'http://forum.framework7.io',
            },
          ]
        };
        // Hide Preloader
        app.preloader.hide();

        // Resolve route to load page
        resolve(
          {
            component: RequestAndLoad,
          },
          {
            props: {
              user: user,
            }
          }
        );
      }, 1000);
    },
  },
  {
    path: '(.*)',
    component: NotFoundPage,
  },
];

export default routes;
