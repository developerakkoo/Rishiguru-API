const Blog = require("../../model/blog/blogModel");

const io = require("../../socket");

exports.getPostById = async (req, res, next) => {
  try {
    const blogId = req.params.id;

    const blog = await Blog.findById(blogId);

    if (blog) {
      res.status(200).json({
        status: "success",
        message: "Blog Post found successfully",
        blog,
      });

      io.getIO().emit("post:id", { action: "get", post: blog });
    } else {
      res.status(404).json({
        status: "error",
        message: "Blog Does Not Exist",
      });
    }
  } catch (error) {
    if (error) {
      res
        .status(500)
        .json({ status: "error", devError: error.message, message: "Something went wrong..." });
    }
  }
};

exports.postblog = async (req, res, next) => {
  try {
    if (!req.file) {
      const error = new Error("No image provided.");
      error.statusCode = 422;
      next(error);
    }

    const title = req.body.title;
    const body = req.body.body;
    const tag = req.body.tag;
    const author = req.body.author;
    const imageUrl = req.file.path.replace(/\\/g, "/");

    const blog = await new Blog({
      title: title,
      body: body,
      tag: tag,
      author: author,
      imageUrl: req.protocol + "://" + req.hostname + ":" + "4343" + "/" + imageUrl,
    });

    blog
      .save()
      .then((result) => {
        if (result) {
          res.status(201).json({ status: "success", message: "Blog Post Created", result });
        }
      })
      .catch((error) => {
        if (error) {
          next(error);
        }
      });
  } catch (error) {
    if (error) {
      res
        .status(500)
        .json({ status: "error", devError: error.message, message: "Something went wrong..." });
    }
  }
};

exports.getAllBlogPosts = async (req, res, next) => {
  try {
    const blog = await Blog.find();
    if (blog) {
      res.status(200).json({length: blog.length, status: 'success', message: 'All Post Fetched', blog, })
      io.getIO().emit("allpost", { action: "get", post: blog });
    }
  } catch (error) {
    if (error) {
      res
        .status(500)
        .json({ status: "error", devError: error.message, message: "Something went wrong..." });
    }
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const blogId = req.params.id;

    const blog = await Blog.findByIdAndDelete(blogId);
    if (blog) {
     
      res.status(200).json({
          status: 'success', message: 'Post Deleted Successfully!'
      })
    } else {
      res.status(404).json({ status: "error", message: "Blog Already Deleted..." });
    }
  } catch (error) {
    if (error) {
      res
        .status(500)
        .json({ status: "error", devError: error.message, message: "Something went wrong..." });
    }
  }
};

const clearImage = (filePath) => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, (err) => console.log(err));
};
