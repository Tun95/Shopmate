import bcrypt from "bcryptjs";

const data = {
  users: [
    {
      name: "Tunji",
      email: "admin@example.com",
      password: bcrypt.hashSync("123456"),
      isAdmin: true,
    },
    {
      name: "John",
      email: "user@example.com",
      password: bcrypt.hashSync("123456"),
      isAdmin: false,
    },
  ],
  products: [
    {
      //_id: "1",
      name: "Kids Pull&Bear Jumper",
      slug: "Pull&Bear Jumper",
      keygen: "Kid KD3569",
      gender: "Female",
      category: ["Brands", "Kids", "Dresses"],
      size: ["XS", "S", "M", "L", "XL", "XXL"],
      color: [
        "fa-solid fa-circle  cl-1",
        "fa-solid fa-circle  cl-2",
        "fa-solid fa-circle  cl-3",
        "fa-solid fa-circle  cl-4",
        "fa-solid fa-circle  cl-5",
        "fa-solid fa-circle  cl-6",
        "fa-solid fa-circle  cl-7",
      ],
      price: 14.99,
      countInStock: 0,
      brand: ["Abercrombie"],
      image: "/imgs/kid1.png",
      rating: 3.0,
      numReviews: 0,
    },
    {
      //_id: "2",
      name: "Men's Knitwear Offers",
      slug: "Men's Knitwear Offers",
      keygen: "Men BK3569",
      gender: "Male",
      category: ["Men", "Brands", "Dresses"],
      size: ["XS", "S", "M", "L", "XL", "XXL"],
      color: [
        "fa-solid fa-circle  cl-1",
        "fa-solid fa-circle  cl-2",
        "fa-solid fa-circle  cl-3",
        "fa-solid fa-circle  cl-4",
        "fa-solid fa-circle  cl-5",
        "fa-solid fa-circle  cl-6",
        "fa-solid fa-circle  cl-7",
      ],
      price: 14.99,
      countInStock: 20,
      brand: "Fitch",
      image: "/imgs/shirt1.png",

      rating: 4.0,
      numReviews: 10,
    },
    {
      //_id: "3",
      name: "Women's Knitwear Offers",
      slug: "Women's-Knitwear-Offers",
      keygen: "Women WM3569",
      gender: "Female",
      category: ["Women", "Brands", "Dresses"],
      size: ["XS", "S", "M", "L", "XL", "XXL"],
      color: [
        "fa-solid fa-circle  cl-1",
        "fa-solid fa-circle  cl-2",
        "fa-solid fa-circle  cl-3",
        "fa-solid fa-circle  cl-4",
        "fa-solid fa-circle  cl-5",
        "fa-solid fa-circle  cl-6",
        "fa-solid fa-circle  cl-7",
      ],
      price: 14.99,
      countInStock: 20,
      brand: "Adidas",
      image: "/imgs/women1.png",

      rating: 3.0,
      numReviews: 5,
    },
    {
      //_id: "4",
      name: "Men Casual Lizard",
      slug: "Men-Casual-Lizard",
      keygen: "Men BK3569",
      gender: "Male",
      category: ["Brands", "Men", "Dresses"],
      size: ["XS", "S", "M", "L", "XL", "XXL"],
      color: [
        "fa-solid fa-circle  cl-1",
        "fa-solid fa-circle  cl-2",
        "fa-solid fa-circle  cl-3",
        "fa-solid fa-circle  cl-4",
        "fa-solid fa-circle  cl-5",
        "fa-solid fa-circle  cl-6",
        "fa-solid fa-circle  cl-7",
      ],
      price: 19.99,
      countInStock: 20,
      brand: "ASOS",
      image: "/imgs/shirt2.png",

      rating: 4.5,
      numReviews: 8,
    },
    {
      //_id: "5",
      name: "Harajuku Tshirt",
      slug: "Harajuku-Tshirt",
      keygen: "Kid KD3569",
      gender: "Male",
      category: ["Brands", "Kids", "Dresses"],
      size: ["XS", "S", "M", "L", "XL", "XXL"],
      color: [
        "fa-solid fa-circle  cl-1",
        "fa-solid fa-circle  cl-2",
        "fa-solid fa-circle  cl-3",
        "fa-solid fa-circle  cl-4",
        "fa-solid fa-circle  cl-5",
        "fa-solid fa-circle  cl-6",
        "fa-solid fa-circle  cl-7",
      ],
      price: 14.99,
      countInStock: 20,
      brand: "Cheap Monday",
      image: "/imgs/kid2.png",

      rating: 5.0,
      numReviews: 17,
    },
    {
      //_id: "6",
      name: "Women Casual Lizard",
      slug: "Women-Casual-Lizard",
      keygen: "Women WM3569",
      gender: "Female",
      category: ["Brands", "Dresses", "Women"],
      size: ["XS", "S", "M", "L", "XL", "XXL"],
      color: [
        "fa-solid fa-circle  cl-1",
        "fa-solid fa-circle  cl-2",
        "fa-solid fa-circle  cl-3",
        "fa-solid fa-circle  cl-4",
        "fa-solid fa-circle  cl-5",
        "fa-solid fa-circle  cl-6",
        "fa-solid fa-circle  cl-7",
      ],
      price: 19.99,
      countInStock: 20,
      brand: ["Abercrombie"],
      image: "/imgs/women2.png",

      rating: 3.0,
      numReviews: 17,
    },
    {
      //_id: "7",
      name: "Novelty T-Shirts",
      slug: "Novelty-T-Shirts",
      keygen: "Men BK3569",
      gender: "Male",
      category: ["Men", "Brands", "Dresses"],
      size: ["XS", "S", "M", "L", "XL", "XXL"],
      color: [
        "fa-solid fa-circle  cl-1",
        "fa-solid fa-circle  cl-2",
        "fa-solid fa-circle  cl-3",
        "fa-solid fa-circle  cl-4",
        "fa-solid fa-circle  cl-5",
        "fa-solid fa-circle  cl-6",
        "fa-solid fa-circle  cl-7",
      ],
      price: 12.09,
      countInStock: 20,
      brand: ["Abercrombie"],
      image: "/imgs/shirt3.png",

      rating: 4.0,
      numReviews: 10,
    },
    {
      //_id: "8",
      name: "Novelty Dress",
      slug: "Novelty-Dress",
      keygen: "Women WM3569",
      gender: "Female",
      category: ["Women", "Brands", "Dresses"],
      size: ["XS", "S", "M", "L", "XL", "XXL"],
      color: [
        "fa-solid fa-circle  cl-1",
        "fa-solid fa-circle  cl-2",
        "fa-solid fa-circle  cl-3",
        "fa-solid fa-circle  cl-4",
        "fa-solid fa-circle  cl-5",
        "fa-solid fa-circle  cl-6",
        "fa-solid fa-circle  cl-7",
      ],
      price: 12.09,
      countInStock: 20,
      brand: ["Abercrombie"],
      image: "/imgs/women3.png",

      rating: 5.0,
      numReviews: 10,
    },
    {
      //_id: "9",
      name: "Various T-Shorts",
      slug: "Various-T-Shorts",
      keygen: "Men BK3569",
      gender: "Male",
      category: ["Men", "Brands", "Dresses"],
      size: ["XS", "S", "M", "L", "XL", "XXL"],
      color: [
        "fa-solid fa-circle  cl-1",
        "fa-solid fa-circle  cl-2",
        "fa-solid fa-circle  cl-3",
        "fa-solid fa-circle  cl-4",
        "fa-solid fa-circle  cl-5",
        "fa-solid fa-circle  cl-6",
        "fa-solid fa-circle  cl-7",
      ],
      price: 24.99,
      countInStock: 20,
      brand: ["Abercrombie"],
      image: "/imgs/shirt4.png",

      rating: 4.0,
      numReviews: 3,
    },
    {
      //_id: "10",
      name: "Various Shorts",
      slug: "Various-Shorts",
      keygen: "Women WM3569",
      gender: "Female",
      category: ["Women", "Brands", "Dresses"],
      size: ["XS", "S", "M", "L", "XL", "XXL"],
      color: [
        "fa-solid fa-circle  cl-1",
        "fa-solid fa-circle  cl-2",
        "fa-solid fa-circle  cl-3",
        "fa-solid fa-circle  cl-4",
        "fa-solid fa-circle  cl-5",
        "fa-solid fa-circle  cl-6",
        "fa-solid fa-circle  cl-7",
      ],
      price: 26.99,
      countInStock: 20,
      brand: ["Abercrombie"],
      image: "/imgs/women4.png",

      rating: 4.0,
      numReviews: 10,
    },
    {
      //_id: "11",
      name: "Men's Pull&Bear Jumper",
      slug: "Pull&Bear-Jumper",
      keygen: "Men BK3569",
      gender: "Male",
      category: ["Men", "Brands", "Dresses"],
      size: ["XS", "S", "M", "L", "XL", "XXL"],
      color: [
        "fa-solid fa-circle  cl-1",
        "fa-solid fa-circle  cl-2",
        "fa-solid fa-circle  cl-3",
        "fa-solid fa-circle  cl-4",
        "fa-solid fa-circle  cl-5",
        "fa-solid fa-circle  cl-6",
        "fa-solid fa-circle  cl-7",
      ],
      price: 14.99,
      countInStock: 20,
      brand: ["Abercrombie"],
      image: "/imgs/shirt5.png",

      rating: 4.0,
      numReviews: 10,
    },
    {
      //_id: "12",
      name: "Pull&Bear Jumper for Womens",
      slug: "Pull&Bear-Jumper for Womens",
      keygen: "Women WM3569",
      gender: "Female",
      category: ["Women", "Brands", "Dresses"],
      size: ["XS", "S", "M", "L", "XL", "XXL"],
      color: [
        "fa-solid fa-circle  cl-1",
        "fa-solid fa-circle  cl-2",
        "fa-solid fa-circle  cl-3",
        "fa-solid fa-circle  cl-4",
        "fa-solid fa-circle  cl-5",
        "fa-solid fa-circle  cl-6",
        "fa-solid fa-circle  cl-7",
      ],
      price: 14.99,
      countInStock: 20,
      brand: ["Abercrombie"],
      image: "/imgs/women5.png",

      rating: 3.0,
      numReviews: 10,
    },
    {
      //_id: "13",
      name: "Harajuku Men's Tshirt",
      slug: "Harajuku-Men's-Tshirt",
      keygen: "Men BK3569",
      gender: "Male",
      category: ["Men", "Brands", "Dresses"],
      size: ["XS", "S", "M", "L", "XL", "XXL"],
      color: [
        "fa-solid fa-circle  cl-1",
        "fa-solid fa-circle  cl-2",
        "fa-solid fa-circle  cl-3",
        "fa-solid fa-circle  cl-4",
        "fa-solid fa-circle  cl-5",
        "fa-solid fa-circle  cl-6",
        "fa-solid fa-circle  cl-7",
      ],
      price: 14.99,
      countInStock: 20,
      brand: ["Abercrombie"],
      image: "/imgs/shirt6.png",

      rating: 5.0,
      numReviews: 10,
    },

    {
      //_id: "14",
      name: "Harajuku Dress",
      slug: "Harajuku-Dress",
      keygen: "Women WM3569",
      gender: "Female",
      category: ["Women", "Brands", "Dresses"],
      size: ["XS", "S", "M", "L", "XL", "XXL"],
      color: [
        "fa-solid fa-circle  cl-1",
        "fa-solid fa-circle  cl-2",
        "fa-solid fa-circle  cl-3",
        "fa-solid fa-circle  cl-4",
        "fa-solid fa-circle  cl-5",
        "fa-solid fa-circle  cl-6",
        "fa-solid fa-circle  cl-7",
      ],
      price: 14.99,
      countInStock: 20,
      brand: ["Abercrombie"],
      image: "/imgs/women6.png",

      rating: 4.5,
      numReviews: 10,
    },
    {
      //_id: "15",
      name: "Harajuku Kids Dress",
      slug: "Harajuku-Kids-Dress",
      keygen: "Kid KD3569",
      gender: "Male",
      category: ["Kids", "Brands", "Dresses"],
      size: ["XS", "S", "M", "L", "XL", "XXL"],
      color: [
        "fa-solid fa-circle  cl-1",
        "fa-solid fa-circle  cl-2",
        "fa-solid fa-circle  cl-3",
        "fa-solid fa-circle  cl-4",
        "fa-solid fa-circle  cl-5",
        "fa-solid fa-circle  cl-6",
        "fa-solid fa-circle  cl-7",
      ],
      price: 14.99,
      countInStock: 20,
      brand: ["Abercrombie"],
      image: "/imgs/kid3.png",

      rating: 5.0,
      numReviews: 10,
    },
    {
      //_id: "16",
      name: "Men's Brown Shoe",
      slug: "Men's-Brown-Shoe",
      keygen: "Men BK3569",
      gender: "Male",
      category: ["Shoes", "Men", "Brands"],
      size: [24, 28, 32, 36, 40, 44],
      color: [
        "fa-solid fa-circle  cl-1",
        "fa-solid fa-circle  cl-2",
        "fa-solid fa-circle  cl-3",
        "fa-solid fa-circle  cl-4",
        "fa-solid fa-circle  cl-5",
        "fa-solid fa-circle  cl-6",
        "fa-solid fa-circle  cl-7",
      ],

      price: 49.99,
      countInStock: 20,
      brand: ["Abercrombie"],
      image: "/imgs/m-shoes2.png",

      rating: 3.0,
      numReviews: 10,
    },
    {
      //_id: "17",
      name: "Kids Blue Shoe",
      slug: "Kids-Blue-Shoe",
      keygen: "Kid KD3569",
      gender: "Male",
      category: ["Shoes", "Kids", "Brands"],
      size: [24, 28, 32, 36, 40, 44],
      color: [
        "fa-solid fa-circle  cl-1",
        "fa-solid fa-circle  cl-2",
        "fa-solid fa-circle  cl-3",
        "fa-solid fa-circle  cl-4",
        "fa-solid fa-circle  cl-5",
        "fa-solid fa-circle  cl-6",
        "fa-solid fa-circle  cl-7",
      ],

      price: 39.99,
      countInStock: 20,
      brand: ["Abercrombie"],
      image: "/imgs/k-shoes1.png",

      rating: 3.8,
      numReviews: 10,
    },
    {
      //_id: "18",
      name: "Kids Shinning Shoe",
      slug: "Kids-Shinning-Shoe",
      keygen: "Kid KD3569",
      gender: "Female",
      category: ["Shoes", "Kids", "Brands"],
      size: [24, 28, 32, 36, 40, 44],
      color: [
        "fa-solid fa-circle  cl-1",
        "fa-solid fa-circle  cl-2",
        "fa-solid fa-circle  cl-3",
        "fa-solid fa-circle  cl-4",
        "fa-solid fa-circle  cl-5",
        "fa-solid fa-circle  cl-6",
        "fa-solid fa-circle  cl-7",
      ],

      price: 19.99,
      countInStock: 20,
      brand: ["Abercrombie"],
      image: "/imgs/k-shoes3.png",

      rating: 5.0,
      numReviews: 10,
    },
    {
      //_id: "19",
      name: "Women High Heels",
      slug: "Women-High-Heels",
      keygen: "Women WM3569",
      gender: "Female",
      category: ["Shoes", "Women", "Brands"],
      size: [24, 28, 32, 36, 40, 44],
      color: [
        "fa-solid fa-circle  cl-1",
        "fa-solid fa-circle  cl-2",
        "fa-solid fa-circle  cl-3",
        "fa-solid fa-circle  cl-4",
        "fa-solid fa-circle  cl-5",
        "fa-solid fa-circle  cl-6",
        "fa-solid fa-circle  cl-7",
      ],

      price: 59.99,
      countInStock: 20,
      brand: ["Abercrombie"],
      image: "/imgs/w-shoes3.png",

      rating: 5.0,
      numReviews: 10,
    },
  ],
  similarProducts: [
    {
      name: "Men Casual Lizard",
      slug: "Men-Casual-Lizard",
      keygen: "Men BK3569",
      gender: "Male",
      category: ["Men", "Brands"],
      size: ["XS", "S", "M", "L", "XL", "XXL"],
      color: [
        "fa-solid fa-circle  cl-1",
        "fa-solid fa-circle  cl-2",
        "fa-solid fa-circle  cl-3",
        "fa-solid fa-circle  cl-4",
        "fa-solid fa-circle  cl-5",
        "fa-solid fa-circle  cl-6",
        "fa-solid fa-circle  cl-7",
      ],
      price: 19.99,
      countInStock: 20,
      brand: "ASOS",
      image: "/imgs/shirt2.png",

      rating: 4.5,
      numReviews: 8,
    },
    {
      name: "Harajuku Tshirt",
      slug: "Harajuku-Tshirt",
      keygen: "Kid KD3569",
      gender: "Male",
      category: ["Kids"],
      size: ["XS", "S", "M", "L", "XL", "XXL"],
      color: [
        "fa-solid fa-circle  cl-1",
        "fa-solid fa-circle  cl-2",
        "fa-solid fa-circle  cl-3",
        "fa-solid fa-circle  cl-4",
        "fa-solid fa-circle  cl-5",
        "fa-solid fa-circle  cl-6",
        "fa-solid fa-circle  cl-7",
      ],
      price: 14.99,
      countInStock: 20,
      brand: "Cheap Monday",
      image: "/imgs/kid2.png",

      rating: 5.0,
      numReviews: 17,
    },
    {
      name: "Kids Blue Shoe",
      slug: "Kids-Blue-Shoe",
      keygen: "Kid KD3569",
      gender: "Male",
      category: ["Shoes"],
      size: [24, 28, 32, 36, 40, 44],
      color: [
        "fa-solid fa-circle  cl-1",
        "fa-solid fa-circle  cl-2",
        "fa-solid fa-circle  cl-3",
        "fa-solid fa-circle  cl-4",
        "fa-solid fa-circle  cl-5",
        "fa-solid fa-circle  cl-6",
        "fa-solid fa-circle  cl-7",
      ],

      price: 39.99,
      countInStock: 20,
      brand: "Abercrombie",
      image: "/imgs/k-shoes1.png",

      rating: 3.8,
      numReviews: 10,
    },
    {
      name: "Novelty T-Shirts",
      slug: "Novelty-T-Shirts",
      keygen: "Men BK3569",
      gender: "Male",
      category: ["Men"],
      size: ["XS", "S", "M", "L", "XL", "XXL"],
      color: [
        "fa-solid fa-circle  cl-1",
        "fa-solid fa-circle  cl-2",
        "fa-solid fa-circle  cl-3",
        "fa-solid fa-circle  cl-4",
        "fa-solid fa-circle  cl-5",
        "fa-solid fa-circle  cl-6",
        "fa-solid fa-circle  cl-7",
      ],
      price: 12.09,
      countInStock: 20,
      brand: "Abercrombie",
      image: "/imgs/shirt3.png",

      rating: 4.0,
      numReviews: 10,
    },
    {
      name: "Harajuku Kids Dress",
      slug: "Harajuku-Kids-Dress",
      keygen: "Kid KD3569",
      gender: "Male",
      category: ["Kids"],
      size: ["XS", "S", "M", "L", "XL", "XXL"],
      color: [
        "fa-solid fa-circle  cl-1",
        "fa-solid fa-circle  cl-2",
        "fa-solid fa-circle  cl-3",
        "fa-solid fa-circle  cl-4",
        "fa-solid fa-circle  cl-5",
        "fa-solid fa-circle  cl-6",
        "fa-solid fa-circle  cl-7",
      ],
      price: 14.99,
      countInStock: 20,
      brand: "Abercrombie",
      image: "/imgs/kid3.png",

      rating: 5.0,
      numReviews: 10,
    },
    {
      name: "Various Shorts",
      slug: "Various-Shorts",
      keygen: "Women WM3569",
      gender: "Female",
      category: ["Women"],
      size: ["XS", "S", "M", "L", "XL", "XXL"],
      color: [
        "fa-solid fa-circle  cl-1",
        "fa-solid fa-circle  cl-2",
        "fa-solid fa-circle  cl-3",
        "fa-solid fa-circle  cl-4",
        "fa-solid fa-circle  cl-5",
        "fa-solid fa-circle  cl-6",
        "fa-solid fa-circle  cl-7",
      ],
      price: 26.99,
      countInStock: 20,
      brand: "Abercrombie",
      image: "/imgs/women4.png",

      rating: 4.0,
      numReviews: 10,
    },
  ],
};

export default data;
