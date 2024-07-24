import React from "react";

export default function Wishlist() {
  return (
    <div>
      <h2>My Wishlist</h2>
      <p>You have 2 prducts in your wishlist</p>
      <div className="flex justify-between">

        <div className="flex">
          <div>imge</div>
          <div>
            <h2>Product Name</h2>
          </div>
        </div>
        <div>Delete</div>
      </div>
    </div>
  );
}
