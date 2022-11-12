import React, { useEffect, useState, useContext } from "react";
import { ListContext } from "../components/ListContext";
import { Link } from "react-router-dom";
import "../App.css";

export default function Gallery() {
  const { listOfHamsters, setListOfHamsters } = useContext(ListContext);
  const [moreInfo, setMoreInfo] = useState(false);

  useEffect(() => {
    fetch("https://hamster-battle-gallery.onrender.com/hamsters")
      .then((response) => response.json())
      .then((data) => setListOfHamsters(data));
  }, []);

  const additionalInfo = (hamster) => {
    setMoreInfo(!moreInfo);
    console.log(hamster.name);
  };

  const afterRemoval = (hamster) => {
    setListOfHamsters(
      listOfHamsters.filter((hamsterAnimal) => hamsterAnimal !== hamster)
    );
  };

  async function removeHamster(hamster) {
    console.log(hamster._id);
    const response = await fetch(
      `https://hamster-battle-gallery.onrender.com/hamsters/${hamster._id}`,
      {
        method: "DELETE",
        body: JSON.stringify(),
        headers: { "Content-type": "application/json" },
      }
    );

    const data = await response.json();
    console.log(data);
  }

  return (
    <section>
      <section className="main-header">
        <header className="gallery-header">
          <h1>Hamster galleri</h1>
          <Link to="/">
            <i className="fa fa-home home-icon" aria-hidden="true"></i>
          </Link>
          <Link to="/battle">
            <button className="btn-add-hamster">Battle</button>
          </Link>
          <Link to="/addhamster">
            <button className="btn-add-hamster">Lägg till Hamster</button>
          </Link>
        </header>
      </section>
      <section className="main-body">
        <section className="all-hamsters-container">
          {listOfHamsters.map((hamster) => {
            return (
              <article key={hamster._id} className="one-hamster-container">
                <img
                  src={`data:image/png;base64, ${hamster.imgName}`}
                  className="gallery-image-container"
                />
                <article className="about-container">
                  <h2>{hamster.name}</h2>
                  <Link to={`/${hamster._id}`}>
                    <button
                      className="more-info"
                      onClick={() => additionalInfo(hamster)}
                    >
                      Om mig
                    </button>
                  </Link>
                  <article className="button-container">
                    <button
                      className="btn-close"
                      onClick={() => {
                        removeHamster(hamster);
                        afterRemoval(hamster);
                      }}
                    >
                      &times;
                    </button>
                  </article>
                </article>
              </article>
            );
          })}
        </section>
      </section>
    </section>
  );
}
