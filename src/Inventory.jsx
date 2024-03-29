import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebaseConfig";
import { ref, onValue } from "firebase/database";

import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Dropdown from "react-bootstrap/Dropdown";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [filterQuery, setFilterQuery] = useState("name");
  const [addType, setAddType] = useState("");

  let filters = ["name", "store", "category", "location"];

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

  const handleInventoryAdd = () => {
    setShowAddItemModal(true);
    setAddType("inventory");
  };

  const handleShoppingAdd = () => {
    setShowAddItemModal(true);
    setAddType("shopping");
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
        <div className="mb-2">
          <Button
            variant="success"
            onClick={handleInventoryAdd}
            style={{ marginRight: "0.5rem" }}
          >
            <i className="bi bi-plus-lg"></i>
          </Button>
          <Button
            variant="primary"
            onClick={handleShoppingAdd}
            style={{ marginRight: "0.5rem" }}
          >
            <i className="bi bi-cart-plus-fill"></i>
          </Button>
          <Button variant="secondary" onClick={() => navigate("/shopping")}>
            <i className="bi bi-basket-fill"></i>
          </Button>
        </div>
        <section className="d-flex flex-column gap-2">
          <InputGroup>
            <Form.Control
              type="text"
              name="search"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Dropdown className="mb-3">
              <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                <i className="bi bi-funnel-fill"></i>
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {filters.map((filter) => (
                  <Dropdown.Item
                    key={filter}
                    active={filterQuery === filter}
                    onClick={() => setFilterQuery(filter)}
                  >
                    {filter}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </InputGroup>
          {items
            .filter((item) =>
              searchQuery
                ? item[filterQuery]
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
                : true,
            )

            .map((item) => (
              <Card key={item.name} className="shadow mb-2 p-1">
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
                    Qty:{" "}
                    <span className="fw-semibold">{item.quantity || 0}</span>
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
        addType={addType}
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
