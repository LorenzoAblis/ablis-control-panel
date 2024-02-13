import { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { ref, onValue } from "firebase/database";

import Card from "react-bootstrap/Card";
import ExpandedItemModal from "./ExpandedItem";

export const Inventory = () => {
  const [items, setItems] = useState([]);
  const [itemToExpand, setItemToExpand] = useState({});
  const [showExpandedView, setShowExpandedView] = useState(false);

  // TODO: Handle Expanded View

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
      <main className="d-flex flex-column gap-1">
        {items.map((item) => (
          <Card key={item.name} onClick={() => handleExpand(item)}>
            <Card.Body>
              <Card.Title>
                {item.name} ({item.quantity})
              </Card.Title>
              <Card.Subtitle>{item.location}</Card.Subtitle>
              <Card.Text>Exp: {item.expirationDate}</Card.Text>
            </Card.Body>
          </Card>
        ))}
      </main>

      <ExpandedItemModal
        item={itemToExpand}
        showExpandedView={showExpandedView}
        setShowExpandedView={setShowExpandedView}
      />
    </>
  );
};

export default Inventory;
