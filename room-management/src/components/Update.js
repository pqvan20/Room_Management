import React, { useState, useEffect } from 'react';
import app from '../firebase_config';
import { getDatabase, ref, set, get } from 'firebase/database';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';

function Update() {
    const navigate = useNavigate();
    const { firebaseId } = useParams();

    let [inputValue1, setInputValue1] = useState("");
    let [inputValue2, setInputValue2] = useState("");
    let [inputValue3, setInputValue3] = useState("");
    let [inputValue4, setInputValue4] = useState("");
    let [inputValue5, setInputValue5] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            const db = getDatabase(app);
            const dbRef = ref(db, "product/" + firebaseId);
            const snapshot = await get(dbRef);
            if (snapshot.exists()) {
                const targetObject = snapshot.val();
                setInputValue1(targetObject.product_name);
                setInputValue2(targetObject.unit);
                setInputValue3(targetObject.price.toString());
                setInputValue4(targetObject.stock_quantity.toString());
                setInputValue5(targetObject.note);
            } else {
                alert("error");
            }
        };
        fetchData();
    }, [firebaseId]);

    const overwriteData = async () => {
        const db = getDatabase(app);
        const newDocRef = ref(db, "product/" + firebaseId);
        set(newDocRef, {
            product_name: inputValue1,
            unit: inputValue2,
            price: inputValue3 ? parseInt(inputValue3.replace(/[^0-9]/g, ''), 10) : 0,
            stock_quantity: inputValue4 ? parseInt(inputValue4.replace(/[^0-9]/g, ''), 10) : 0,
            note: inputValue5,
        }).then(() => {
            Swal.fire({
                title: 'Cập nhật thành công!',
                icon: 'success',
                showConfirmButton: false, // Không hiển thị nút OK
                timer: 2000 // Đóng thông báo sau 3 giây
            });
            navigate("/");
        }).catch((error) => {
            alert("Lỗi: ", error.message);
        });
    };

    const formatNumber = (number) => {
        return new Intl.NumberFormat('vi-VN').format(number);
    };

    const handleInputChange = (event, setter) => {
        const value = event.target.value.replace(/[^0-9]/g, '');
        setter(value);
    };

    return (
        <div class="inputBox">
            <div class="header">Sửa sản phẩm</div>
            <input
                type="text"
                value={inputValue1}
                placeholder='Tên sản phẩm'
                onChange={(e) => setInputValue1(e.target.value)}
            />
            <select
                id="unit"
                value={inputValue2}
                placeholder="Chọn đơn vị"
                onChange={(e) => setInputValue2(e.target.value)}
            >
                <option value="">Chọn đơn vị</option>
                <option value="Cái">Cái</option>
                <option value="Mét">Mét</option>
                <option value="Cân">Cân</option>
                <option value="Cuộn">Cuộn</option>
                <option value="Tuýp">Tuýp</option>
                <option value="Lọ">Lọ</option>
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
                <button class="editBtn" onClick={overwriteData}>Cập nhật</button>
            </div>
        </div>

    );
}

export default Update;
