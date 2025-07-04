import { Block, Button } from "framework7-react";
import React from "react";

const Category = ({ categories }) => {
  return (
    <Block className="category-scroll hide-scrollbar" style={{margin: "0"}}>
      <div
        className="scroll-cat-row hide-scrollbar"
        style={{
          display: "flex",
          gap: "10px",
          overflowX: "auto",
          padding: "10px",
        }}
      >
        {categories.map((cat) => (
          <Button
            key={cat.id}
            small
            outline
            className="category-card"
          >
            {cat.name}
          </Button>
        ))}
      </div>
    </Block>
  );
};

export default Category;
