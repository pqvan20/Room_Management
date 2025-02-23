import React, { useState } from 'react'
import app from '../firebase_config'
import { getDatabase, ref, get } from 'firebase/database'
import { useNavigate } from 'react-router-dom';

function Read() {

    const navigate = useNavigate();

    let [productArray, setproductArray] = useState([]);

    const fetchData = async () => {
        const db = getDatabase(app);
        const dbRef = ref(db, "product");
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
            setproductArray(Object.values(snapshot.val()));
        } else {
            alert("error");
        }
    }

    return (
        <div>
            <h1>Read</h1>
            <button onClick={fetchData}>Display Data</button>
            <table>
                <row>
                    <th>Tên sản phẩm</th>
                    <th>Đơn vị</th>
                    <th>Giá</th>
                    <th>Số lượng</th>
                    <th>Ghi chú</th>
                </row>
                {productArray.map((item, index) => (
                    <row>
                        <td key={index}>{item.product_name}</td>
                        <td key={index}>{item.unit}</td>
                        <td key={index}>{item.price}</td>
                        <td key={index}>{item.stock_quantity}</td>
                        <td key={index}>{item.note}</td>
                    </row>
                )
                )
                }
            </table>
            <button className='button1' onClick={() => navigate("/writeproduct")}>Thêm sản phẩm</button><br />
            <button className='button1' onClick={() => navigate("/editproduct")}>Sửa</button>
        </div>
    )
}

export default Read