import React from 'react';
import axios from "axios";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { toast } from "react-toastify";
import { ContentListSale } from "../App";
import { api } from "../services/api";

interface PropsModalForm {
  show: boolean;
  setShow: Function;
  getData: Function;
  editSale: ContentListSale;
  setEditSale: Function
}
const ModalForm: React.FC<PropsModalForm> = ({
  show,
  setShow,
  getData,
  editSale,
  setEditSale
}) => {

  const handleClose = () => {
    setShow(false);
    setEditSale({ id: null, sellerName: "", visited: 0, deals: 0, amount: 0, date: "" });
  };

  const handleInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditSale({ ...editSale, [e.target.name]: e.target.value });
  }

  const insertSale = async () => {
    if (editSale.id !== null) {
      const data = await api.put(`/sales/${editSale.id}`, editSale);

      if (data.status === 200) {
        toast("Venda atualizada com sucesso!");
        getData();

      } else {
        toast.error("Erro ao criar venda");
      }
    }

    if (editSale.id === null) {
      const data = await api.post("/sales", editSale);

      if (data.status === 200) {
        toast("Venda criada com sucesso!");
        getData();
        setEditSale({ id: null, sellerName: "", visited: 0, deals: 0, amount: 0, date: "" });
      } else {
        toast.error("Erro ao criar venda");
      }
    }

  }

  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>Modal title</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <label className="form-label">Nome do vendedor:</label>
          <input
            name="sellerName"
            onChange={handleInputValue}
            value={editSale.sellerName}
            className="form-control"
            type="text"
          />
        </div>

        <div>
          <label className="form-label">N° de clientes visitados:</label>
          <input
            name="visited"
            onChange={handleInputValue}
            value={editSale.visited}
            className="form-control"
            type="text"
          />
        </div>

        <div>
          <label className="form-label">N° de vendas:</label>
          <input
            name="deals"
            onChange={handleInputValue}
            value={editSale.deals}
            className="form-control"
            type="text"
          />
        </div>

        <div>
          <label className="form-label">Total vendido:</label>
          <input
            name="amount"
            onChange={handleInputValue}
            value={editSale.amount}
            className="form-control"
            type="text"
          />
        </div>

        <div>
          <label className="form-label">Data:</label>
          <input
            name="date"
            onChange={handleInputValue}
            value={editSale.date}
            className="form-control"
            type="date" />
        </div>

      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          X
        </Button>
        <Button variant="primary" onClick={insertSale}>
          {editSale.id === null ? "Adicionar" : "Atualizar"}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export { ModalForm }