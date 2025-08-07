import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ProductForm from "../components/product/ProductForm";
import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  AlertCircle,
} from "lucide-react";
import { formatCurrency, formatDate } from "../utils";
import { useAuth } from "../contexts/AuthContext";
import { productService, type Product } from "../services/productService";
import { orderService, type Order } from "../services/orderService";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";

const Admin: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "products" | "orders" | "customers"
  >("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [showProductForm, setShowProductForm] = useState(false);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      // Fetch all data in parallel
      const [productsRes, ordersRes, statsRes] = await Promise.all([
        productService.getProducts({
          // Add any filters you want here
          limit: 50, // Adjust this based on your needs
        }),
        orderService.getUserOrders(),
        orderService.getStats(),
      ]);

      if (!productsRes.success || !ordersRes.success || !statsRes.success) {
        throw new Error("Failed to fetch data");
      }

      setProducts(productsRes.data);
      setOrders(ordersRes.data);
      setStats(statsRes.data);
    } catch (err: any) {
      setError(err.message || "Failed to load data");
      console.error("Error loading admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Redirect if not admin
  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600">
            You don't have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-luxury-gold border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  const dashboardStats = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Total Customers",
      value: stats.totalCustomers,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Revenue",
      value: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      color: "text-luxury-gold",
      bgColor: "bg-yellow-100",
    },
  ];

  const filteredProducts = products.filter(
    (product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.category &&
        typeof product.category === "object" &&
        "name" in product.category &&
        product.category.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Orders */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4">Recent Orders</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Order ID
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Customer
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Total
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Status
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              // Replace the mockOrders.map section with:
              {orders.slice(0, 5).map((order) => (
                <tr
                  key={order._id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-4 font-medium">{order.orderNumber}</td>
                  <td className="py-3 px-4">{order.customer.name}</td>
                  <td className="py-3 px-4">{formatCurrency(order.total)}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {formatDate(order.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await productService.deleteProduct(id);
        setProducts(products.filter((p) => p._id !== id));
      } catch (err: any) {
        setError(err.message || "Failed to delete product");
      }
    }
  };

  const renderProducts = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="font-serif text-2xl font-bold">Products Management</h2>
        <Button onClick={() => setShowProductForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>

        {/* Product Form Modal */}
        {showProductForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6"
            >
              <h2 className="font-serif text-2xl font-bold mb-6">
                Add New Product
              </h2>
              <ProductForm
                onSuccess={() => {
                  setShowProductForm(false);
                  loadData(); // Refresh the products list
                }}
                onCancel={() => setShowProductForm(false)}
              />
            </motion.div>
          </div>
        )}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Products Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 font-medium text-gray-600">
                  Product
                </th>
                <th className="text-left py-4 px-6 font-medium text-gray-600">
                  Category
                </th>
                <th className="text-left py-4 px-6 font-medium text-gray-600">
                  Price
                </th>
                <th className="text-left py-4 px-6 font-medium text-gray-600">
                  Stock
                </th>
                <th className="text-left py-4 px-6 font-medium text-gray-600">
                  Status
                </th>
                <th className="text-left py-4 px-6 font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr
                  key={product._id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-900">
                          {product.title}
                        </p>
                        <p className="text-sm text-gray-600">{product.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 capitalize">
                    {product.category &&
                    typeof product.category === "object" &&
                    "name" in product.category
                      ? product.category.name
                      : "Uncategorized"}
                  </td>
                  <td className="py-4 px-6 font-medium">
                    {formatCurrency(product.price)}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.inStock > 10
                          ? "bg-green-100 text-green-800"
                          : product.inStock > 0
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {product.inStock} units
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.featured
                          ? "bg-luxury-gold text-luxury-black"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {product.featured ? "Featured" : "Regular"}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-600 hover:text-luxury-gold transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product._id)}
                        className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div> 
      </Card>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-6">
      <h2 className="font-serif text-2xl font-bold">Orders Management</h2>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 font-medium text-gray-600">
                  Order ID
                </th>
                <th className="text-left py-4 px-6 font-medium text-gray-600">
                  Customer
                </th>
                <th className="text-left py-4 px-6 font-medium text-gray-600">
                  Items
                </th>
                <th className="text-left py-4 px-6 font-medium text-gray-600">
                  Total
                </th>
                <th className="text-left py-4 px-6 font-medium text-gray-600">
                  Status
                </th>
                <th className="text-left py-4 px-6 font-medium text-gray-600">
                  Date
                </th>
                <th className="text-left py-4 px-6 font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-4 px-6 font-medium">{order.orderNumber}</td>
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-medium">{order.customer.name}</p>
                      <p className="text-sm text-gray-600">
                        {order.customer.email}
                      </p>
                    </div>
                  </td>
                  <td className="py-4 px-6">{order.items.length} items</td>
                  <td className="py-4 px-6 font-medium">
                    {formatCurrency(order.total)}
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-600">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-600 hover:text-luxury-gold transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: DollarSign },
    { id: "products", label: "Products", icon: Package },
    { id: "orders", label: "Orders", icon: ShoppingCart },
    { id: "customers", label: "Customers", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-luxury-black mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome back, {user?.name}. Here's what's happening with your store.
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-luxury-gold text-luxury-gold"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === "dashboard" && renderDashboard()}
          {activeTab === "products" && renderProducts()}
          {activeTab === "orders" && renderOrders()}
          {activeTab === "customers" && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                Customer Management
              </h3>
              <p className="text-gray-500">
                Customer management features coming soon.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Admin;
