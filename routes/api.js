const Service = require('../api/service/auth');
const ProductController = require('../api/controller/productController');
const UserController = require('../api/controller/userController');
const BrandController = require('../api/controller/brandController');
const CelebrityController = require('../api/controller/celebrityController');
const ReviewController = require('../api/controller/reviewController');
const WishListController = require('../api/controller/wishListController');
const BoxController = require('../api/controller/myBoxController');
const CmsController = require('../api/controller/cmscontroller');

module.exports = (router) => {

    //Manage User Profile
    router.post('/api/v1/register', UserController.register);
    router.post('/api/v1/login', UserController.login);
    router.post('/api/v1/change_password', Service.authenticate, UserController.changePassword);
    router.post('/api/v1/verify_otp', Service.authenticate, UserController.verifyOTP);
    router.post('/api/v1/send_otp', Service.authenticate, UserController.sendOTP);
    router.post('/api/v1/add_shipping_address', Service.authenticate, UserController.addShippingAddress);
    router.post('/api/v1/update_shipping_address', Service.authenticate, UserController.updateShippingAddress);
    router.post('/api/v1/remove_shipping_address', Service.authenticate, UserController.removeShippingAddress);
    router.post('/api/v1/list_shipping_address', Service.authenticate, UserController.listShippingAddress);

    //Manage Brands
    router.post('/api/v1/brands', Service.authenticate, BrandController.appBrandList);
    router.post('/api/v1/brand_details',Service.authenticate ,BrandController.appBrandDetails);
    router.post('/api/v1/celeb_brand_details',Service.authenticate ,BrandController.appCelebDetailsForBrand);

    //Manage Celebrity
    router.post('/api/v1/celebs',Service.authenticate, CelebrityController.appListofCelebrity);
    //Here Banner is to be given to user
    router.post('/api/v1/celeb_details', Service.authenticate,CelebrityController.appCelebDetails);
    router.post('/api/v1/celeb_reviews', Service.authenticate, CelebrityController.celebReviewsList);
    router.post('/api/v1/celeb_review_details', Service.authenticate, CelebrityController.celebReviewDetails);

    // Manage Products
    router.post('/api/v1/products',Service.authenticate, ProductController.appListofProduct);
    router.post('/api/v1/product_details',Service.authenticate, ProductController.appProductDetails);
    router.post('/api/v1/product_search',Service.authenticate, ProductController.searchProduct);

    //Manage Favorite
    router.post('/api/v1/add_favorite', Service.authenticate, UserController.addFavorite);
    router.post('/api/v1/remove_favorite', Service.authenticate, UserController.removeFavorite);
    router.post('/api/v1/list_favorite', Service.authenticate, UserController.listFavourite);

    //Manage Reviews
    router.post('/api/v1/increase_count', Service.authenticate, ReviewController.increaseReviewCount);
    router.post('/api/v1/reviews', ReviewController.appListReviews);

    //Manage Wishlist
    router.post('/api/v1/wishlist', Service.authenticate, WishListController.listofWishList);
    router.post('/api/v1/add_wishlist', Service.authenticate, WishListController.addToWishList);
    router.post('/api/v1/remove_wishlist', Service.authenticate, WishListController.removeFromWishList);

    //Manage MyBox
    router.post('/api/v1/add_my_box', Service.authenticate, BoxController.addToMyBox);
    router.post('/api/v1/remove_my_box', Service.authenticate, BoxController.removeFromMyBox);
    router.post('/api/v1/my_box', Service.authenticate, BoxController.listofMyBox);

    //Manage Order and checkout

    //Manage CMS
    router.post('/api/v1/contact_us', CmsController.contactUs);
    router.post('/api/v1/get_in_touch', CmsController.getInTouch);
    router.post('/api/v1/faq', CmsController.appFaq);

}