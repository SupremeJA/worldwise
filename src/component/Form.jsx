// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useEffect, useState } from "react";

import styles from "./Form.module.css";
import Button from "./Button";
import ButtonBack from "./ButtonBack";
import Spinner from "./Spinner";
import Message from "./Message";
import { useUrlPosition } from "../hooks/useUrlPosition";
import { useCities } from "../context/CitiesContext";
import { useNavigate } from "react-router-dom";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";
function Form() {
  const navigate = useNavigate();
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [isGeoLoading, setIsGeoLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [emoji, setEmoji] = useState("");
  const { createCity, isLoading } = useCities();
  const [lat, lng] = useUrlPosition();

  useEffect(
    function () {
      if (!lat && !lng) return;

      async function fetchCity() {
        try {
          setIsGeoLoading(true);
          const res = await fetch(
            `${BASE_URL}?latitude=${lat}&longitude=${lng}`
          );
          const data = await res.json();
          if (!data.city) return;

          if (!data.countryCode)
            throw new Error(
              "That doesn't seem to be a city broski 🤨. Pick somewhere else"
            );

          setCityName(data.city || data.locality || "");
          setCountry(data.countryCode);
          setEmoji(convertToEmoji(data.countryCode));
        } catch (error) {
          setErrorMsg(error.message);
        } finally {
          setIsGeoLoading(false);
        }
      }

      fetchCity();
    },
    [lat, lng]
  );

  async function handleSubmit(e) {
    e.preventDefault();
    if (!cityName || !date) return;
    const newCity = {
      cityName,
      country,
      emoji,
      date,
      notes,
      position: {
        lat,
        lng,
      },
    };
    await createCity(newCity);
    navigate("/app/cities");
  }

  if (!lat && !lng)
    return <Message message="Start by clicking the map to select a city" />;
  if (isGeoLoading) return <Spinner />;
  if (errorMsg) return <Message message={errorMsg} />;

  return (
    <form
      className={`${styles.form} ${isLoading ? styles.loading : ""}`}
      onSubmit={handleSubmit}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        <DatePicker selected={date} onChange={(date) => setDate(date)} />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <ButtonBack />
      </div>
    </form>
  );
}

export default Form;
