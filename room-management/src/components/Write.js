import React, {useState} from 'react'
import app from '../firebase_config'
import { getDatabase, ref, set, push } from 'firebase/database'
import { useNavigate } from 'react-router-dom';
function Write() {

    const navigate = useNavigate();

    let [inputValue1, setInputValue1] = useState("");
    let [inputValue2, setInputValue2] = useState("");
    let [inputValue3, setInputValue3] = useState("");
    let [inputValue4, setInputValue4] = useState("");
    let [inputValue5, setInputValue5] = useState("");


    const saveData = async () => {
        const db = getDatabase(app);
        const newDocRef = push(ref(db, "product"));
        set(newDocRef, {
            product_name: inputValue1,
            unit: inputValue2,
            price: inputValue3,
            stock_quantity: inputValue4,
            note: inputValue5
        }).then( () => {
            alert("Tạo Thành Công")
            navigate("/");
        }).catch((error) => {
            alert("error: ", error.message)
        })
    }

    return (
        <div>
            <h1>Write</h1>
            <input type="text"  value={inputValue1} placeholder='Tên sản phẩm'
            onChange={(e) => setInputValue1(e.target.value)}/><br/>
            <label htmlFor="unit">Chọn đơn vị: </label>
            <select id="unit" value={inputValue2} 
            onChange={(e) => setInputValue2(e.target.value)}>
                <option value="">--Choose a unit--</option>
                <option value="Cái">Cái</option>
                <option value="Mét">Mét</option>
                <option value="Cân">Cân</option>
            </select><br/>
            <input type="text" value={inputValue3} placeholder='Giá'
            onChange={(e) => setInputValue3(e.target.value)}/><br/>
            <input type="text" value={inputValue4} placeholder='Số lượng'
            onChange={(e) => setInputValue4(e.target.value)}/><br/>
            <input type="text" value={inputValue5} placeholder='Ghi chú'
            onChange={(e) => setInputValue5(e.target.value)}/><br/>
            <button onClick={saveData}>Lưu</button>
            <br/>
            <button className='button1' onClick={() => navigate("/")}>Quay lại</button><br/>
        </div>
    )
}

export default Write