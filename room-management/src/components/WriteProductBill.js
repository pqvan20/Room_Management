import React, { useState, useEffect } from 'react';
import app from '../firebase_config';
import { getDatabase, ref, get, push, set, remove } from 'firebase/database';
import { useNavigate, useParams } from 'react-router-dom';
import { format, parseISO, isValid } from 'date-fns';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import Select from 'react-select';
import Swal from 'sweetalert2';

function WriteProductBill() {

    const navigate = useNavigate();
    const { firebaseId } = useParams();
    let [bill, setBill] = useState(null);
    const [productBills, setProductBills] = useState([]);

    useEffect(() => {
        fetchData();
        fetchData2();
        fetchData3();
    }, []);

    const fetchData = async () => {
        const db = getDatabase(app);
        const dbRef = ref(db, `bill/${firebaseId}`);
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
            setBill(snapshot.val());
        } else {
            alert("Error: No data found");
        }
    }

    const formatPhone = (phone) => {
        const parsedPhone = parsePhoneNumberFromString(phone, 'VN');
        return parsedPhone ? parsedPhone.formatInternational() : phone;
    };

    const formatDate = (date) => {
        return isValid(parseISO(date)) ? format(parseISO(date), 'dd-MM-yyyy') : date;
    };

    let [productArray, setProductArray] = useState([]);
    let [selectedProduct, setSelectedProduct] = useState(null);
    let [quantity, setQuantity] = useState('');
    let [discountPercentage, setDiscountPercentage] = useState('');

    const fetchData2 = async () => {
        const db = getDatabase(app);
        const dbRef = ref(db, "product");
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
            const myData = snapshot.val();
            const temporaryArray = Object.keys(myData).map(myFireId => {
                return {
                    value: myFireId,
                    label: myData[myFireId].product_name + " - " + formatNumber(myData[myFireId].price),
                    unit: myData[myFireId].unit,
                    price: myData[myFireId].price,
                    ...myData[myFireId]
                }
            });
            console.log(temporaryArray); // <-- Add this to check the data
            setProductArray(temporaryArray);
        } else {
            console.log("No product data found"); // <-- Add this to debug
        }
    };

    const handleProductChange = (selectedOption) => {
        setSelectedProduct(selectedOption);
    };

    const handleQuantityChange = (event) => {
        setQuantity(event.target.value);
    };

    const handleDiscountPercentageChange = (event) => {
        setDiscountPercentage(event.target.value);
    };

    const saveData = async () => {
        if (!selectedProduct) {
            alert("Please select a product.");
            return;
        }

        const db = getDatabase(app);
        const newDocRef = push(ref(db, "product_bill"));
        const parsedQuantity = quantity ? parseInt(quantity, 10) : 0;
        const parsedDiscountPercentage = discountPercentage ? parseFloat(discountPercentage) : 0;
        const finalPrice = selectedProduct.price * parsedQuantity - (selectedProduct.price * parsedQuantity * parsedDiscountPercentage / 100);
        const newProductBill = {
            product_id: selectedProduct.value,
            bill_id: firebaseId,
            product_name: selectedProduct.product_name,
            unit: selectedProduct.unit,
            price: selectedProduct.price,
            quantity: parsedQuantity,
            discount_percentage: parsedDiscountPercentage,
            final_price: finalPrice
        };

        try {
            await set(newDocRef, newProductBill);
            // Update state directly
            setProductBills(prevBills => [...prevBills, { ...newProductBill, id: newDocRef.key }]);
            setSelectedProduct(null);
            setQuantity('');
            setDiscountPercentage('');
        } catch (error) {
            alert("error: " + error.message);
        }
    };

    const fetchData3 = async () => {
        const db = getDatabase(app);
        const dbRef = ref(db, "product_bill");
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
            const myData = snapshot.val();
            const filteredArray = Object.keys(myData).map(myFireId => {
                return {
                    id: myFireId,
                    ...myData[myFireId]
                }
            }).filter(bill => bill.bill_id === firebaseId); // Explicitly filtering by bill_id
            console.log(filteredArray); // Debug: Verify filtered array
            setProductBills(filteredArray);
        } else {
            console.log("No product bills found");
        }
    };

    const formatNumber = (number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(number);
    };

    const deleteProductBill = async (product_bill_id) => {
        const result = await Swal.fire({
            title: 'Bạn có chắc chắn?',
            text: "Bạn sẽ không thể khôi phục hành động này!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'Hủy',
            confirmButtonText: 'Xóa nó!'
        });

        if (!result.isConfirmed) {
            return; // Người dùng không xác nhận xóa, kết thúc hàm
        }

        const db = getDatabase(app);
        const dbRef = ref(db, "product_bill/" + product_bill_id);
        await remove(dbRef);

        // Cập nhật danh sách productBills mà không cần tải lại trang
        setProductBills(prevProductBills => prevProductBills.filter(product_bill => product_bill.id !== product_bill_id));
        // Để là bill cũng đc cơ ảo thật
    };

    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            borderColor: 'black',
            borderWidth: '2px',
            borderRadius: '0px',
            '&:hover': {
                borderColor: 'black'
            }
        })
    };

    return (
        <div>
            {bill ? (
                <table>
                    <thead>
                        <tr>
                            <th>Khách hàng</th>
                            <th>Số đt</th>
                            <th>Địa chỉ</th>
                            <th>Ngày</th>
                            <th>Trạng thái</th>
                            <th>Ghi chú</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{bill.customer_name}</td>
                            <td>{formatPhone(bill.phone)}</td>
                            <td>{bill.address}</td>
                            <td>{formatDate(bill.date)}</td>
                            <td>{bill.status ? 'Đã thanh toán' : 'Chưa thanh toán'}</td>
                            <td>{bill.note}</td>
                        </tr>
                    </tbody>
                </table>
            ) : (
                <p>Đang tải...</p>
            )}

            <div>
                <Select
                    options={productArray}
                    onChange={handleProductChange}
                    placeholder="Chọn sản phẩm..."
                    className='productSelect'
                    styles={customStyles}
                />
                <input
                    type="number"
                    placeholder="Số lượng"
                    value={quantity}
                    onChange={handleQuantityChange}
                    className='qualityInput'
                />
                <input
                    type="number"
                    placeholder="Phần trăm giảm giá"
                    value={discountPercentage}
                    onChange={handleDiscountPercentageChange}
                    className="discountInput"
                />
                <button onClick={saveData}>Thêm sản phẩm</button>
            </div>

            {productBills.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            {/* <th>Mã hóa đơn</th>
                            <th>Mã sản phẩm</th> */}
                            <th>Sản phẩm</th>
                            <th>Đơn vị</th>
                            <th>Giá</th>
                            <th>Sl</th>
                            <th>Ck(%)</th>
                            <th>Thành tiền</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productBills.map(product_bill => (
                            <tr key={product_bill.id}>
                                <td>{product_bill.product_name}</td>
                                <td>{product_bill.unit}</td>
                                <td>{formatNumber(product_bill.price)}</td>
                                <td>{product_bill.quantity}</td>
                                <td>{product_bill.discount_percentage}</td>
                                <td style={{ position: 'relative' }}>
                                    {formatNumber(product_bill.final_price)}
                                    <button
                                        className="remove_product_bill_btn"
                                        onClick={() => deleteProductBill(product_bill.id)}
                                    >
                                        &times;
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>Đang tải...</p>
            )}

        </div>
    )
}

export default WriteProductBill;
