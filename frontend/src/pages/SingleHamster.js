import React, { useEffect, useState, useCallback } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import axios from "axios";

export default function SingleHamster() {
  const [hamsterInfo, setHamsterInfo] = useState("");

  const location = useLocation();
  const state = location.state;

  const { id } = useParams();

  const fetchHamster = useCallback(async () => {
    const response = await axios
      .get(`https://hamster-battle-gallery.onrender.com/hamsters/${id}`)
      .catch((error) => {
        console.log("error", error);
      });
    setHamsterInfo(response.data);
  });

  useEffect(() => {
    if (id && id !== "") fetchHamster();
  }, [id]);

  return (
    <section>
      {" "}
      <section className="main-header">
        <header className="gallery-header">
          <h1>Om {hamsterInfo.name}</h1>
          <Link to="/">
            <i className="fa fa-home home-icon" aria-hidden="true"></i>
          </Link>
          <Link to="/gallery">
            <button className="btn-add-hamster">Gallery</button>
          </Link>
          <Link to="/battle">
            <button className="btn-add-hamster">Battle</button>
          </Link>
          <Link to="/addhamster">
            <button className="btn-add-hamster">Lägg till Hamster</button>
          </Link>
        </header>
      </section>
      <section className="single-hamster-container">
        <section className="image-details">
          <img
          src={`data:image/png;base64, ${hamsterInfo.imgName}`}
            className="single-image-container"
            alt="hamster"
          />
        </section>
        <section className="one-hamster-details">
          <article className="game-details">
            <article>
              <div>Mina spel:</div>
              <div>{hamsterInfo.games}</div>
            </article>
            <article>
              <div>Mina vinster:</div>
              <div>{hamsterInfo.wins}</div>
            </article>
            <article>
              <div>Mina förluster:</div>
              <div>{hamsterInfo.defeats}</div>
            </article>
          </article>
          <article>
            <div>Min ålder: {hamsterInfo.age}</div>
            <div>Mina favoritaktiviteter: {hamsterInfo.loves}</div>
            <div>Min favorit mat: {hamsterInfo.favFood}</div>
          </article>
        </section>
      </section>
    </section>
  );
}
