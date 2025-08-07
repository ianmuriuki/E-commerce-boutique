import React, { useState, useEffect } from "react";
import { Plus, X, Upload } from "lucide-react";
import { motion } from "framer-motion";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { uploadService } from "../../services/uploadService";
import { productService } from "../../services/productService";
import { categoryService, type Category } from "../../services/categoryService";

interface ProductFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    inStock: "",
    featured: false,
    slug: "",
    sku: "",
    sizes: ["Default"],
    colors: [] as { name: string; hex: string }[],
  });
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      setLoadingCategories(true);
      try {
        const response = await categoryService.getCategories();
        setCategories(response.data);
      } catch (err: any) {
        setError(err.message || "Failed to load categories");
      } finally {
        setLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploadingImages(true);
    setError("");

    try {
      const uploadPromises = Array.from(files).map((file) =>
        uploadService.uploadImage(file)
      );

      const results = await Promise.all(uploadPromises);
      setImages((prev) => [...prev, ...results.map((r) => r.url)]);
    } catch (err: any) {
      setError(err.message || "Failed to upload images");
    } finally {
      setUploadingImages(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) {
      setError("Please upload at least one image");
      return;
    }

    // Validate colors
    const validColors = formData.colors.filter(
      (color) => color.name.trim() !== ""
    );
    if (formData.colors.length > 0 && validColors.length === 0) {
      setError("Please provide names for the colors or remove them");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        inStock: parseInt(formData.inStock),
        images,
        colors: validColors, // Only include valid colors
        // Generate slug from title if not provided
        slug:
          formData.slug || formData.title.toLowerCase().replace(/\s+/g, "-"),
        // Generate SKU if not provided
        sku: formData.sku || `SKU-${Date.now()}`,
      };

      await productService.createProduct(productData);
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setImages(images.filter((_, index) => index !== indexToRemove));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200"
        >
          {error}
        </motion.div>
      )}

      {/* Image Upload */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Product Images
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((url, index) => (
            <div key={url} className="relative aspect-square">
              <img
                src={url}
                alt={`Product ${index + 1}`}
                className="w-full h-full object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          ))}
          <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-luxury-gold transition-colors">
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
              disabled={uploadingImages}
            />
            {uploadingImages ? (
              <div className="w-6 h-6 border-2 border-luxury-gold border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Upload className="w-6 h-6 text-gray-400" />
                <span className="mt-2 text-sm text-gray-500">
                  Upload Images
                </span>
              </>
            )}
          </label>
        </div>
      </div>

      {/* Product Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Product Title"
          name="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          fullWidth
        />

        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-luxury-gold focus:border-transparent transition-shadow"
            disabled={loadingCategories}
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Price"
          name="price"
          type="number"
          step="0.01"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          required
          fullWidth
        />

        <Input
          label="Stock Quantity"
          name="inStock"
          type="number"
          value={formData.inStock}
          onChange={(e) =>
            setFormData({ ...formData, inStock: e.target.value })
          }
          required
          fullWidth
        />

        <Input
          label="SKU"
          name="sku"
          value={formData.sku}
          onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
          placeholder="Leave empty for auto-generated SKU"
          fullWidth
        />

        <Input
          label="Slug"
          name="slug"
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          placeholder="Leave empty for auto-generated slug"
          fullWidth
        />

        <div className="md:col-span-2">
          <textarea
            name="description"
            placeholder="Product Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-luxury-gold focus:border-transparent transition-shadow"
            rows={4}
          />
        </div>

        <div className="md:col-span-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) =>
                setFormData({ ...formData, featured: e.target.checked })
              }
              className="w-4 h-4 text-luxury-gold focus:ring-luxury-gold rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">Featured Product</span>
          </label>
        </div>

        {/* Color Management */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Colors
          </label>
          <div className="space-y-4">
            {formData.colors.map((color, index) => (
              <div key={index} className="flex items-center space-x-4">
                <Input
                  type="text"
                  placeholder="Color name"
                  value={color.name}
                  onChange={(e) => {
                    const newColors = [...formData.colors];
                    newColors[index].name = e.target.value;
                    setFormData({ ...formData, colors: newColors });
                  }}
                />
                <input
                  type="color"
                  value={color.hex}
                  onChange={(e) => {
                    const newColors = [...formData.colors];
                    newColors[index].hex = e.target.value;
                    setFormData({ ...formData, colors: newColors });
                  }}
                  className="h-10 w-20 rounded border border-gray-300"
                />
                <button
                  type="button"
                  onClick={() => {
                    const newColors = formData.colors.filter(
                      (_, i) => i !== index
                    );
                    setFormData({ ...formData, colors: newColors });
                  }}
                  className="p-2 text-red-600 hover:text-red-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
            {formData.colors.length < 3 && (
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    ...formData,
                    colors: [...formData.colors, { name: "", hex: "#000000" }],
                  });
                }}
                className="flex items-center space-x-2 text-luxury-gold hover:text-luxury-gold/80"
              >
                <Plus className="w-5 h-5" />
                <span>Add Color</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="submit"
          loading={loading}
          disabled={loading || uploadingImages}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Product
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
