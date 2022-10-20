import React from "react";
import { Link } from "react-router-dom";

import "./SimilarProduct.css";
function SimilarProduct(props) {
  const { sim } = props;
  return (
    <div className="similar-prod">
      <div className="dress">
        <Link to={`/product/${sim.slug}`}>
          <img src={sim.image} alt="" className="img" />
        </Link>
        <div className="sim-p-name">
          <div className="pname">
            <Link to={`/product/${sim.slug}`}>
              <h4>{sim.name}</h4>
            </Link>
          </div>
          <div className="price">£{sim.price}</div>
        </div>
      </div>
    </div>
  );
}

export default SimilarProduct;
