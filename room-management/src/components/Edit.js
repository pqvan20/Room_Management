import React, { useState, useEffect } from 'react'
import app from '../firebase_config'
import { getDatabase, ref, get, remove } from 'firebase/database'
import { useNavigate } from 'react-router-dom';

function Edit() {

    const navigate = useNavigate();
    let [productArray, setProductArray] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const db = getDatabase(app);
        const dbRef = ref(db, "product");
        const snapshot = await get(dbRef);
        if(snapshot.exists()) {
            const myData = snapshot.val();
            const temporaryArray = Object.keys(myData).map(myFireId => {
                return {
                    ...myData[myFireId],
                    product_id: myFireId
                }
            });
            setProductArray(temporaryArray);
        }
    }

    const deleteProduct = async (product_id) => {
        const db = getDatabase(app);
        const dbRef = ref(db, "product/" + product_id);
        await remove(dbRef);
        fetchData();  // Lấy lại danh sách sau khi xoá
    }

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredProducts = productArray.filter(item =>
        item.product_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <span>Danh sách sản phẩm</span>
            <button class="btn btn-primary" onClick={() => navigate("/writeProduct")}>Tạo Nhà</button><br />
            <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearchChange}
            />
            <table>
                <thead>
                    <tr>
                        <th>Tên sản phẩm</th>
                        <th>Đơn vị</th>
                        <th>Giá</th>
                        <th>Số lượng</th>
                        <th>Ghi chú</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody> 
                    {filteredProducts.map((item, index) => (
                        <tr key={index}>
                            <td>{item.product_name}</td>
                            <td>{item.unit}</td>
                            <td>{item.price}</td>
                            <td>{item.stock_quantity}</td>
                            <td>{item.note}</td>
                            <td>
                                <button className="button1" onClick={() => navigate(`/updateProduct/${item.product_id}`)}>UPDATE</button>
                                <button className="button1" onClick={() => deleteProduct(item.product_id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Edit
