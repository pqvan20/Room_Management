import React, { useState } from 'react';
import app from '../firebase_config';
import { getDatabase, ref, set, push } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import 'toastr/build/toastr.min.css';
import Swal from 'sweetalert2';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function WriteBill() {
    const navigate = useNavigate();

    let [inputValue1, setInputValue1] = useState("");
    let [inputValue2, setInputValue2] = useState("");
    let [inputValue3, setInputValue3] = useState("");
    let [inputValue4, setInputValue4] = useState(null);
    let [inputValue5, setInputValue5] = useState(false);  // Thay đổi kiểu dữ liệu thành boolean
    let [inputValue6, setInputValue6] = useState("");

    const saveData = async () => {
        const db = getDatabase(app);
        const newDocRef = push(ref(db, "bill"));
        set(newDocRef, {
            customer_name: inputValue1,
            phone: inputValue2,
            address: inputValue3,
            date: inputValue4 ? inputValue4.toISOString() : '',
            status: inputValue5,  // Đảm bảo rằng trạng thái được lưu đúng cách
            note: inputValue6
        }).then(() => {
            Swal.fire({
                title: 'Tạo thành công!',
                icon: 'success',
                showConfirmButton: false,
                timer: 2000
            });
            navigate("/manageBill");
        }).catch((error) => {
            alert("error: ", error.message);
        });
    };

    const handleDateChange = (date) => {
        setInputValue4(date);
    };

    const toggleStatus = () => {
        setInputValue5(prevStatus => !prevStatus);
    };

    return (
        <div className="inputBox">
            <div className="header">Tạo Hóa Đơn</div>
            <input
                type="text"
                value={inputValue1}
                placeholder="Tên khách hàng"
                onChange={(e) => setInputValue1(e.target.value)}
            />
            <input
                type="text"
                value={parsePhoneNumberFromString(inputValue2, 'VN') ? parsePhoneNumberFromString(inputValue2, 'VN').formatInternational() : inputValue2}
                placeholder="Điện thoại"
                onChange={(e) => setInputValue2(e.target.value)}
            />
            <input
                type="text"
                value={inputValue3}
                placeholder="Địa chỉ"
                onChange={(e) => setInputValue3(e.target.value)}
            />
            <input
                type="text"
                value={inputValue6}
                placeholder="Ghi chú"
                onChange={(e) => setInputValue6(e.target.value)}
            />
            <DatePicker
                selected={inputValue4}
                onChange={handleDateChange}
                dateFormat="dd-MM-yyyy"
                placeholderText="Ngày"
                popperPlacement="top-start"
                className="custom-datepicker"
            />
            <div className="statusBtn">
                <button onClick={toggleStatus}>Đổi trạng thái</button>
                <span> {inputValue5 ? 'Đã thanh toán' : 'Chưa thanh toán'}</span>
            </div>
            <div className="twoBtn">
                <button onClick={() => navigate("/manageBill")}>Quay lại</button>
                <button className="writeBtn" onClick={saveData}>Lưu</button>
            </div>
        </div>
    );
}

export default WriteBill;
