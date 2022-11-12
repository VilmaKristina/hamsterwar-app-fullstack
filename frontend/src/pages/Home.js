import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://hamster-battle-gallery.onrender.com")
      .then((response) => {
        console.log(response);
        if (!response.ok) {
          throw Error("Sidan kunde inte hittas....");
        }
        return response;
      })
      .catch((err) => {
        setError(err.message);
      });
  }, []);

  const tryToReload = () => {
    setError(null);
    window.location.reload(true);
  };

  return (
    <section>
      {error !== null ? (
        <section className="server-error">
          <h2>{error}</h2>
          <div>
            <button onClick={tryToReload} className="btn-refresh">
              Försök igen!
            </button>
          </div>
        </section>
      ) : (
        <section>
          <section className="main-header">
            <header className="home-header">
              <h1>Välkommen till hamsterwars!</h1>
            </header>
          </section>
          <section>
            <article className="home-body">
              <p>
                Välj den sötaste hamstern av två slumpmässigt valda. Se vad de andra
                tyckte om dessa små sällskapsdjur!
              </p>
            </article>
            <article className="home-btn">
              <Link to="/battle">
                <button className="btn-add-links">To The Battle</button>
              </Link>
              <p></p>
              <Link to="/gallery">
                <button className="btn-add-links">To The Gallery</button>
              </Link>
            </article>
          </section>
        </section>
      )}
    </section>
  );
}
