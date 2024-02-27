import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebaseConfig";
import { ref, onValue } from "firebase/database";

import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import AddItemModal from "./AddItemModal";
import ExpandedItemModal from "./ExpandedItem";
import TakeModal from "./TakeModal";

export const Inventory = () => {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState({});
  const [showExpandedView, setShowExpandedView] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showTakeModal, setShowTakeModal] = useState(false);

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
    setSelectedItem(item);
    setShowExpandedView(true);
  };

  const handleTake = (item) => {
    setSelectedItem(item);
    setShowTakeModal(true);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <>
      <main>
        <button className="mb-3" onClick={() => setShowAddItemModal(true)}>
          Add Item
        </button>
        <button className="mb-3" onClick={() => navigate("/shopping")}>
          Shopping
        </button>
        <section className="d-flex flex-column gap-2">
          {items.map((item) => (
            <Card key={item.name}>
              <Card.Body>
                <Card.Title className="fw-bold fs-3">
                  {item.name}
                  {item.quantity <= item.minimum && (
                    <span className="text-danger fw-semibold"> (Low)</span>
                  )}
                </Card.Title>
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
              <ButtonGroup>
                <Button variant="primary" onClick={() => handleExpand(item)}>
                  View
                </Button>
                <Button variant="success" onClick={() => handleTake(item)}>
                  Take
                </Button>
              </ButtonGroup>
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
        item={selectedItem}
        showExpandedView={showExpandedView}
        setShowExpandedView={setShowExpandedView}
      />

      <TakeModal
        item={selectedItem}
        showTakeModal={showTakeModal}
        setShowTakeModal={setShowTakeModal}
      />
    </>
  );
};

export default Inventory;
