const Post = require('../models/PostModel').Post;
const Category = require('../models/CategoryModel').Category;
const {isEmpty} = require('../config/customFunctions');


module.exports = {

    index: (req, res) => {
        res.render('admin/index');

    },

    getPosts: (req, res) => {
           Post.find().then(posts => {
            res.render('admin/post/index', {posts: posts});  
           });
    },


    submitPosts: (req, res) => {

        const commentsAllowed = req.body.allowComments ? true : false;

        // check for any input file
        let filename = '';

        if(!isEmpty(req.files)){
            let file = req.files.uploadedFile;
            filename = file.name;
            let uploadDir = './public/uploads/';

            file.mv(uploadDir+filename, (err) => {
                if (err)
                    throw err;
            });
        }


           const newPost = new Post({
               title: req.body.title,
               description: req.body.description,
               status: req.body.status,
               allowComments: commentsAllowed,
               file: `/uploads/${filename}`

           });
           newPost.save().then(post => {
               req.flash('success-message', 'post created wonderfully');
               res.redirect('/admin/post');
           })
    },

    createPosts: (req, res) => {
        res.render('admin/post/create');
    },

    editPost: (req, res) => {
        const id  = req.params.id;
        Post.findById(id).then(post => {
            res.render('admin/post/edit', {post: post})
        });
    },

    deletePost: (req, res) => {
        Post.findByIdAndDelete(req.params.id)
          .then(deletedPost => {
              req.flash('success-message', `The post ${deletedPost.title} has been deleted.`);
              res.redirect('/admin/post');
          });
    },
// admin controller
    getCategories: (req, res) => {
        Category.find().then(cats => {
            res.render('admin/category/index', {categories: cats});
        });
    },
    createCategories: (req, res) => {
        var categoryName = req.body.name;
        if (categoryName) {
            const newCategory = new Category({
                title: categoryName
            });

            newCategory.save().then(category => {
                res.status(200).json(category);
            });
        }

    },

    editCategoriesGetRoute: async (req, res) => {
        const catId = req.params.id;

        const cats = await Category.find();


        Category.findById(catId).then(cat => {

            res.render('admin/category/edit', {category: cat, categories: cats});

        });
    },

    editCategoriesPostRoute: (req, res) => {
        const catId = req.params.id;
        const newTitle = req.body.name;

        if (newTitle) {
            Category.findById(catId).then(category => {

                category.title = newTitle;

                category.save().then(updated => {
                    res.status(200).json({url: '/admin/category'});
                });

            });
        }
    }

}