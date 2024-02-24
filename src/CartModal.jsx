import { useState } from "react";
import PropTypes from "prop-types";
import { db } from "../firebaseConfig";
import { ref, set } from "firebase/database";

import Button from "react-bootstrap/Button";
import EditItemModal from "./EditItemModal";
import CheckoutConfirmationModal from "./CheckoutConfirmationModal";
import Modal from "react-bootstrap/Modal";

const CartModal = (props) => {
  const { items, showCartModal, setShowCartModal } = props;

  const [showEditItemModal, setShowEditItemModal] = useState(false);
  const [showCheckoutConfirmationModal, setShowCheckoutConfirmationModal] =
    useState(false);

  const [itemToEdit, setItemToEdit] = useState({});

  const handleClose = () => {
    setShowCartModal(false);
  };

  const handleEdit = (item) => {
    setShowEditItemModal(true);
    setItemToEdit(item);
  };

  const handleConfirmation = () => {
    setShowCheckoutConfirmationModal(true);
    setShowCartModal(false);
  };

  const handleUncomplete = async (item) => {
    await set(ref(db, "shopping_items/" + item.name), {
      name: item.name,
      quantity: item.quantity,
      store: item.store,
      description: item.description,
      completed: false,
    });
  };

  return (
    <>
      <Modal show={showCartModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Cart</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {items.filter((item) => item.completed).length == 0 && (
            <div className="d-flex justify-content-center">
              <h4 className="text-secondary">No items in cart</h4>
            </div>
          )}
          {items
            .filter((item) => item.completed)
            .map((item, index) => (
              <div className="d-flex gap-2 p-1" key={item.name}>
                <h2 className="fw-bold">{item.name}</h2>
                <Button
                  variant="secondary"
                  onClick={() => handleUncomplete(item)}
                >
                  <i className="bi bi-arrow-counterclockwise"></i>
                </Button>
                <Button variant="success" onClick={() => handleEdit(item)}>
                  <i className="bi bi-pencil-square"></i>
                </Button>
              </div>
            ))}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleConfirmation}>Checkout</Button>
        </Modal.Footer>
      </Modal>

      <EditItemModal
        item={itemToEdit}
        editType="shopping"
        showEditItemModal={showEditItemModal}
        setShowEditItemModal={setShowEditItemModal}
      />

      <CheckoutConfirmationModal
        items={items}
        showCheckoutConfirmationModal={showCheckoutConfirmationModal}
        setShowCheckoutConfirmationModal={setShowCheckoutConfirmationModal}
      />
    </>
  );
};

CartModal.propTypes = {
  items: PropTypes.array.isRequired,
  showCartModal: PropTypes.bool.isRequired,
  setShowCartModal: PropTypes.func.isRequired,
};

export default CartModal;
