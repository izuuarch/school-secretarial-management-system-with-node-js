const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const {isUserAuthenticated} = require("../config/customFunctions");


router.all('/*', isUserAuthenticated , (req, res, next) => {
    
    req.app.locals.layout = 'admin';
    
    next();
});

router.route('/')
   .get(adminController.index);


 /* VARIOUS ADMIN POST ENDPOINTS */

 router.route('/post')
    .get(adminController.getPosts)

router.route('/post/create')
.get(adminController.createPosts)
.post(adminController.submitPosts);


router.route('/post/edit/:id')
.get(adminController.editPost)

router.route('/post/delete/:id')
.delete(adminController.deletePost);

router.route('/category')
    .get(adminController.getCategories);

    router.route('/category/create')
    .post(adminController.createCategories);

    router.route('/category/edit/:id')
    .get(adminController.editCategoriesGetRoute)
    .post(adminController.editCategoriesPostRoute);

//     router.route('/category/delete/:id')
// .delete(adminController.deletePost);


 module.exports = router;