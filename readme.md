# My E-commerce Application

This is a full-stack e-commerce application built with Next.js, Express, and PostgreSQL.

## Features

This application includes a wide range of features for a complete e-commerce experience:

- **User Management:**

  - User authentication (signup, login, logout) with different roles (Customer, Vendor, Delivery Man, Admin).
  - User profile management with shipping addresses.
  - User activity tracking.

- **Product Management:**

  - Comprehensive product catalog with variants (size, color, material).
  - Product categories, brands, and tags for easy organization.
  - Stock management with alert quantities.
  - Product reviews and ratings.

- **Order and Checkout:**

  - Shopping cart functionality.
  - Seamless checkout process with support for multiple shipping addresses.
  - Order tracking and status updates.
  - Support for coupons and discounts.

- **Promotions and Marketing:**

  - Coupon management with various discount types (percentage, fixed, free shipping).
  - Discount management for products, categories, and brands.
  - Banner management for promotional content.
  - Lead generation through a newsletter subscription.

- **Content Management:**

  - Blog functionality with posts, categories, and comments.
  - Customizable menus for the header, footer, and top bar.

- **Admin Dashboard:**
  - Centralized management of products, orders, users, and settings.
  - Stock adjustment capabilities.
  - System settings for site name, logo, currency, and more.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js
- Yarn
- Docker

### Installation

1.  Clone the repo
    ```sh
    git clone https://github.com/your_username_/Project-Name.git
    ```
2.  Install NPM packages for the client
    ```sh
    cd client
    yarn install
    ```
3.  Install NPM packages for the server
    ```sh
    cd ../server
    yarn install
    ```
4.  Start the development servers

    ```sh
    # In the client directory
    yarn dev

    # In the server directory
    yarn dev
    ```

## Technologies Used

- **Frontend:** [Next.js](https://nextjs.org/), [React](https://reactjs.org/), [Redux](https://redux.js.org/), [Tailwind CSS](https://tailwindcss.com/)
- **Backend:** [Express.js](https://expressjs.com/), [Node.js](https://nodejs.org/)
- **Database:** [PostgreSQL](https://www.postgresql.org/)
- **Containerization:** [Docker](https://www.docker.com/)

## Project Structure

The project is organized into two main directories: `client` and `server`.

- **`client`:** Contains the Next.js frontend application.
- **`server`:** Contains the Express.js backend application.
