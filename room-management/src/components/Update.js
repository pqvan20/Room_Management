import React, { useState, useEffect } from 'react'
import app from '../firebase_config'
import { getDatabase, ref, set, get } from 'firebase/database'
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import toastr from 'toastr'
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
                setInputValue3(targetObject.price);
                setInputValue4(targetObject.stock_quantity);
                setInputValue5(targetObject.note);

            } else {
                alert("error");
            }
        }
        fetchData();
    }, [firebaseId])


    const overwriteData = async () => {
        const db = getDatabase(app);
        const newDocRef = ref(db, "product/" + firebaseId);
        set(newDocRef, {
            product_name: inputValue1,
            unit: inputValue2,
            price: inputValue3,
            stock_quantity: inputValue4,
            note: inputValue5,
        }).then(() => {
            // Swal.fire({
            //     title: 'V Product',
            //     text: 'Cập nhật thành công',
            //     icon: 'success',
            //     confirmButtonText: 'OK'
            // });

            toastr.success('Cập nhật thành công!');
            navigate("/");
        }).catch((error) => {
            alert("Lỗi: ", error.message)
        })

    }

    return (
        <div>
            <h1>Update</h1>
            <input type="text" value={inputValue1} placeholder='Tên sản phẩm'
                onChange={(e) => setInputValue1(e.target.value)} /><br />
            <label htmlFor="unit">Chọn đơn vị: </label>
            <select id="unit" value={inputValue2}
                onChange={(e) => setInputValue2(e.target.value)}>
                <option value="">--Choose a unit--</option>
                <option value="Cái">Cái</option>
                <option value="Mét">Mét</option>
                <option value="Cân">Cân</option>
            </select><br />
            <input type="text" value={inputValue3} placeholder='Giá'
                onChange={(e) => setInputValue3(e.target.value)} /><br />
            <input type="text" value={inputValue4} placeholder='Số lượng'
                onChange={(e) => setInputValue4(e.target.value)} /><br />
            <input type="text" value={inputValue5} placeholder='Ghi chú'
                onChange={(e) => setInputValue5(e.target.value)} /><br />
            <button onClick={overwriteData}>Update data</button>
            <br />
            <button className='button1' onClick={() => navigate("/")}>Quay lại</button><br />
        </div>
    )
}

export default Update