import React, { useState, useEffect, useContext } from "react";
import { ListContext } from "../components/ListContext";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Battle() {
  const { randomHamsters, setRandomHamsters } = useContext(ListContext);
  const [winner, setWinner] = useState();
  const [loser, setLoser] = useState();

  useEffect(() => {
    fetch("https://hamster-battle-gallery.onrender.com/hamsters/random")
      .then((response) => response.json())
      .then((data) => setRandomHamsters(data));
  }, []);

  console.log(randomHamsters);

  useEffect(() => {
    if (loser !== undefined) {
      (async () => {
        try {
          const response = await axios.put(
            `https://hamster-battle-gallery.onrender.com/hamsters/loser/${loser[0]._id}`
          );

          const getResponse = await axios
            .get(
              `https://hamster-battle-gallery.onrender.com/hamsters/${loser[0]._id}`
            )
            .catch((error) => {
              console.log("error", error);
            });
          setLoser(getResponse.data);
        } catch (error) {
          console.log(error.message);
        }
      })();
    }
  }, [loser]);

  const winnerClick = async (hamster) => {
    setLoser(randomHamsters.filter((hamsterLost) => hamsterLost !== hamster));
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    const response = await axios
      .put(
        `https://hamster-battle-gallery.onrender.com/hamsters/winner/${hamster._id}`
      )
      .catch((error) => {
        console.log("error", error);
      });

    const getResponse = await axios
      .get(
        `https://hamster-battle-gallery.onrender.com/hamsters/${hamster._id}`
      )
      .catch((error) => {
        console.log("error", error);
      });
    setWinner(getResponse.data);
    newGameUpdate();
  };

  const newGameUpdate = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const res = await axios.get(
      "https://hamster-battle-gallery.onrender.com/hamsters/random",
      config
    );
    setRandomHamsters(res.data);
  };

  return (
    <section>
      <section className="main-header">
        <header className="gallery-header">
          <h1>Hamster battle</h1>
          <Link to="/">
            <i className="fa fa-home home-icon" aria-hidden="true"></i>
          </Link>
          <Link to="/gallery">
            <button className="btn-add-hamster">Gallery</button>
          </Link>
          <Link to="/addhamster">
            <button className="btn-add-hamster">Lägg till Hamster</button>
          </Link>
        </header>
      </section>

      <section className="match-result">
        {winner !== undefined ? (
          <article className="winner-container">
            <h2>Den söta vinnaren... {winner.name}</h2>
            <h3>
              {winner.wins} vinster och {winner.defeats} förluster!
            </h3>
            <img  src={`data:image/png;base64, ${winner.imgName}`} className="vinnare-image"></img>
          </article>
        ) : (
          ""
        )}
        {loser !== undefined ? (
          <article className="loser-container">
            <h2>Den söta förluraren... {loser.name}</h2>
            <h3>
              {loser.wins} vinster och {loser.defeats} förluster!
            </h3>
            <img
              src={`data:image/png;base64, ${loser.imgName}`}
              alt="loser-img"
              className="loser-image"
            ></img>
          </article>
        ) : (
          ""
        )}
      </section>
      <section className="battle-body">
        <h2>Ny match?👇</h2>
        <h2>Välj den sötaste hamster...</h2>
        <section className="random-hamster-container">
          {randomHamsters.map((hamster) => {
            return (
              <article
                key={hamster._id}
                className="one-random-hamster"
                onClick={() => {
                  winnerClick(hamster);
                }}
              >
                <h3>{hamster.name}</h3>
                <p>
                  Jag är {hamster.age} år gammal och gillar att {hamster.loves}{" "}
                  och äta {hamster.favFood}
                </p>
                <div className="battle-image">
                  <img
                    src={`data:image/png;base64, ${hamster.imgName}`}
                    className="gallery-image-container"
                  />
                </div>
              </article>
            );
          })}
        </section>
      </section>
    </section>
  );
}
