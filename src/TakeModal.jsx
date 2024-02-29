import { useState } from "react";
import PropTypes from "prop-types";
import { db } from "../firebaseConfig";
import { ref, remove, set, get } from "firebase/database";
import toast from "react-hot-toast";

import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";

const TakeModal = (props) => {
  const { item, showTakeModal, setShowTakeModal } = props;

  const [amountToTake, setAmountToTake] = useState(1);

  const handleClose = () => {
    setShowTakeModal(false);
  };

  const handleConfirmation = () => {
    const newQuantity = item.quantity - amountToTake;
    if (newQuantity >= 0) {
      set(ref(db, "inventory/" + item.name), {
        ...item,
        quantity: newQuantity,
      });
      setShowTakeModal(false);
      toast.success(`${amountToTake} ${item.name} taken from inventory`);
    } else {
      toast.error("Not enough items in inventory");
    }
  };

  return (
    <>
      <Modal show={showTakeModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Take {item.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5 className="w-100 text-center mb-3">In stock: {item.quantity}</h5>
          <InputGroup className="w-50 mx-auto">
            <Button
              variant="danger"
              onClick={() => setAmountToTake(amountToTake - 1)}
            >
              -
            </Button>
            <Form.Control
              type="number"
              name="amountToTake"
              value={amountToTake}
              className="text-center"
            />
            <Button
              variant="success"
              onClick={() => setAmountToTake(amountToTake + 1)}
            >
              +
            </Button>
          </InputGroup>
          <Button
            className="mt-3 w-100"
            variant="primary"
            onClick={handleConfirmation}
          >
            Confirm
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
};

TakeModal.propTypes = {
  item: PropTypes.array.isRequired,
  showTakeModal: PropTypes.bool.isRequired,
  setShowTakeModal: PropTypes.func.isRequired,
};

export default TakeModal;
