const API_URL = "https://6728d9206d5fa4901b6b30f2.mockapi.io/Products";
let products = [];

// Fetch danh sách sản phẩm
async function fetchProducts() {
  try {
    const res = await axios.get(API_URL);
    products = res.data;
    renderTable(products);
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}
document.addEventListener("DOMContentLoaded", () => {
  const goToUserBtn = document.getElementById("go-to-user");

  if (goToUserBtn) {
    goToUserBtn.addEventListener("click", () => {
      // Chuyển về trang người dùng
      window.location.href = "../User/index.html";
    });
  }
});

// Hiển thị danh sách sản phẩm
function renderTable(data) {
  const table = document.getElementById("product-table");
  table.innerHTML = data
    .map(
      (product, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${product.name}</td>
        <td>${product.price} USD</td>
        <td><img src="${product.img}" alt="${product.name}"></td>
        <td>${product.type}</td>
        <td>
          <button onclick="editProduct(${product.id})">Sửa</button>
          <button onclick="deleteProduct(${product.id})">Xóa</button>
        </td>
      </tr>`
    )
    .join("");
}

// Thêm/Cập nhật sản phẩm
document
  .getElementById("product-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.getElementById("product-id").value;
    const product = {
      name: document.getElementById("name").value.trim(),
      price: parseFloat(document.getElementById("price").value),
      img: document.getElementById("img").value.trim(),
      type: document.getElementById("type").value,
    };

    if (!product.name || !product.price || !product.img) {
      alert("Vui lòng nhập đầy đủ thông tin sản phẩm!");
      return;
    }

    try {
      if (id) {
        // Cập nhật
        await axios.put(`${API_URL}/${id}`, product);
      } else {
        // Thêm mới
        await axios.post(API_URL, product);
      }
      alert("Lưu thành công!");
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error("Error saving product:", error);
    }
  });

// Sửa sản phẩm
async function editProduct(id) {
  const product = products.find((p) => p.id == id);
  if (product) {
    document.getElementById("product-id").value = product.id;
    document.getElementById("name").value = product.name;
    document.getElementById("price").value = product.price;
    document.getElementById("img").value = product.img;
    document.getElementById("type").value = product.type;
  }
}

// Xóa sản phẩm
async function deleteProduct(id) {
  if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
    await axios.delete(`${API_URL}/${id}`);
    fetchProducts();
  }
}

// Tìm kiếm sản phẩm
document.getElementById("search").addEventListener("input", (e) => {
  const keyword = e.target.value.toLowerCase();
  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(keyword)
  );
  renderTable(filtered);
});

// Reset form
function resetForm() {
  document.getElementById("product-form").reset();
  document.getElementById("product-id").value = "";
}

// Khởi chạy
fetchProducts();
