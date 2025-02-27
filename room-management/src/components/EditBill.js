import React, { useState, useEffect } from 'react';
import app from '../firebase_config';
import { getDatabase, ref, set, get } from 'firebase/database';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function EditBill() {
    const navigate = useNavigate();
    const { firebaseId } = useParams();

    let [inputValue1, setInputValue1] = useState("");
    let [inputValue2, setInputValue2] = useState("");
    let [inputValue3, setInputValue3] = useState("");
    let [inputValue4, setInputValue4] = useState(null);
    let [inputValue5, setInputValue5] = useState(false);
    let [inputValue6, setInputValue6] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            const db = getDatabase(app);
            const dbRef = ref(db, "bill/" + firebaseId);
            const snapshot = await get(dbRef);
            if (snapshot.exists()) {
                const targetObject = snapshot.val();
                setInputValue1(targetObject.customer_name);
                setInputValue2(targetObject.phone);
                setInputValue3(targetObject.address);
                setInputValue4(targetObject.date ? new Date(targetObject.date) : null); // Chuyển đổi thành đối tượng Date
                setInputValue5(targetObject.status);
                setInputValue6(targetObject.note);
            } else {
                alert("error");
            }
        };
        fetchData();
    }, [firebaseId]);

    const overwriteData = async () => {
        const db = getDatabase(app);
        const newDocRef = ref(db, "bill/" + firebaseId);
        set(newDocRef, {
            customer_name: inputValue1,
            phone: inputValue2,
            address: inputValue3,
            date: inputValue4 ? inputValue4.toISOString() : '',
            status: inputValue5, // Đảm bảo rằng trạng thái được lưu đúng cách
            note: inputValue6
        }).then(() => {
            Swal.fire({
                title: 'Cập nhật thành công!',
                icon: 'success',
                showConfirmButton: false, // Không hiển thị nút OK
                timer: 2000 // Đóng thông báo sau 3 giây
            });
            navigate("/manageBill");
        }).catch((error) => {
            alert("Lỗi: ", error.message);
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
            <div className="header">Sửa Hóa Đơn</div>
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
                <button className="editBtn" onClick={overwriteData}>Cập nhật</button>
            </div>
        </div>
    );
}

export default EditBill;
