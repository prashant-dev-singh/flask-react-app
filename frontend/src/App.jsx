import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = () => {
    fetch("http://127.0.0.1:5000/items")
      .then((res) => res.json())
      .then((data) => setItems(data));
  };

  const addItem = () => {
    fetch("http://127.0.0.1:5000/items", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, price }),
    }).then(() => {
      fetchItems();
      setName("");
      setPrice("");
    });
  };

  const updateItem = () => {
    fetch(`http://127.0.0.1:5000/items/${editId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, price }),
    }).then(() => {
      fetchItems();
      setEditId(null);
      setName("");
      setPrice("");
    });
  };

  const deleteItem = (id) => {
    fetch(`http://127.0.0.1:5000/items/${id}`, {
      method: "DELETE",
    }).then(() => fetchItems());
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">🛒 Item Manager</h1>

      {/* Form Card */}
      <div className="card p-4 shadow mb-4">
        <div className="row">
          <div className="col-md-5">
            <input
              className="form-control"
              placeholder="Item Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="col-md-3">
            <input
              className="form-control"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div className="col-md-4">
            <button
              className={`btn ${
                editId ? "btn-warning" : "btn-primary"
              } w-100`}
              onClick={editId ? updateItem : addItem}
            >
              {editId ? "Update Item" : "Add Item"}
            </button>
          </div>
        </div>
      </div>

      {/* Items List */}
      <div className="row">
        {items.map((item) => (
          <div key={item.id} className="col-md-4 mb-3">
            <div className="card shadow-sm p-3">
              <h5>{item.name}</h5>
              <p className="text-muted">₹ {item.price}</p>

              <div className="d-flex justify-content-between">
                <button
                  className="btn btn-sm btn-warning"
                  onClick={() => {
                    setEditId(item.id);
                    setName(item.name);
                    setPrice(item.price);
                  }}
                >
                  Edit
                </button>

                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => deleteItem(item.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;