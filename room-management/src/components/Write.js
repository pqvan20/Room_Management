import React, { useState } from 'react'
import app from '../firebase_config'
import { getDatabase, ref, set, push } from 'firebase/database'
import { useNavigate } from 'react-router-dom';
import 'toastr/build/toastr.min.css';
import Swal from 'sweetalert2';


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
            price: inputValue3 ? parseInt(inputValue3.replace(/[^0-9]/g, ''), 10) : 0,
            stock_quantity: inputValue4 ? parseInt(inputValue4.replace(/[^0-9]/g, ''), 10) : 0,
            note: inputValue5
        }).then(() => {
            // toastr.success('Cập nhật thành công!');
            Swal.fire({
                title: 'Tạo thành công!',
                icon: 'success',
                showConfirmButton: false, // Không hiển thị nút OK
                timer: 2000 // Đóng thông báo sau 3 giây
              });              
            navigate("/");
        }).catch((error) => {
            alert("error: ", error.message);
        });
    }

    const formatNumber = (number) => {
        return new Intl.NumberFormat('vi-VN').format(number);
    };

    const handleInputChange = (event, setter) => {
        const value = event.target.value.replace(/[^0-9]/g, '');
        setter(value);
    };

    return (
        <div class="inputBox">
            <div class="header">Tạo sản phẩm</div>
            <input
                type="text"
                value={inputValue1}
                placeholder='Tên sản phẩm'
                onChange={(e) => setInputValue1(e.target.value)}
            />
            <select
                id="unit"
                value={inputValue2}
                onChange={(e) => setInputValue2(e.target.value)}
            >
                <option value="">Chọn đơn vị</option>
                <option value="Cái">Cái</option>
                <option value="Mét">Mét</option>
                <option value="Cân">Cân</option>
                <option value="Cuộn">Cuộn</option>
                <option value="Tuýp">Tuýp</option>
                <option value="Tuýp">Lọ</option>
            </select>
            <input
                type="text"
                value={inputValue3 ? formatNumber(inputValue3) : ''}
                placeholder='Giá'
                onChange={(e) => handleInputChange(e, setInputValue3)}
            />
            <input
                type="text"
                value={inputValue4 ? formatNumber(inputValue4) : ''}
                placeholder='Số lượng'
                onChange={(e) => handleInputChange(e, setInputValue4)}
            />
            <input
                type="text"
                value={inputValue5}
                placeholder='Ghi chú'
                onChange={(e) => setInputValue5(e.target.value)}
            />
            <div class="twoBtn">
                <button onClick={() => navigate("/")}>Quay lại</button>
                <button className='writeBtn' onClick={saveData}>Lưu</button>
            </div>
        </div>
    );
}

export default Write;
