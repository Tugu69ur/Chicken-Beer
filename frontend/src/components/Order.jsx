import React, { useState, useEffect } from "react";
import { BASE_URL } from "../../constants.js";

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

  const handleAddToBasket = (item) => {
    addOrder(item);
    console.log(`Added to basket: ${item.name}`);
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
    </div>
  );
}

export default Menu;
