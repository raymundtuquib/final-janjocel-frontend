import { useEffect, useState } from "react";
import axios from "axios";
import './app.css'

interface Car {
  id?: number;
  make: string;
  model: string;
  year: string;
}

export default function App() {
  const [cars, setCars] = useState<Car[]>([]);
  const [form, setForm] = useState<Car>({ make: "", model: "", year: "" });
  const [editId, setEditId] = useState<number | null>(null);

 const API = "https://final-janjocel-backend.onrender.com/cars";



  // Fetch all cars
  const fetchCars = async () => {
    try {
      const res = await axios.get(API);
      setCars(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  // Add or Update
  const handleSubmit = async () => {
    if (!form.make || !form.model || !form.year) return alert("Fill all fields!");

    try {
      if (editId === null) {
        await axios.post(API, form);
      } else {
        await axios.put(`${API}/${editId}`, form);
        setEditId(null);
      }
      setForm({ make: "", model: "", year: "" });
      fetchCars();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (car: Car) => {
    setForm(car);
    setEditId(car.id!);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${API}/${id}`);
      fetchCars();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div id="root">
      <h1>🚗 Car Rental System</h1>

      {/* Form Card */}
      <div className="card">
        <h2>{editId === null ? "Add New Car" : "Update Car"}</h2>
        <input
          placeholder="Car Make (e.g., Toyota)"
          value={form.make}
          onChange={(e) => setForm({ ...form, make: e.target.value })}
        />
        <input
          placeholder="Car Model (e.g., Vios)"
          value={form.model}
          onChange={(e) => setForm({ ...form, model: e.target.value })}
        />
        <input
          placeholder="Year (e.g., 2020)"
          type="number"
          value={form.year}
          onChange={(e) => setForm({ ...form, year: e.target.value })}
        />
        <button
          className="add"
          onClick={handleSubmit}
        >
          {editId === null ? "Add Car" : "Update Car"}
        </button>
      </div>

      {/* Car List */}
      <div>
        <h2>Available Cars</h2>
        {cars.length === 0 ? (
          <p>No cars available.</p>
        ) : (
          <ul>
            {cars.map((car) => (
              <li key={car.id} className="car-item">
                <div>
                  <p>{car.make} {car.model}</p>
                  <p>Year: {car.year}</p>
                </div>
                <div>
                  <button className="edit" onClick={() => handleEdit(car)}>Edit</button>
                  <button className="delete" onClick={() => handleDelete(car.id!)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
