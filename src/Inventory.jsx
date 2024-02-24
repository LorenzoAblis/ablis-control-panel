import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebaseConfig";
import { ref, onValue } from "firebase/database";

import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import AddItemModal from "./AddItemModal";
import ExpandedItemModal from "./ExpandedItem";

export const Inventory = () => {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [itemToExpand, setItemToExpand] = useState({});
  const [showExpandedView, setShowExpandedView] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);

  const fetchItems = () => {
    const itemsRef = ref(db, "inventory");
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

  const handleExpand = (item) => {
    setItemToExpand(item);
    setShowExpandedView(true);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <>
      <main>
        <button className="mb-3" onClick={() => setShowAddItemModal(true)}>
          Add item
        </button>
        <button className="mb-3" onClick={() => navigate("/shopping")}>
          Shopping
        </button>
        <section className="d-flex flex-column gap-1">
          {items.map((item) => (
            <Card key={item.name}>
              <Card.Body>
                <Card.Title className="fw-bold fs-3">{item.name}</Card.Title>
                <Card.Subtitle className="mb-2 fw-semibold">
                  {item.location}
                </Card.Subtitle>
                <Card.Text className="mb-0">
                  Qty: <span className="fw-semibold">{item.quantity || 0}</span>
                </Card.Text>
                <Card.Text>
                  Exp:{" "}
                  <span className="fw-semibold">{item.expirationDate}</span>
                </Card.Text>
              </Card.Body>
              <Button variant="primary" onClick={() => handleExpand(item)}>
                Viewh
              </Button>
            </Card>
          ))}
        </section>
      </main>

      <AddItemModal
        showAddItemModal={showAddItemModal}
        setShowAddItemModal={setShowAddItemModal}
        addType="inventory"
      />

      <ExpandedItemModal
        item={itemToExpand}
        showExpandedView={showExpandedView}
        setShowExpandedView={setShowExpandedView}
      />
    </>
  );
};

export default Inventory;
