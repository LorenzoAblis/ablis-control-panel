import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { db } from "../firebaseConfig";
import { ref, set, remove } from "firebase/database";
import toast from "react-hot-toast";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

const EditItemModal = (props) => {
  const {
    item,
    editType,
    showEditItemModal,
    setShowEditItemModal,
    setShowExpandedView,
  } = props;

  const [edittedItem, setEdittedItem] = useState({ name: item.name });

  const handleClose = () => setShowEditItemModal(false);

  const handleEdit = async () => {
    if (item.name) {
      if (editType === "inventory") {
        await remove(ref(db, "inventory/" + item.name));
        await set(ref(db, "inventory/" + edittedItem.name), {
          name: edittedItem.name,
          quantity: Number(edittedItem.quantity) || 0,
          location: edittedItem.location || "",
          category: edittedItem.category || "",
          timestamp: edittedItem.timestamp || "",
          store: edittedItem.store || "",
          expirationDate: edittedItem.expirationDate || "",
          notes: edittedItem.notes || "",
        });
      } else if (editType === "shopping") {
        await remove(ref(db, "shopping_items/" + item.name));
        await set(ref(db, "shopping_items/" + edittedItem.name), {
          name: edittedItem.name,
          quantity: Number(edittedItem.quantity) || 0,
          store: edittedItem.store || "",
          description: edittedItem.description || "",
          completed: false,
        });
      }
    }

    setEdittedItem({});

    setTimeout(() => {
      toast.success(`Editted ${item.name}`);
    }, 100);
    setShowEditItemModal(false);
    setShowExpandedView(false);
  };

  const handleDelete = async () => {
    if (item.name) {
      if (editType === "inventory") {
        await remove(ref(db, "inventory/" + item.name));
      } else if (editType === "shopping") {
        await remove(ref(db, "shopping_items/" + item.name));
      }
    }

    toast.success(`Deleted ${item.name}`);
    setShowEditItemModal(false);
    setShowExpandedView(false);
  };

  const handleChange = (e) => {
    setEdittedItem((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  useEffect(() => {
    setEdittedItem(item);
  }, [item]);

  return (
    <>
      <Modal show={showEditItemModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className="fs-1">{item.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {editType === "shopping" && (
              <Form.Group md="4" className="d-flex gap-1 flex-column">
                <InputGroup hasValidation>
                  <InputGroup.Text>Item Name</InputGroup.Text>
                  <Form.Control
                    type="text"
                    name="name"
                    value={edittedItem.name}
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
                    value={edittedItem.quantity}
                    onChange={handleChange}
                  />
                </InputGroup>
                <InputGroup>
                  <InputGroup.Text>Store</InputGroup.Text>
                  <Form.Control
                    type="text"
                    name="store"
                    value={edittedItem.store}
                    onChange={handleChange}
                  />
                </InputGroup>
                <InputGroup>
                  <InputGroup.Text>Description</InputGroup.Text>
                  <Form.Control
                    type="text"
                    name="description"
                    value={edittedItem.description}
                    onChange={handleChange}
                  />
                </InputGroup>
              </Form.Group>
            )}
            {editType === "inventory" && (
              <>
                <Form.Group md="4" className="d-flex gap-1 flex-column mb-4">
                  <InputGroup hasValidation>
                    <InputGroup.Text>Item Name</InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="name"
                      value={edittedItem.name}
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
                      value={edittedItem.quantity}
                      onChange={handleChange}
                    />
                  </InputGroup>
                  <InputGroup>
                    <InputGroup.Text>Location</InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="location"
                      value={edittedItem.location}
                      onChange={handleChange}
                    />
                  </InputGroup>
                </Form.Group>

                <h6 className="mb-1">Info</h6>
                <Form.Group md="4" className="d-flex gap-1 flex-column">
                  <InputGroup>
                    <InputGroup.Text>Category</InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="category"
                      value={edittedItem.category}
                      onChange={handleChange}
                    />
                  </InputGroup>
                  <InputGroup>
                    <InputGroup.Text>Last Bought</InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="timestamp"
                      value={edittedItem.timestamp}
                      onChange={handleChange}
                    />
                  </InputGroup>
                  <InputGroup>
                    <InputGroup.Text>Store</InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="store"
                      value={edittedItem.store}
                      onChange={handleChange}
                    />
                  </InputGroup>
                  <InputGroup>
                    <InputGroup.Text>Expiration Date</InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="expirationDate"
                      value={edittedItem.expirationDate}
                      onChange={handleChange}
                    />
                  </InputGroup>
                  <InputGroup>
                    <InputGroup.Text>Notes</InputGroup.Text>
                    <Form.Control
                      as="textarea"
                      type="text"
                      name="notes"
                      value={edittedItem.notes}
                      onChange={handleChange}
                    />
                  </InputGroup>
                </Form.Group>
              </>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleDelete}>
            <i className="bi bi-trash"></i>
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={handleEdit}
            disabled={!edittedItem.name}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

EditItemModal.propTypes = {
  item: PropTypes.object.isRequired,
  editType: PropTypes.string.isRequired,
  showEditItemModal: PropTypes.bool.isRequired,
  setShowEditItemModal: PropTypes.func.isRequired,
  setShowExpandedView: PropTypes.func.isRequired,
};

export default EditItemModal;
