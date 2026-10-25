<div align="center">

# 🛒 TechMarket

**Online store demo built with vanilla JavaScript, ES modules and a REST API**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-38bdf8?style=for-the-badge&logo=github&logoColor=white)](https://alexdrts.github.io/techmarket/)

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)

</div>

<img width="100%" alt="photo_2026-10-25_13-12-39" src="https://github.com/user-attachments/assets/429aa8b5-bde6-4526-aef6-51940f66d845" />

## ✨ Features

- 🛍 **Product catalog** loaded from [Fake Store API](https://fakestoreapi.com), with a saved offline copy if the API is down
- 🗂 **Category filter**, built from the categories in the data
- 🔍 **Live search** by product name and description
- ↕️ **Sorting** by price and rating
- 🧺 **Cart** with quantities, line totals and a running total, saved in `localStorage`
- 📝 **Checkout form** with validation and inline error messages
- ⏳ **Order tracking**: create → process → deliver, a chain of async steps (with a simulated chance of failure and retry)
- 📱 Responsive layout, keyboard friendly, toast notifications

## 🧩 Under the hood

The app logic is split into ES module classes:

| Class | Responsibility |
|---|---|
| `Product` | Product data, price formatting, search matching |
| `Category` | Category labels built from product data |
| `Cart` | Add / update / remove items, totals, persistence in `localStorage` |
| `Customer` | Customer data and form validation |
| `Order` | Order total and the async order flow (`async/await`, Promises) |

Other modules: `api.js` (fetch with timeout and offline fallback), `ui.js` (toast, cart badge, safe DOM helpers), `app.js` (catalog page), `cartPage.js` (cart and checkout).

All product text is rendered with `textContent`, never `innerHTML`, so data from the API can't inject markup.

## 📁 Project structure

```
├── index.html          # Catalog: search, categories, sorting, product grid
├── cart.html           # Cart and checkout
├── 404.html
├── css/style.css
├── data/products.json  # Offline copy of the catalog
└── js/
    ├── Product.js  Category.js  Cart.js  Customer.js  Order.js
    ├── api.js  ui.js
    ├── app.js          # Catalog page
    └── cartPage.js     # Cart page
```

## 🚀 Run locally

ES modules need a web server (opening the file directly won't work):

```bash
npx serve .
# or use the "Live Server" extension in VS Code
```

---

<div align="center">

Made by [Alex](https://github.com/AlexDrts) 😈

</div>
