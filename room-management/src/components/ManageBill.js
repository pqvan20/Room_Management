import React, { useState, useEffect } from 'react';
import app from '../firebase_config';
import { getDatabase, ref, get, remove } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import ReactPaginate from 'react-paginate';
import { format, parseISO, isValid } from 'date-fns';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

const formatPhone = (phone) => {
  const parsedPhone = parsePhoneNumberFromString(phone, 'VN');
  return parsedPhone ? parsedPhone.formatInternational() : phone;
};

const formatDate = (date) => {
  return isValid(parseISO(date)) ? format(parseISO(date), 'dd-MM-yyyy') : date;
};

function ManageBill() {
  const navigate = useNavigate();
  const [billArray, setBillArray] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const db = getDatabase(app);
    const dbRef = ref(db, "bill");
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
      const myData = snapshot.val();
      const temporaryArray = Object.keys(myData).map(myFireId => {
        return {
          ...myData[myFireId],
          bill_id: myFireId
        };
      });
      setBillArray(temporaryArray);
    }
  };

  const deleteBill = async (bill_id) => {
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
    const dbRef = ref(db, "bill/" + bill_id);
    await remove(dbRef);

    // Cập nhật lại mảng billArray
    setBillArray(prevArray => prevArray.filter(item => item.bill_id !== bill_id));
    if (currentPage > 0 && currentPageData.length === 1) {
      setCurrentPage(currentPage - 1); // Lùi trang hiện tại nếu xóa bản ghi cuối cùng
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredBills = billArray.filter(item =>
    item.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const offset = currentPage * itemsPerPage;
  const currentPageData = filteredBills.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(filteredBills.length / itemsPerPage);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  return (
    <div>
      <div className="header">Danh Sách Hóa Đơn</div>
      <input className="search"
        type="text"
        placeholder="Tìm kiếm..."
        value={searchTerm}
        onChange={handleSearchChange}
      />
      <button className="writeBtn" onClick={() => navigate("/writeBill")}>Tạo hóa đơn</button>
      <button className="productBtn" onClick={() => navigate("/")}>Sản phẩm</button>

      <table>
        <thead>
          <tr>
            <th>Khách hàng</th>
            <th>Số đt</th>
            <th>Địa chỉ</th>
            <th>Ngày</th>
            <th>Trạng thái</th>
            <th>Ghi chú</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {currentPageData.map((item, index) => (
            <tr key={index}>
              <td>{item.customer_name}</td>
              <td>{formatPhone(item.phone)}</td>
              <td>{item.address}</td>
              <td>{formatDate(item.date)}</td>
              <td>{item.status ? 'Đã thanh toán' : 'Chưa thanh toán'}</td>
              <td>{item.note}</td>
              <td>
                <button className="productBillBtn" onClick={() => navigate(`/writeProductBill/${item.bill_id}`)}>Ghi</button>
                {/* productBillBtn leads to page using both product and bill data */}
                <button className="editBtn" onClick={() => navigate(`/editBill/${item.bill_id}`)}>Sửa</button>
                <button className="deleteBtn" onClick={() => deleteBill(item.bill_id)}>Xóa</button>
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

export default ManageBill;
