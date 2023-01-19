import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../../Context/Context";

import "./SimilarProduct.css";
function SimilarProduct(props) {
  const { sim } = props;

  const { state, dispatch: ctxDispatch } = useContext(Context);
  const {  settings } = state;
  return (
    <div className="similar-prod">
      <div className="dress">
        {sim.discount > 0 && (
          <div className="item-discount">{sim.discount}%</div>
        )}
        <Link to={`/product/${sim.slug}`}>
          <img src={sim.image} alt="" className="img" />
        </Link>
        <div className="sim-p-name">
          <div className="pname">
            <Link to={`/product/${sim.slug}`}>
              <h4>{sim.name}</h4>
            </Link>
          </div>
          {sim.discount > 0 ? (
            <>
              {settings?.map((s, index) => (
                <>
                  <div className="price" key={index}>
                    {s.currencySign}
                    {(sim.price - (sim.price * sim.discount) / 100)?.toFixed(2)}
                  </div>
                  <s className="price-discount">
                    {s.currencySign}
                    {sim.price}
                  </s>
                </>
              ))}
            </>
          ) : (
            <div className="price">£{sim.price}</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SimilarProduct;
