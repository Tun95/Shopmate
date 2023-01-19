import React from "react";
import FlashCard from "./FlashCard";
import "./styles.css";

function FlashDeal(props) {
  const { simProducts, currencySign } = props;
  return (
    <>
      <section className="flash background">
        <div className="flash_container">
          <FlashCard simProducts={simProducts} currencySign={currencySign} />
        </div>
      </section>
    </>
  );
}

export default FlashDeal;
