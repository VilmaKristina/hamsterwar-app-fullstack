import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../App";
import * as yup from "yup";

export default function AddHamster() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [favFood, setFavFood] = useState("");
  const [loves, setLoves] = useState("");
  const [file, setFile] = useState("");

  const [imagePreview, setImagePreview] = useState(null);
  const [imgMessage, setImgMessage] = useState(false);
  const [sizeMessage, setSizeMessage] = useState(false);

  const [error, setError] = useState(false);
  const [check, setCheck] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  }, [file]);

  const redirectToGallery = () => {
    setTimeout(() => {
      navigate("/gallery");
    }, 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !name ||
      !age ||
      !favFood ||
      !loves ||
      !file ||
      favFood.length > 10 ||
      loves.length > 10
    ) {
      console.log(name);
      setError(true);
      return null;
    }
  };

  const userSchema = yup.object().shape({
    name: yup.string().required().strict(true),
    age: yup.number().required().strict(true),
    favFood: yup.string().required().strict(true),
    loves: yup.string().required().strict(true),
    imgName: yup.mixed().required().strict(true),
  });

  const newHamster = async (e) => {
    e.preventDefault();

    const fd = {
      name: name,
      age: parseInt(age),
      favFood: favFood,
      loves: loves,
      imgName: file,
    };

    const isValid = await userSchema.isValid(fd);

    if (isValid === true) {
      try {
        const config = {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        };

        const response = await axios.post(
          "https://hamster-battle-gallery.onrender.com/hamsters",
          fd,
          config
        );
        setCheck(true);
        redirectToGallery();
      } catch (error) {
        console.log(error);
      }
    } else {
      return null;
    }
  };

  const checkImage = (event) => {
    const file = event.target.files[0];
    if (
      file &&
      file.type.substr(0, 5) === "image" &&
      file &&
      file.size <= 1024 * 1024 * 5
    ) {
      setFile(file);
      setImgMessage(false);
      setSizeMessage(false);
    } else if (file.type.substr(0, 5) !== "image") {
      setFile(null);
      setSizeMessage(false);
      setImgMessage(true);
    } else if (file.size >= 1024 * 1024 * 5) {
      setFile(null);
      setImgMessage(false);
      setSizeMessage(true);
    }
  };

  const previewImage = (event) => {
    const thisFile = event.target.files[0];

    if (thisFile) {
      setImagePreview(thisFile);
    } else {
      setImagePreview(null);
    }
  };

  return (
    <section>
      <section className="main-header">
        <header className="gallery-header">
          <h1>Lägg till hamster</h1>
          <Link to="/">
            <i className="fa fa-home home-icon" aria-hidden="true"></i>
          </Link>
          <Link to="/battle">
            <button className="btn-add-hamster">Battle</button>
          </Link>
          <Link to="/gallery">
            <button className="btn-add-hamster">Gallery</button>
          </Link>
        </header>
      </section>
      {check ? (
        <section className="add-confirmation">
          <h2>
            Your hamster <span className="added-hamster-name">{name}</span> has
            been added successfully to the gallery!
          </h2>

          <h4>You will be redirected shortly...!</h4>
        </section>
      ) : (
        <form className="hamster-form">
          <h2>Din Hamster:</h2>
          <div>
            <input
              type="text"
              name="name"
              placeholder="Namn"
              onChange={(event) => setName(event.target.value)}
            />
            {error && name.length <= 0 ? (
              <div className="field-error">*Namn är obligatoriskt fält</div>
            ) : (
              ""
            )}
          </div>
          <div>
            <input
              type="number"
              name="age"
              min="1"
              placeholder="Ålder"
              onChange={(event) => setAge(event.target.value)}
            />
            {error && age.length <= 0 ? (
              <div className="field-error">*Ålder är obligatoriskt fält</div>
            ) : (
              ""
            )}
          </div>
          <div>
            <input
              type="text"
              name="favFood"
              placeholder="Favoritmat"
              onChange={(event) => setFavFood(event.target.value)}
            />
            {error && favFood.length <= 0 ? (
              <div className="field-error">
                *Favoritmat är obligatoriskt fält
              </div>
            ) : (
              ""
            )}
          </div>
          <div>
            <input
              type="text"
              name="loves"
              placeholder="Favoritaktiviteter"
              onChange={(event) => setLoves(event.target.value)}
            />
            {error && loves.length <= 0 ? (
              <div className="field-error">
                *Favoritaktiviteten är obligatoriskt fält
              </div>
            ) : (
              ""
            )}
          </div>
          <div>
            <input
              className="image-input"
              type="file"
              name="imgName"
              onChange={(event) => {
                checkImage(event);
                previewImage(event);
              }}
            />
            <div>* Bildformat: jpeg/jpg/png & max 5 MB</div>
            {error && !file ? (
              <div className="field-error">*Picture is required</div>
            ) : (
              ""
            )}
          </div>

          <div className="added-image">
            {file !== null ? (
              <img
                src={imagePreview}
                className="upload-image"
                width="300px"
              ></img>
            ) : null}
            {imgMessage === true ? (
              <h3>Image format is not supported</h3>
            ) : null}
            {sizeMessage === true ? <h3>Bilden är för stor!</h3> : null}

            <button
              className="btn-upload-image"
              onClick={(e) => {
                handleSubmit(e);
                newHamster(e);
              }}
            >
              Upload
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
