import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import moment from 'moment';

interface ContentListSale {
  id: number;
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

  useEffect(() => {
    const getData = async () => {
      const { data } = await axios.get("http://localhost:8080/sales");
      setSaleContent(data.content);
    }
    getData();
  }, []);

  const notify = async (id: number) => {
    try {
      await axios.get(`http://localhost:8080/sales/${id}/notification`);
      toast("SMS enviado com sucesso!");
    } catch (err) {
      console.log(err)
    }
  }

  const findSaleByDate = async () => {
    const { data } = await axios.get(`http://localhost:8080/sales?minDate=${minDate}&maxDate=${maxDate}`);
    setSaleContent(data.content);

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
            <th scope="col">Notificar</th>
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
                  className="btn btn-outline-danger"
                >
                  &rarr;
                </button>
              </td>
            </tr>
          ))}


        </tbody>
      </table>
      <ToastContainer />

    </div>
  )
}

export default App
