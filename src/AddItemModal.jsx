import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { db } from "../firebaseConfig";
import { ref, set, onValue } from "firebase/database";
import toast from "react-hot-toast";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Dropdown from "react-bootstrap/Dropdown";

const AddItemModal = (props) => {
  const { showAddItemModal, setShowAddItemModal, addType } = props;

  const [newItem, setNewItem] = useState({});
  const [inventoryItems, setInventoryItems] = useState([]);

  let categories = ["Food", "Beverages", "Cleaning", "Health", "Electronics"];

  const handleClose = () => {
    setShowAddItemModal(false);
    setNewItem({});
  };

  const handleAdd = async () => {
    if (newItem.name) {
      if (addType === "inventory") {
        await set(ref(db, "inventory/" + newItem.name), {
          name: newItem.name,
          quantity: Number(newItem.quantity) || 0,
          location: newItem.location || "",
          category: newItem.category || "",
          timestamp: newItem.timestamp || "",
          store: newItem.store || "",
          expirationDate: newItem.expirationDate || "",
          minimum: newItem.minimum || 0,
          notes: newItem.notes || "",
        });
      } else if (addType === "shopping") {
        await set(ref(db, "shopping_items/" + newItem.name), {
          name: newItem.name,
          quantity: Number(newItem.quantity) || 0,
          store: newItem.store || "",
          description: newItem.description || "",
          completed: false,
        });
      }

      setNewItem({});
    }
    setShowAddItemModal(false);
    setTimeout(() => {
      toast.success(`Added ${newItem.name} to shopping list`);
    }, 100);
  };

  const handleChange = (e) => {
    setNewItem((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleDropdownClick = (dropdown, item) => {
    if (dropdown === "selectFromInventory") {
      setNewItem((prev) => ({
        ...prev,
        name: item.name,
        store: item.store,
      }));
    } else if (dropdown === "category") {
      setNewItem((prev) => ({
        ...prev,
        category: item,
      }));
    }
  };

  const fetchItems = () => {
    const itemsRef = ref(db, "inventory");
    onValue(itemsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const newItems = Object.values(data).map((item) => item);
        setInventoryItems(newItems);
      } else {
        setInventoryItems([]);
      }
    });
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <>
      <Modal show={showAddItemModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {addType === "shopping"
              ? "Add to shopping list"
              : "Add to inventory"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {addType === "shopping" && (
            <div>
              <Dropdown className="mb-3">
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                  Select from inventory
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  {inventoryItems.map((item, index) => (
                    <Dropdown.Item
                      key={item.name}
                      onClick={() =>
                        handleDropdownClick("selectFromInventory", item)
                      }
                    >
                      {item.name}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>

              <Form>
                <Form.Group md="4" className="d-flex gap-1 flex-column">
                  <InputGroup hasValidation>
                    <InputGroup.Text>Item Name</InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="name"
                      value={newItem.name}
                      onChange={handleChange}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Please type a name.
                    </Form.Control.Feedback>
                  </InputGroup>
                  <InputGroup>
                    <InputGroup.Text>Amount</InputGroup.Text>
                    <Form.Control
                      type="number"
                      name="quantity"
                      value={newItem.quantity}
                      onChange={handleChange}
                    />
                  </InputGroup>
                  <InputGroup>
                    <InputGroup.Text>Store</InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="store"
                      value={newItem.store}
                      onChange={handleChange}
                    />
                  </InputGroup>
                  <InputGroup>
                    <InputGroup.Text>Description</InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="description"
                      value={newItem.description}
                      onChange={handleChange}
                    />
                  </InputGroup>
                </Form.Group>
              </Form>
            </div>
          )}
          {addType === "inventory" && (
            <>
              <Form.Group md="4" className="d-flex gap-1 flex-column mb-4">
                <InputGroup hasValidation>
                  <InputGroup.Text>Item Name</InputGroup.Text>
                  <Form.Control
                    type="text"
                    name="name"
                    value={newItem.name}
                    onChange={handleChange}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please type a name.
                  </Form.Control.Feedback>
                </InputGroup>
                <InputGroup>
                  <InputGroup.Text>Amount</InputGroup.Text>
                  <Form.Control
                    type="number"
                    name="quantity"
                    value={newItem.quantity}
                    onChange={handleChange}
                  />
                </InputGroup>
                <InputGroup>
                  <InputGroup.Text>Location</InputGroup.Text>
                  <Form.Control
                    type="text"
                    name="location"
                    value={newItem.location}
                    onChange={handleChange}
                  />
                </InputGroup>
              </Form.Group>

              <h6 className="mb-1">Info</h6>
              <Form.Group md="4" className="d-flex gap-1 flex-column">
                <InputGroup>
                  <InputGroup.Text>Category</InputGroup.Text>
                  <Dropdown className="mb-3">
                    <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                      {newItem.category}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      {categories.map((category, index) => (
                        <Dropdown.Item
                          key={category}
                          onClick={() =>
                            handleDropdownClick("category", category)
                          }
                        >
                          {category}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </InputGroup>

                <InputGroup>
                  <InputGroup.Text>Last Bought</InputGroup.Text>
                  <Form.Control
                    type="text"
                    name="timestamp"
                    value={newItem.timestamp}
                    onChange={handleChange}
                  />
                </InputGroup>
                <InputGroup>
                  <InputGroup.Text>Store</InputGroup.Text>
                  <Form.Control
                    type="text"
                    name="store"
                    value={newItem.store}
                    onChange={handleChange}
                  />
                </InputGroup>
                <InputGroup>
                  <InputGroup.Text>Expiration Date</InputGroup.Text>
                  <Form.Control
                    type="text"
                    name="expirationDate"
                    value={newItem.expirationDate}
                    onChange={handleChange}
                  />
                </InputGroup>
                <InputGroup>
                  <InputGroup.Text>Minimum</InputGroup.Text>
                  <Form.Control
                    type="number"
                    name="minimum"
                    value={newItem.minimum}
                    onChange={handleChange}
                  />
                </InputGroup>
                <InputGroup>
                  <InputGroup.Text>Notes</InputGroup.Text>
                  <Form.Control
                    as="textarea"
                    type="text"
                    name="notes"
                    value={newItem.notes}
                    onChange={handleChange}
                  />
                </InputGroup>
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="success"
            onClick={handleAdd}
            disabled={!newItem.name}
          >
            Add Item
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

AddItemModal.propTypes = {
  showAddItemModal: PropTypes.bool.isRequired,
  setShowAddItemModal: PropTypes.func.isRequired,
  addType: PropTypes.string.isRequired,
};

export default AddItemModal;
