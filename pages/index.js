import React, { useState, useEffect} from "react";
import CreateProduct from "../components/CreateProduct";
import Product from "../components/Product";
import HeadComponent from '../components/Head';

import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

// Constants
const INSTA_HANDLE = "olhardocelin";
const INSTA_LINK = `https://www.instagram.com/${INSTA_HANDLE}`;

const App = () => {
  const { publicKey } = useWallet();
  const isOwner = ( publicKey ? publicKey.toString() === process.env.NEXT_PUBLIC_OWNER_PUBLIC_KEY : false );
  const [creating, setCreating] = useState(false);
  const [products, setProducts] = useState([]);
  
  const renderNotConnectedContainer = () => (
    <div>
      <img src="https://media.giphy.com/media/NMBqdKUKQ3aLe/giphy.gif" alt="fotógrafo" />

      <div className="button-container">
        <WalletMultiButton className="cta-button connect-wallet-button" />
      </div>    
    </div>
  );
  
  useEffect(() => {
    if (publicKey) {
      fetch(`/api/fetchProducts`)
        .then(response => response.json())
        .then(data => {
          setProducts(data);
          console.log("Products", data);
        });
    }
  }, [publicKey]);

  const renderItemBuyContainer = () => (
    <div className="products-container">
      {products.map((product) => (
        <Product key={product.id} product={product} />
      ))}
    </div>
  );

  return (
    <div className="App">
      <HeadComponent/>
      <div className="container">
        <header className="header-container">
          <p className="header"> Artis - Galeria de Fotos</p>
          <p className="sub-text">A galeria de fotos assinadas com NFTs</p>
 
          {isOwner && (
            <button className="create-product-button" onClick={() => setCreating(!creating)}>
              {creating ? "Close" : "Create Product"}
            </button>
          )}
        </header>

        <main>
          {creating && <CreateProduct />}
          {publicKey ? renderItemBuyContainer() : renderNotConnectedContainer()}
        </main>

        <div className="footer-container">
          <img alt="Instagram Logo" className="insta-logo" src="instagram-logo.png" />
          <a
            className="footer-text"
            href={INSTA_LINK}
            target="_blank"
            rel="noreferrer"
          >{`Feito por @${INSTA_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
