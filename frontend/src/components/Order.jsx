import React, { useState, useEffect } from "react";
import { BASE_URL } from "../../constants.js";
import { useNavigate } from "react-router-dom";

function groupByCategory(items) {
  const grouped = {};
  items.forEach((item) => {
    if (!grouped[item.category]) grouped[item.category] = [];
    grouped[item.category].push(item);
  });
  return Object.entries(grouped).map(([title, items]) => ({ title, items }));
}

function Menu({ addOrder }) {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const handleAddToBasket = (item) => {
    setSelectedItem(item);
    setShowConfirmDialog(true);
  };

  const confirmAddToBasket = () => {
    if (selectedItem) {
      addOrder(selectedItem);
      console.log(`Added to basket: ${selectedItem.name}`);
      setShowConfirmDialog(false);
      setShowSuccess(true);
    }
  };

  const handleContinueShopping = () => {
    setShowSuccess(false);
    setSelectedItem(null);
  };

  const handleGoToOrders = () => {
    navigate('/orders');
  };

  useEffect(() => {
    fetch(`${BASE_URL}api/menu`)
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          setMenu(groupByCategory(json.data));
        } else {
          setMenu([]);
          console.warn("API returned success false or data is not array");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center mt-20">Loading...</div>;
  if (menu.length === 0)
    return <div className="text-center mt-20">No menu items found</div>;

  return (
    <div className="px-44 mt-16">
      {menu.map((category, idx) => (
        <div key={idx} className="mb-12">
          <h1 className="text-3xl mb-6 ml-6 text-start">{category.title}</h1>
          <div className="grid md:grid-cols-3 gap-9">
            {category.items.map((item, index) => (
              <div
                key={index}
                className="group bg-[#F9F9F9] border overflow-hidden rounded-md shadow-sm transition-all duration-300 hover:shadow-lg"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-65 object-cover"
                />
                <div className="p-4 transition-all duration-300">
                  <h2 className="text-md font-bold">{item.name}</h2>
                  <p className="text-red-600 font-bold text-2xl">{item.price}</p>

                  <div className="mt-[-20px] opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-40 transition-all duration-300 overflow-hidden">
                    <p className="text-sm text-gray-600">{item.description}</p>
                    <button
                      className="w-full h-[40px] px-3 py-1 bg-[#D81E1E] text-white text-sm font-bold rounded hover:bg-red-700"
                      onClick={() => handleAddToBasket(item)}
                    >
                      Сагсанд хийх
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Сагсанд нэмэх</h3>
            <p className="mb-4">Та {selectedItem?.name} сагсанд нэмэхдээ итгэлтэй байна уу?</p>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => setShowConfirmDialog(false)}
              >
                Үгүй
              </button>
              <button
                className="px-4 py-2 bg-[#D81E1E] text-white rounded hover:bg-red-700"
                onClick={confirmAddToBasket}
              >
                Тийм
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Dialog */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-xl font-bold mb-4 text-green-600">Сагсанд хийлээ</h3>
            <p className="mb-4">Таны сагсанд амжилттай хийлэээ.</p>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={handleContinueShopping}
              >
                Бүтээгдэхүүн нэмэх
              </button>
              <button
                className="px-4 py-2 bg-[#D81E1E] text-white rounded hover:bg-red-700"
                onClick={handleGoToOrders}
              >
                Захиалга дуусгах
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Menu;
