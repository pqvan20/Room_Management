import React, { useState, useEffect } from 'react'
import app from '../firebase_config'
import { getDatabase, ref, get, remove } from 'firebase/database'
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import ReactPaginate from 'react-paginate';

function Edit() {

    const navigate = useNavigate();
    let [productArray, setProductArray] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 5;

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const db = getDatabase(app);
        const dbRef = ref(db, "product");
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
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
        const dbRef = ref(db, "product/" + product_id);
        await remove(dbRef);
        fetchData();
    }

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredProducts = productArray.filter(item =>
        item.product_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const offset = currentPage * itemsPerPage;
    const currentPageData = filteredProducts.slice(offset, offset + itemsPerPage);
    const pageCount = Math.ceil(filteredProducts.length / itemsPerPage);

    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
    };

    const formatNumber = (number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(number);
    };

    return (
        <div>
            <div className="header">Danh sách sản phẩm</div>
            <input className="search"
                type="text"
                placeholder="Tìm kiếm..."
                value={searchTerm}
                onChange={handleSearchChange}
            />
            <button className="writeBtn" onClick={() => navigate("/writeProduct")}>Tạo sản phẩm</button><br />

            <table>
                <thead>
                    <tr>
                        <th>Tên sản phẩm</th>
                        <th>Đơn vị</th>
                        <th>Giá</th>
                        <th>Số lượng</th>
                        <th>Ghi chú</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {currentPageData.map((item, index) => (
                        <tr key={index}>
                            <td>{item.product_name}</td>
                            <td>{item.unit}</td>
                            <td>{formatNumber(item.price)}</td>
                            <td>{item.stock_quantity}</td>
                            <td>{item.note}</td>
                            <td>
                                <button className="editBtn" onClick={() => navigate(`/updateProduct/${item.product_id}`)}>Sửa</button>
                                <button className="deleteBtn" onClick={() => deleteProduct(item.product_id)}>Xóa</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <ReactPaginate
                previousLabel={"← Previous"}
                nextLabel={"Next →"}
                pageCount={pageCount}
                onPageChange={handlePageClick}
                containerClassName={"pagination"}
                previousLinkClassName={"pagination__link"}
                nextLinkClassName={"pagination__link"}
                disabledClassName={"pagination__link--disabled"}
                activeClassName={"pagination__link--active"}
            />
        </div>
    );
}

export default Edit;
