import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebaseConfig";
import { ref, set, onValue } from "firebase/database";
import toast from "react-hot-toast";

import Button from "react-bootstrap/Button";
import CartModal from "./CartModal";
import EditItemModal from "./EditItemModal";
import AddItemModal from "./AddItemModal";
import "./Shopping.css";

const Shopping = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);

  const [showCartModal, setShowCartModal] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showEditItemModal, setShowEditItemModal] = useState(false);
  const [itemToEdit, setItemToEdit] = useState({});

  let common_stores = ["Costco", "Walmart"];

  const handleEdit = (item) => {
    setItemToEdit(item);
    setShowEditItemModal(true);
  };

  const fetchItems = () => {
    const itemsRef = ref(db, "shopping_items");
    onValue(itemsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const newItems = Object.values(data).map((item) => item);
        setItems(newItems);
      } else {
        setItems([]);
      }
    });
  };

  const handleComplete = async (item) => {
    await set(ref(db, "shopping_items/" + item.name), {
      name: item.name,
      quantity: item.quantity,
      location: item.location,
      description: item.description,
      completed: true,
    });

    toast.success(`Added ${item.name} to cart`);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <>
      <button onClick={() => setShowAddItemModal(true)}>Add Item</button>
      <button onClick={() => setShowCartModal(true)}>Cart</button>
      <button onClick={() => navigate("/inventory")}>Inventory</button>

      <section className="d-flex flex-column gap-5 pb-5">
        {common_stores.map((store) => (
          <section key={store.name}>
            <h1 className="fs-1 fw-normal pb-2">{store}</h1>
            {items.filter((item) => item.location == store && !item.completed)
              .length == 0 && (
              <div className="d-flex justify-content-center">
                <h4 className="text-secondary">No items</h4>
              </div>
            )}
            {items
              .filter((item) => item.location === store && !item.completed)
              .map((item, index) => (
                <div key={index} className="d-flex gap-2">
                  <Button
                    variant="outline-secondary"
                    className="h-50"
                    onClick={() => handleComplete(item)}
                  >
                    <i className="bi bi-check-lg"></i>
                  </Button>
                  <div>
                    <div className="d-flex flex-row gap-3">
                      <h2 className="fw-bold">{item.name}</h2>
                      <Button
                        variant="success"
                        onClick={() => handleEdit(item)}
                      >
                        <i className="bi bi-pencil-square"></i>
                      </Button>
                    </div>
                    <section className="d-flex flex-column">
                      <p className="mb-0">
                        Amount: <span className="fw-bold">{item.quantity}</span>
                      </p>
                      <p>
                        Description:{" "}
                        <span className="fw-bold">{item.description}</span>
                      </p>
                    </section>
                  </div>
                </div>
              ))}
          </section>
        ))}
      </section>

      <section>
        <h1 className="fs-1 fw-normal pb-2">Other</h1>
        {items.filter(
          (item) => !common_stores.includes(item.location) && !item.completed
        ).length == 0 && (
          <div className="d-flex justify-content-center">
            <h4 className="text-secondary">No items</h4>
          </div>
        )}
        {items
          .filter(
            (item) => !common_stores.includes(item.location) && !item.completed
          )
          .map((item, index) => (
            <div key={index} className="d-flex gap-2">
              <Button
                variant="outline-secondary"
                className="h-50"
                onClick={() => handleComplete(item)}
              >
                <i className="bi bi-check-lg"></i>
              </Button>
              <div>
                <div className="d-flex flex-row gap-3">
                  <h2 className="fw-bold">{item.name}</h2>
                  <Button variant="success" onClick={() => handleEdit(item)}>
                    <i className="bi bi-pencil-square"></i>
                  </Button>
                </div>
                <section className="d-flex flex-column">
                  <p className="mb-0">
                    Amount: <span className="fw-bold">{item.quantity}</span>
                  </p>
                  <p className="mb-0">
                    Location: <span className="fw-bold">{item.location}</span>
                  </p>
                  <p>
                    Description:{" "}
                    <span className="fw-bold">{item.description}</span>
                  </p>
                </section>
              </div>
            </div>
          ))}
      </section>

      <CartModal
        items={items}
        showCartModal={showCartModal}
        setShowCartModal={setShowCartModal}
      />

      <AddItemModal
        showAddItemModal={showAddItemModal}
        setShowAddItemModal={setShowAddItemModal}
      />

      <EditItemModal
        item={itemToEdit}
        showEditItemModal={showEditItemModal}
        setShowEditItemModal={setShowEditItemModal}
      />
    </>
  );
};

export default Shopping;
