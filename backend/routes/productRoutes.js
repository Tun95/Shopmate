import express, { query } from "express";
import Product from "../models/productModels.js";
import expressAsyncHandler from "express-async-handler";
import { isAdmin, isAuth, isSellerOrAdmin } from "../utils.js";

const productRouter = express.Router();

productRouter.get("/", async (req, res) => {
  const seller = req.query.seller || "";
  const sellerFilter = seller ? { seller } : {};
  const products = await Product.find({ ...sellerFilter }).populate("seller");
  res.send(products);
});

//CREATE PRODUCT
productRouter.post(
  "/",
  isAuth,
  isSellerOrAdmin,
  expressAsyncHandler(async (req, res) => {
    const newProduct = new Product({
      name: "sample name" + Date.now(),
      seller: req.user._id,
      slug: "sample-name-" + Date.now(),
      keygen: "Men BK3569",
      gender: "Male",
      category: [""],
      size: ["XS", "S", "24", "32"],
      color: [""],
      brand: ["Abercrombie"],
      image: "/imgs/shirt1.png",
      desc: "Sample Description",
      price: 0,
      countInStock: 0,
      rating: 0,
      discount: 0,
      numReviews: 0,
    });
    const product = await newProduct.save();
    res.send({ message: "Sample Product Created Successfully", product });
  })
);

//UPDATING PRODUCT
productRouter.put(
  "/:id",
  isAuth,
  isSellerOrAdmin,
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (product) {
      product.name = req.body.name;
      product.slug = req.body.slug;
      product.keygen = req.body.keygen;
      product.gender = req.body.gender;
      product.category = req.body.category;
      product.size = req.body.size;
      product.color = req.body.color;
      product.brand = req.body.brand;
      product.image = req.body.image;
      product.images = req.body.images;
      product.desc = req.body.desc;
      product.price = req.body.price;
      product.discount = req.body.discount;
      product.countInStock = req.body.countInStock;
      await product.save();
      res.send({ message: "Product Updated" });
    } else {
      res.status(404).send({ message: "Product Not Found" });
    }
  })
);

//PRODUCT DELETE
productRouter.delete(
  "/:id",
  isAuth,
  isSellerOrAdmin,
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.remove();
      res.send({ message: "Product Deleted Successfully" });
    } else {
      res.status(404).send({ message: "Product Not Found" });
    }
  })
);

//PRODUCT REVIEW
productRouter.post(
  "/:id/reviews",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (product) {
      if (product.seller === req.user.id) {
        return res
          .status(400)
          .send({ message: "You can't review your product" });
      } else {
        if (product.reviews.find((x) => x.name === req.user.name)) {
          return res
            .status(400)
            .send({ message: "You already submitted a review" });
        }
        const review = {
          name: req.user.name,
          rating: Number(req.body.rating),
          comment: req.body.comment,
        };
        product.reviews.push(review);
        product.numReviews = product.reviews.length;
        product.rating =
          product.reviews.reduce((a, c) => c.rating + a, 0) /
          product.reviews.length;
        const updatedProduct = await product.save();
        res.status(201).send({
          message: "Review Created",
          review: updatedProduct.reviews[updatedProduct.reviews.length - 1],
          numReviews: product.numReviews,
          rating: product.rating,
        });
      }
    } else {
      res.status(404).send({ message: "Product Not Found" });
    }
  })
);

//ADMIN PRODUCT LIST
const ADMIN_PAGE_SIZE = 15;
productRouter.get(
  "/admin",
  // isAuth,
  // isSellerOrAdmin,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const page = query.page || 1;
    const seller = query.seller || "";
    const pageSize = query.pageSize || ADMIN_PAGE_SIZE;

    //const sellerFilter = seller ? { seller } : {};
    const sellerFilter = seller && seller !== "all" ? { seller } : {};
    const products = await Product.find({
      ...sellerFilter,
    })
      .populate(
        "seller",
        "seller.name seller.logo seller.rating seller.numReviews"
      )
      .skip(pageSize * (page - 1))
      .limit(pageSize)
      .sort("-createdAt");

    const countProducts = await Product.countDocuments({
      ...sellerFilter,
    });

    res.send({
      products,
      countProducts,
      page,
      pages: Math.ceil(countProducts / pageSize),
    });
  })
);

// CROSS CHECK PRODUCT FILTER
//PRODUCT FILTER
const PAGE_SIZE = 6;
productRouter.get(
  "/store",
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const pageSize = query.pageSize || PAGE_SIZE;
    const page = query.page || 1;
    const category = query.category || "";
    const seller = query.seller || "";
    const gender = query.gender || "";
    const color = query.color || "";
    const size = query.size || "";
    const price = query.price || "";

    // const min = query.min && Number(query.min) !== 0 ? Number(query.min) : 0;
    // const max = query.max && Number(query.max) !== 0 ? Number(query.max) : 0;

    const rating = query.rating || "";
    const order = query.order || "";
    const brand = query.brand || "";
    const searchQuery = query.query || "";

    const queryFilter =
      searchQuery && searchQuery !== "all"
        ? {
            name: {
              $regex: searchQuery,
              $options: "i",
            },
          }
        : {};
    const categoryFilter = category && category !== "all" ? { category } : {};
    //const sellerFilter = seller ? { seller } : {};
    const sellerFilter = seller && seller !== "all" ? { seller } : {};
    const genderFilter = gender && gender !== "all" ? { gender } : {};
    const sizeFilter = size && size !== "all" ? { size } : {};
    const colorFilter = color && color !== "all" ? { color } : {};
    const brandFilter = brand && brand !== "all" ? { brand } : {};

    const ratingFilter =
      rating && rating !== "all"
        ? {
            rating: {
              $gte: Number(rating),
            },
          }
        : {};
    // const priceFilter = min && max ? { price: { $gte: min, $lte: max } } : {};
    const priceFilter =
      price && price !== "all"
        ? {
            price: {
              $gte: Number(price.split("-")[0]),
              $lte: Number(price.split("-")[1]),
            },
          }
        : {};

    const sortOrder =
      order === "featured"
        ? { featured: -1 }
        : order === "lowest"
        ? { price: 1 }
        : order === "highest"
        ? { price: -1 }
        : order === "toprated"
        ? { rating: -1 }
        : order === "newest"
        ? { createdAt: -1 }
        : { _id: -1 };

    const products = await Product.find({
      ...queryFilter,
      ...categoryFilter,
      ...sellerFilter,
      ...genderFilter,
      ...colorFilter,
      ...sizeFilter,
      ...brandFilter,
      ...priceFilter,
      ...ratingFilter,
    })
      .populate("seller wish")
      .sort(sortOrder)
      .skip(pageSize * (page - 1))
      .limit(pageSize);

    const countProducts = await Product.countDocuments({
      ...queryFilter,
      ...categoryFilter,
      ...sellerFilter,
      ...genderFilter,
      ...colorFilter,
      ...sizeFilter,
      ...brandFilter,
      ...priceFilter,
      ...ratingFilter,
    });
    res.send({
      products,
      countProducts,
      page,
      pages: Math.ceil(countProducts / pageSize),
    });
  })
);

//CATEGORIES
productRouter.get(
  "/categories",
  expressAsyncHandler(async (req, res) => {
    const categories = await Product.find(req.params.category);
    res.send(categories);
  })
);

//PRODUCT DETAILS BY SLUG
productRouter.get("/slug/:slug", async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug }).populate(
    "seller wish"
  );
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: "Product Not Found" });
  }
});

//===============
//RELATED PRODUCT
//===============
productRouter.get("/related/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    const related = await Product.find({
      _id: { $ne: product._id }, // Use product._id instead of product
      category: product.category,
    })
      .limit(6)
      .populate("category", "name");

    console.log("RELATED PRODUCTS", related);
    res.json(related);
  } catch (err) {
    console.log(err);
  }
});

//PRODUCT DETAILS BY ID
productRouter.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id).populate("seller");
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: "Product Not Found" });
  }
});

export default productRouter;
