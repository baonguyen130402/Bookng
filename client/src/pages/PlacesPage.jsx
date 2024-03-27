import { Link, useParams } from "react-router-dom";
import { useForm } from "../lib/hooks";
import Perks from "../components/Perks";
import axios from "axios";
import { useState } from "react";

export default function PlacesPage() {
  const { action } = useParams();

  const initialValue = {
    title: "",
    address: "",
    photoLink: "",
    description: "",
    perks: [],
    extraInfo: "",
    checkIn: "",
    checkOut: "",
    maxGuests: 1,
  };

  const [formValues, setFormValues] = useForm(initialValue);
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [perks, setPerks] = useState([])
  const [photoLink, setPhotoLink] = useState(formValues.photoLink);

  function inputHeader(text) {
    return <h2 className="text-2xl mt-4">{text}</h2>;
  }

  function inputDescription(text) {
    return <p className="text-gray-500 text-sm">{text}</p>;
  }

  function preInput(header, description) {
    return (
      <>
        {inputHeader(header)}
        {inputDescription(description)}
      </>
    );
  }

  console.log(addedPhotos);

  async function addPhotoByLink(e) {
    e.preventDefault();

    const { data: filename } = await axios.post("/upload-by-link", {
      link: formValues.photoLink,
    });

    setAddedPhotos((prev) => {
      return [...prev, filename];
    });

    setPhotoLink("");
  }

  async function uploadPhoto(e) {
    const files = e.target.files;
    const data = new FormData();

    for (let i = 0; i < files.length; i++) {
      data.append("photos", files[i]);
    }

    await axios.post("/upload", data, {
      headers: {
        "Content-type": "multipart/form-data",
      },
    }).then((res) => {
      const { data: filename } = res;

      setAddedPhotos((prev) => {
        return [...prev, ...filename];
      });
    });
  }

  return (
    <div>
      {action !== "new" && (
        <div className="text-center">
          <Link
            className="inline-flex gap-1 bg-primary text-white py-2 px-4 rounded-full"
            to={"/account/places/new"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            Add new place
          </Link>
        </div>
      )}
      {action === "new" && (
        <div>
          <form>
            {preInput(
              "Title",
              "Title for your place, should be short and catchy as an advertisement",
            )}
            <input
              type="text"
              name="title"
              onChange={setFormValues}
              placeholder="title, for example: My lovely place..."
            />
            {preInput(
              "Address",
              "Address to this place",
            )}
            <input
              type="text"
              name="address"
              onChange={setFormValues}
              placeholder="address, for example: 1313 E Main St ..."
            />
            {preInput(
              "Photos",
              "more a better",
            )}
            <div className="flex gap-2">
              <input
                type="text"
                name="photoLink"
                onChange={setFormValues}
                placeholder={"Add using a link ....jpg"}
              />
              <button
                className="bg-gray-200 px-4 rounded-2xl"
                onClick={addPhotoByLink}
              >
                Add&nbsp;photo
              </button>
            </div>
            <div className="mt-2 grid gap-2 grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {addedPhotos.length > 0 &&
                addedPhotos.map((link) => (
                  <div className="h-32 flex" key={link}>
                    <img
                      className="rounded-2xl w-full object-cover"
                      src={"http://localhost:4000/uploads/" + link}
                    />
                  </div>
                ))}
              <label className="h-32 cursor-pointer flex gap-1 items-center justify-center border bg-transparent rounded-2xl p-2 text-2xl text-gray-600">
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={uploadPhoto}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"
                  />
                </svg>
                Upload
              </label>
            </div>
            {preInput(
              "Description",
              "description of the place",
            )}
            <textarea name="description" onChange={setFormValues} />
            {preInput(
              "Perks",
              "select all the perks of your place",
            )}
            <div className="grid gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
              <Perks selected={perks} onChange={setPerks} />
            </div>
            {preInput(
              "Extra info",
              "house rules, etc",
            )}
            <textarea name="extraInfo" onChange={setFormValues} />
            {preInput(
              "Check in&out times",
              "add check in and out times, remember to have some time windows for cleaning the room better guests",
            )}
            <div className="grid gap-2 sm:grid-cols-3">
              <div>
                <h3 className="mt-2 -mb-1">Check in time</h3>
                <input
                  type="text"
                  name="checkIn"
                  onChange={setFormValues}
                  placeholder="14:00"
                />
              </div>
              <div>
                <h3 className="mt-2 -mb-1">Check out time</h3>
                <input type="text" name="checkOut" onChange={setFormValues} />
              </div>
              <div>
                <h3 className="mt-2 -mb-1">Max number of guests</h3>
                <input
                  type="number"
                  name="maxGuests"
                  defaultValue={1}
                  onChange={setFormValues}
                />
              </div>
            </div>
            <button className="primary mt-4">Save</button>
          </form>
        </div>
      )}
    </div>
  );
}
