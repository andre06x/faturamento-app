import { useEffect, useState } from 'react'
import moment from 'moment';
import axios from 'axios';

import { RiDeleteBin7Fill } from 'react-icons/ri';
import { MdLibraryAdd } from 'react-icons/md';
import { FaSms, FaEdit } from 'react-icons/fa';

import { ToastContainer, toast } from 'react-toastify';

import { ModalForm } from "./Components/Modal";

import 'react-toastify/dist/ReactToastify.css';
import './App.css'
import { api } from "./services/api";

export interface ContentListSale {
  id: any;
  sellerName: string;
  visited: number;
  deals: number;
  amount: number;
  date: string;
}

function App() {
  const [salesContent, setSaleContent] = useState<ContentListSale[]>([]);

  const [minDate, setMinDate] = useState("");
  const [maxDate, setMaxDate] = useState("");

  const [editSale, setEditSale] = useState(
    {id: null, sellerName: "", visited: 0, deals: 0, amount: 0, date: ""
  });

  const [show, setShow] = useState(false);

  const getData = async () => {
    const { data } = await api.get("/sales");
    setSaleContent(data.content);
  }

  useEffect(() => {
    getData();
  }, []);

  const notify = async (id: number) => {
    try {
      await api.get(`/sales/${id}/notification`);
      toast("SMS enviado com sucesso!");
    } catch (err) {
      console.log(err)
    }
  }

  const findSaleByDate = async () => {
    const { data } = await api.get(`/sales?minDate=${minDate}&maxDate=${maxDate}`);
    setSaleContent(data.content);
  };

  const deleteSale = async (id: number) => {
    const { data: message } = await api.delete(`/sales/${id}`);

    if (message === "Sale deleted") {
      toast("Venda deletada com sucesso!");
      setSaleContent(salesContent.filter(sale => sale.id !== id));
    }

  };

  const handleShow = () => setShow(true);

  const handleEditSale = (obj: ContentListSale) => {
    setShow(true);
    setEditSale(obj);
  };


  return (
    <div className="container mt-3 rounded p-3" style={{ backgroundColor: "#283142" }}>
      <h4 className="text-light text-center fw-bold">VENDAS</h4>

      <div className="d-flex justify-content-center align-items-center mb-3">
        <input
          className="my-2 form-control me-2"
          type="date"
          name=""
          id=""
          style={{ width: 180 }}
          onBlur={(e) => setMinDate(e.target.value)}
        />
        <input
          className="my-2 form-control me-4"
          type="date" name=""
          id=""
          style={{ width: 180 }}
          onBlur={(e) => setMaxDate(e.target.value)}
        />

        <button onClick={() => findSaleByDate()} type="button" className="btn btn-outline-primary">
          Buscar
        </button>

      </div>

      <table className="table table-dark">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Data</th>
            <th scope="col">Vendedor</th>
            <th scope="col">Visitas</th>
            <th scope="col">Vendas</th>
            <th scope="col">Total</th>
            <th scope="col"></th>
            <th scope="col"></th>
            <th scope="col"></th>
            <th scope="col">
              <button onClick={handleShow} className="btn" data-bs-toggle="modal" data-bs-target="#exampleModal">
                <MdLibraryAdd size={25} color="#fff" />
              </button>
            </th>

          </tr>
        </thead>
        <tbody>
          {salesContent.map(sale => (
            <tr key={sale.id}>
              <th scope="row">{sale.id}</th>
              <td>{moment(sale.date).format("DD/MM/YYYY")}</td>
              <td>{sale.sellerName}</td>
              <td>{sale.visited}</td>
              <td>{sale.deals}</td>
              <td>R$ {sale.amount}</td>
              <td>
                <button
                  onClick={() => notify(sale.id)}
                  type="button"
                  className="btn"
                >
                  <FaSms size={22} color="#fff" />
                </button>
              </td>

              <td>
                <button
                  onClick={() => handleEditSale(sale)}
                  type="button"
                  className="btn"
                >
                  <FaEdit size={22} color="#fff" />
                </button>
              </td>

              <td>
                <button
                  onClick={() => deleteSale(sale.id)}
                  type="button"
                  className="btn"
                >
                  <RiDeleteBin7Fill size={22} color="#fff" />
                </button>
              </td>

              <td>
              </td>
            </tr>
          ))}

        </tbody>
      </table>
      <ModalForm
        show={show}
        setShow={setShow} 
        getData={getData}
        editSale={editSale}
        setEditSale={setEditSale}
      />
      <ToastContainer />

    </div>
  )
}

export default App
