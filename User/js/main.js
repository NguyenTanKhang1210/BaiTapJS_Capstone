const API_URL = "https://6728d9206d5fa4901b6b30f2.mockapi.io/Products";
let allProducts = [];
let cart = [];

// Lấy dữ liệu từ API
async function fetchProducts() {
  try {
    const response = await axios.get(API_URL);
    allProducts = response.data;
    renderProducts(allProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const goToAdminBtn = document.getElementById("go-to-admin");

  if (goToAdminBtn) {
    goToAdminBtn.addEventListener("click", () => {
      // Chuyển sang trang quản trị
      window.location.href = "../Admin/admin.html";
    });
  }
});

// Hiển thị danh sách sản phẩm
function renderProducts(products) {
  const productList = document.getElementById("product-list");
  productList.innerHTML = products
    .map(
      (product) => `
    <div class="product">
      <img src="${product.img}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>Price: ${product.price} USD</p>
      <button onclick="addToCart('${product.id}')">Thêm vào giỏ hàng</button>
    </div>
  `
    )
    .join("");
}

// Thêm vào giỏ hàng
function addToCart(productId) {
  const product = allProducts.find((p) => p.id === productId);
  if (!product) return;

  const existing = cart.find((item) => item.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCartToLocalStorage();
  renderCart();
}

// Tăng số lượng sản phẩm trong giỏ hàng
function increaseQuantity(productId) {
  const product = cart.find((item) => item.id === productId);
  if (product) {
    product.quantity += 1; // Tăng số lượng
  }
  saveCartToLocalStorage();
  renderCart();
}

// Giảm số lượng sản phẩm trong giỏ hàng
function decreaseQuantity(productId) {
  const product = cart.find((item) => item.id === productId);
  if (product && product.quantity > 1) {
    product.quantity -= 1; // Giảm số lượng nếu lớn hơn 1
  } else if (product && product.quantity === 1) {
    // Nếu số lượng là 1 thì xóa sản phẩm khỏi giỏ hàng
    removeFromCart(productId);
  }
  saveCartToLocalStorage();
  renderCart();
}

// Hiển thị giỏ hàng (Cập nhật giao diện với 2 nút tăng/giảm)
function renderCart() {
  const cartList = document.getElementById("cart-list");
  cartList.innerHTML = cart
    .map(
      (item) => `
    <tr>
      <td>${item.name}</td>
      <td>
        <button onclick="decreaseQuantity('${item.id}')">-</button>
        ${item.quantity}
        <button onclick="increaseQuantity('${item.id}')">+</button>
      </td>
      <td>${item.price * item.quantity} USD</td>
      <td><button onclick="removeFromCart('${item.id}')">Xóa</button></td>
    </tr>
  `
    )
    .join("");

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  document.getElementById("total").innerText = `Tổng tiền: ${total} USD`;
}

// Lưu giỏ hàng vào LocalStorage
function saveCartToLocalStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Xóa sản phẩm khỏi giỏ hàng
function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  saveCartToLocalStorage();
  renderCart();
}

// Tải giỏ hàng từ LocalStorage
function loadCartFromLocalStorage() {
  const savedCart = localStorage.getItem("cart");
  if (savedCart) {
    cart = JSON.parse(savedCart);
  }
  renderCart();
}
// Thanh toán và xóa giỏ hàng
function checkoutCart() {
  if (cart.length === 0) {
    alert("Giỏ hàng của bạn đang trống!");
    return;
  }

  // Hiển thị thông báo thanh toán thành công
  alert("Thanh toán thành công! Cảm ơn bạn đã mua hàng.");

  cart = [];

  // Lưu trạng thái giỏ hàng trống vào LocalStorage
  saveCartToLocalStorage();

  // Cập nhật giao diện giỏ hàng
  renderCart();
}

// Lọc sản phẩm
function filterProducts() {
  const filterValue = document.getElementById("filter").value;
  const filtered =
    filterValue === "all"
      ? allProducts
      : allProducts.filter((p) => p.type === filterValue);
  renderProducts(filtered);
}

// Khởi chạy
function init() {
  loadCartFromLocalStorage();
  fetchProducts();
}

init();
