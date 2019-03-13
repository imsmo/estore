const config = require('../config');
const Service = require('../api/service/auth');

const UserController = require('../api/controller/userController');
const BrandController = require('../api/controller/brandController');
const ProductController = require('../api/controller/productController');
const CelebrityController = require('../api/controller/celebrityController');
const AdminController = require('../api/controller/adminController');
const ReviewController = require('../api/controller/reviewController');
const CmsController = require('../api/controller/cmscontroller');

module.exports = (router) => {
    

    router.get('/admin/login', async function (req, res) {
        res.render('admin/dashboard', {
            host: config.pre + req.headers.host,
        });
    });

    router.get('/dashboard', async function (req, res) {
        res.render('admin/dashboard', {
            host: config.pre + req.headers.host,
        });
    });

    router.post('/admin/register', async function (req, res) {
        return AdminController.register(req, res);
    });

    router.post('/admin/update_user_state', UserController.updateUserState);
    
    //Manage Brands
    router.get('/admin/brands', async (req, res) => {   
        const brands = await BrandController.getListOfBrands();
        res.send(brands)
    });

    router.get('/admin/brand/:id', async (req, res) => {   
        const brands = await BrandController.getBrand(req.params.id);
        res.send(brands);
    });

    router.post('/admin/add_brand', BrandController.addBrand);
    router.post('/admin/update_brand', BrandController.updateBrand);
    router.post('/admin/delete_brand', BrandController.deleteBrand);

    //Manage Products
    router.get('/admin/get_product/:id', async (req, res) => {
        const product = await ProductController.getProduct(req.params.id);
        res.send(product);
    });
    router.get('/admin/products', async (req, res) => {
        const product = await ProductController.getProductList();
        res.send(product);
    });

    router.post('/admin/add_product', ProductController.addProduct);
    router.post('/admin/update_product', ProductController.updateProduct);
    router.post('/admin/delete_product', ProductController.deleteProduct);
    
     //Manage celebrity
     router.get('/admin/celebrity', async (req, res) => {   
        const celebrities = await CelebrityController.getListOfCelebrity();
        res.send(celebrities);
    });

    router.get('/admin/celebrity/:id', async (req, res) => {   
        const celebrities = await CelebrityController.getCelebrity(req.params.id);
        res.send(celebrities);
    });

    //Manage Celebs
    router.post('/admin/add_celebrity', CelebrityController.addCelebrity);
    router.post('/admin/update_celebrity', CelebrityController.updateCelebrity);
    router.post('/admin/delete_celebrity', CelebrityController.deleteCelebrity);

    //Manage Reviews and Rating
    router.post('/admin/add_review', ReviewController.addReview);

    //Manage CMS
    router.post('/admin/add_contact_us', CmsController.addContactUsInfo);
    router.post('/admin/update_contact_us', CmsController.updateContactUsInfo);
    router.post('/admin/add_faq', CmsController.Faq);
    router.post('/admin/update_faq', CmsController.updateFaq);
}