import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebaseConfig";
import { ref, set, onValue } from "firebase/database";
import toast from "react-hot-toast";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
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
      quantity: Number(item.quantity),
      store: item.store,
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
      <div className="mb-2">
        <Button
          variant="success"
          onClick={() => setShowAddItemModal(true)}
          style={{ marginRight: "0.5rem" }}
        >
          <i className="bi bi-plus-lg"></i>
        </Button>
        <Button
          variant="primary"
          onClick={() => setShowCartModal(true)}
          style={{ marginRight: "0.5rem" }}
        >
          <i className="bi bi-basket-fill"></i>
        </Button>
        <Button variant="secondary" onClick={() => navigate("/inventory")}>
          <i className="bi bi-inboxes-fill"></i>
        </Button>
      </div>

      <section className="d-flex flex-column gap-4 pb-4 mt-3">
        {common_stores.map((store) => (
          <Card key={store.name} className="shadow">
            <Card.Body>
              <Card.Title className="fs-1 fw-normal mb-4 fw-bold">
                {store}
              </Card.Title>
              {items.filter((item) => item.store == store && !item.completed)
                .length == 0 && (
                <div className="d-flex justify-content-center">
                  <h4 className="text-secondary">No items</h4>
                </div>
              )}
              {items
                .filter((item) => item.store === store && !item.completed)
                .map((item, index) => (
                  <div key={index} className="d-flex gap-2 pb-3">
                    <Button
                      variant="outline-secondary"
                      className="complete-button"
                      onClick={() => handleComplete(item)}
                    />
                    <div>
                      <div className="d-flex flex-row gap-3">
                        <h3 className="fw-bold">{item.name}</h3>
                        <Button
                          variant="success"
                          onClick={() => handleEdit(item)}
                        >
                          <i className="bi bi-pencil-square"></i>
                        </Button>
                      </div>
                      <section className="d-flex flex-column">
                        <p className="mb-0">
                          Amount:{" "}
                          <span className="fw-bold">{item.quantity}</span>
                        </p>
                        {item.description !== "" && (
                          <p>
                            Description:{" "}
                            <span className="fw-bold">{item.description}</span>
                          </p>
                        )}
                      </section>
                    </div>
                  </div>
                ))}
            </Card.Body>
          </Card>
        ))}
      </section>

      <Card className="shadow">
        <Card.Body>
          <Card.Title className="fs-1 fw-normal mb-4 fw-bold">Other</Card.Title>
          {items.filter(
            (item) => !common_stores.includes(item.store) && !item.completed
          ).length == 0 && (
            <div className="d-flex justify-content-center">
              <h4 className="text-secondary">No items</h4>
            </div>
          )}
          {items
            .filter(
              (item) => !common_stores.includes(item.store) && !item.completed
            )
            .map((item, index) => (
              <div key={index} className="d-flex gap-2 pb-3">
                <Button
                  variant="outline-secondary"
                  className="complete-button"
                  onClick={() => handleComplete(item)}
                />
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
                      Store: <span className="fw-bold">{item.store}</span>
                    </p>
                    {item.description !== "" && (
                      <p>
                        Description:{" "}
                        <span className="fw-bold">{item.description}</span>
                      </p>
                    )}
                  </section>
                </div>
              </div>
            ))}
        </Card.Body>
      </Card>

      <CartModal
        items={items}
        showCartModal={showCartModal}
        setShowCartModal={setShowCartModal}
      />

      <AddItemModal
        showAddItemModal={showAddItemModal}
        setShowAddItemModal={setShowAddItemModal}
        addType="shopping"
      />

      <EditItemModal
        item={itemToEdit}
        editType="shopping"
        showEditItemModal={showEditItemModal}
        setShowEditItemModal={setShowEditItemModal}
      />
    </>
  );
};

export default Shopping;
