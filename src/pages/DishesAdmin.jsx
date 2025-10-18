// import React, { useEffect, useState } from "react";
// import { supabase } from "../supabaseClient";

// export default function DishesAdmin() {
//   const [dishes, setDishes] = useState([]);
//   const [newDishes, setNewDishes] = useState([
//     {
//       name: "",
//       description: "",
//       calories_value: 0,
//       protein_value: 0,
//       fat_value: 0,
//       carbs_value: 0,
//       image_url: "",
//       ingredient: [],
//       store: [],
//       dietary: [],
//       allergen: [],
//       goal: [],
//       health_condition: [], // ✅ added here
//     },
//   ]);
//   const [uploading, setUploading] = useState(false);

//   useEffect(() => {
//     fetchDishes();
//   }, []);

//   async function fetchDishes() {
//     const { data, error } = await supabase.from("dishinfo").select("*");
//     if (error) console.error("Failed to fetch dishes", error);
//     else setDishes(data);
//   }

//   function convertToWebP(file) {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         const img = new Image();
//         img.onload = () => {
//           const canvas = document.createElement("canvas");
//           canvas.width = img.width;
//           canvas.height = img.height;
//           const ctx = canvas.getContext("2d");
//           ctx.drawImage(img, 0, 0);
//           canvas.toBlob(
//             (blob) => {
//               resolve(
//                 new File([blob], file.name.replace(/\.\w+$/, ".webp"), {
//                   type: "image/webp",
//                 })
//               );
//             },
//             "image/webp",
//             0.8
//           );
//         };
//         img.onerror = reject;
//         img.src = e.target.result;
//       };
//       reader.onerror = reject;
//       reader.readAsDataURL(file);
//     });
//   }

//   async function handleImageChange(index, e) {
//     const file = e.target.files[0];
//     if (!file) return;
//     setUploading(true);
//     try {
//       const webpFile = await convertToWebP(file);
//       const fileName = `${Date.now()}_${webpFile.name}`;
//       const filePath = `dishes/${fileName}`;
//       const { error: uploadError } = await supabase.storage
//         .from("dish-images")
//         .upload(filePath, webpFile, { upsert: true });
//       if (uploadError) throw uploadError;
//       const { data: publicData } = supabase.storage
//         .from("dish-images")
//         .getPublicUrl(filePath);
//       if (!publicData?.publicUrl) throw new Error("Failed to get public URL");

//       const updatedDishes = [...newDishes];
//       updatedDishes[index].image_url = publicData.publicUrl;
//       setNewDishes(updatedDishes);
//     } catch (err) {
//       console.error("Image upload failed:", err);
//       alert("Image upload failed");
//     } finally {
//       setUploading(false);
//     }
//   }

//   function handleChange(index, field, value) {
//     const updated = [...newDishes];
//     if (
//       [
//         "ingredient",
//         "store",
//         "dietary",
//         "allergen",
//         "goal",
//         "health_condition",
//       ].includes(field) // ✅ added here
//     ) {
//       updated[index][field] = value
//         .split(",")
//         .map((i) => i.trim())
//         .filter(Boolean);
//     } else {
//       updated[index][field] = value;
//     }
//     setNewDishes(updated);
//   }

//   async function addDishes() {
//     if (newDishes.some((dish) => !dish.image_url)) {
//       alert("Please upload images for all dishes.");
//       return;
//     }
//     const dishesToInsert = newDishes.map((dish) => ({
//       ...dish,
//       calories_value: Number(dish.calories_value),
//       protein_value: Number(dish.protein_value),
//       fat_value: Number(dish.fat_value),
//       carbs_value: Number(dish.carbs_value),
//     }));
//     const { error } = await supabase.from("dishinfo").insert(dishesToInsert);
//     if (error) console.error("Failed to add dishes", error);
//     else {
//       fetchDishes();
//       setNewDishes([
//         {
//           name: "",
//           description: "",
//           calories_value: 0,
//           protein_value: 0,
//           fat_value: 0,
//           carbs_value: 0,
//           image_url: "",
//           ingredient: [],
//           store: [],
//           dietary: [],
//           allergen: [],
//           goal: [],
//           health_condition: [], // ✅ reset too
//         },
//       ]);
//     }
//   }

//   function addDishField() {
//     if (newDishes.length >= 5) return;
//     setNewDishes([
//       ...newDishes,
//       {
//         name: "",
//         description: "",
//         calories_value: 0,
//         protein_value: 0,
//         fat_value: 0,
//         carbs_value: 0,
//         image_url: "",
//         ingredient: [],
//         store: [],
//         dietary: [],
//         allergen: [],
//         goal: [],
//         health_condition: [], // ✅ added here
//       },
//     ]);
//   }

//   async function deleteDish(id, image_url) {
//     if (!id) return;
//     if (image_url) {
//       const path = image_url.split("/dish-images/dishes/")[1];
//       if (path) {
//         const { error } = await supabase.storage
//           .from("dish-images")
//           .remove([`dishes/${path}`]);
//         if (error) console.error("Failed to delete image from storage", error);
//         else console.log("Image deleted:", path);
//       }
//     }
//     const { error } = await supabase.from("dishinfo").delete().eq("id", id);
//     if (error) console.error("Failed to delete dish", error);
//     else fetchDishes();
//   }

//   return (
//     <div className="p-4">
//       <h2 className="text-xl font-bold mb-4">Manage Dishes</h2>

//       <div className="mb-6 bg-white p-4 shadow rounded flex flex-col gap-4">
//         {newDishes.map((dish, index) => (
//           <div key={index} className="flex flex-wrap gap-2 items-center">
//             <input
//               className="border p-2"
//               placeholder="Dish Name"
//               value={dish.name}
//               onChange={(e) => handleChange(index, "name", e.target.value)}
//             />
//             <input
//               className="border p-2"
//               placeholder="Description"
//               value={dish.description}
//               onChange={(e) =>
//                 handleChange(index, "description", e.target.value)
//               }
//             />
//             <input
//               className="border p-2"
//               placeholder="Calories"
//               type="number"
//               value={dish.calories_value}
//               onChange={(e) =>
//                 handleChange(index, "calories_value", e.target.value)
//               }
//             />
//             <input
//               className="border p-2"
//               placeholder="Protein"
//               type="number"
//               value={dish.protein_value}
//               onChange={(e) =>
//                 handleChange(index, "protein_value", e.target.value)
//               }
//             />
//             <input
//               className="border p-2"
//               placeholder="Fat"
//               type="number"
//               value={dish.fat_value}
//               onChange={(e) => handleChange(index, "fat_value", e.target.value)}
//             />
//             <input
//               className="border p-2"
//               placeholder="Carbs"
//               type="number"
//               value={dish.carbs_value}
//               onChange={(e) =>
//                 handleChange(index, "carbs_value", e.target.value)
//               }
//             />

//             <input
//               type="file"
//               accept="image/*"
//               onChange={(e) => handleImageChange(index, e)}
//               className="border p-2"
//             />
//             {dish.image_url && (
//               <img
//                 src={dish.image_url}
//                 alt="Preview"
//                 style={{
//                   width: "80px",
//                   height: "80px",
//                   objectFit: "cover",
//                   borderRadius: "8px",
//                 }}
//               />
//             )}

//             <input
//               className="border p-2"
//               placeholder="Ingredients (comma-separated)"
//               value={dish.ingredient.join(", ")}
//               onChange={(e) =>
//                 handleChange(index, "ingredient", e.target.value)
//               }
//             />
//             <input
//               className="border p-2"
//               placeholder="Store (comma-separated)"
//               value={dish.store.join(", ")}
//               onChange={(e) => handleChange(index, "store", e.target.value)}
//             />
//             <input
//               className="border p-2"
//               placeholder="Dietary (comma-separated)"
//               value={dish.dietary.join(", ")}
//               onChange={(e) => handleChange(index, "dietary", e.target.value)}
//             />
//             <input
//               className="border p-2"
//               placeholder="Allergen (comma-separated)"
//               value={dish.allergen.join(", ")}
//               onChange={(e) => handleChange(index, "allergen", e.target.value)}
//             />
//             <input
//               className="border p-2"
//               placeholder="Goal (comma-separated)"
//               value={dish.goal.join(", ")}
//               onChange={(e) => handleChange(index, "goal", e.target.value)}
//             />
//             <input
//               className="border p-2"
//               placeholder="Health Conditions (comma-separated)" // ✅ new input
//               value={dish.health_condition.join(", ")}
//               onChange={(e) =>
//                 handleChange(index, "health_condition", e.target.value)
//               }
//             />
//           </div>
//         ))}
//         <button
//           className="bg-green-500 text-white px-4 py-2 rounded"
//           onClick={addDishField}
//           disabled={newDishes.length >= 5}
//         >
//           Add Another Dish
//         </button>
//         <button
//           className="bg-blue-500 text-white px-4 py-2 rounded"
//           onClick={addDishes}
//           disabled={uploading || newDishes.some((d) => !d.image_url)}
//         >
//           {uploading ? "Uploading..." : "Add Dishes"}
//         </button>
//       </div>

//       {/* Dish List */}
//       <ul>
//         {dishes.map((dish) => (
//           <li
//             key={dish.id}
//             className="flex flex-col justify-between items-start bg-white p-3 mb-2 rounded shadow"
//           >
//             <span className="font-bold">{dish.name}</span>
//             <span>{dish.description}</span>
//             {dish.image_url && (
//               <img
//                 src={dish.image_url}
//                 alt={dish.name}
//                 style={{
//                   width: "100px",
//                   height: "100px",
//                   objectFit: "cover",
//                   borderRadius: "8px",
//                 }}
//               />
//             )}
//             <span>
//               {dish.calories_value} kcal | Protein: {dish.protein_value}g | Fat:{" "}
//               {dish.fat_value}g | Carbs: {dish.carbs_value}g
//             </span>
//             {dish.health_condition?.length > 0 && (
//               <span>
//                 ⚕️ Health Conditions: {dish.health_condition.join(", ")}
//               </span>
//             )}
//             <button
//               className="bg-red-500 text-white px-2 py-1 rounded mt-2"
//               onClick={() => deleteDish(dish.id, dish.image_url)}
//             >
//               Delete
//             </button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }


// ================================================================================================================================================


import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthProvider";
import {
  FiPlusCircle,
  FiCopy,
  FiUploadCloud,
  FiEdit,
  FiTrash2,
  FiTrash,
  FiChevronDown,
  FiPieChart, 
  FiCheckCircle,
} from "react-icons/fi";
import AdminLayout from "./AdminLayout";

/* ------------------- AddDish Component ------------------- */
function AddDish({ goBack, refreshDishes, editingDish = null }) {
  const [newDishes, setNewDishes] = useState(
    editingDish
      ? [
          {
            ...editingDish,
            ingredient: editingDish.ingredient?.join(", ") || "",
            store: editingDish.store?.join(", ") || "",
            dietary: editingDish.dietary?.join(", ") || "",
            allergen: editingDish.allergen?.join(", ") || "",
            goal: editingDish.goal?.join(", ") || "",
            health_condition: editingDish.health_condition?.join(", ") || "",
          },
        ]
      : [
          {
            name: "",
            description: "",
            calories_value: 0,
            protein_value: 0,
            fat_value: 0,
            carbs_value: 0,
            image_url: "",
            ingredient: "",
            store: "",
            dietary: "",
            allergen: "",
            goal: "",
            health_condition: "",
          },
        ]
  );
  const [uploading, setUploading] = useState(false);

  function handleChange(index, field, value) {
    setNewDishes((prev) => {
      const copy = [...prev];
      copy[index][field] = value;
      return copy;
    });
  }

  async function handleImageChange(index, e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    try {
      const fileName = `${Date.now()}_${file.name}`;
      const path = `dishes/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("dish-images")
        .upload(path, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: publicData } = supabase.storage
        .from("dish-images")
        .getPublicUrl(path);

      const publicUrl = publicData?.publicUrl || "";

      setNewDishes((prev) => {
        const copy = [...prev];
        copy[index].image_url = publicUrl;
        return copy;
      });
    } catch (err) {
      console.error("Image upload error:", err);
      alert("Image upload failed");
    } finally {
      setUploading(false);
    }
  }

  function addDishField() {
    if (newDishes.length >= 20 || editingDish) return; // Prevent multiple if editing
    setNewDishes((prev) => [
      ...prev,
      {
        name: "",
        description: "",
        calories_value: 0,
        protein_value: 0,
        fat_value: 0,
        carbs_value: 0,
        image_url: "",
        ingredient: "",
        store: "",
        dietary: "",
        allergen: "",
        goal: "",
        health_condition: "",
      },
    ]);
  }

  function copyDish(index) {
    if (newDishes.length >= 20 || editingDish) return;
    const dishToCopy = newDishes[index];
    const copiedDish = { ...dishToCopy, image_url: "" };
    setNewDishes((prev) => [...prev, copiedDish]);
  }

  async function saveDish(dish, index) {
  if (!dish.name?.trim()) {
    alert("Dish name is required!");
    return;
  }
  if (!dish.image_url) {
    alert("Please upload an image for this dish.");
    return;
  }

  setUploading(true);
  try {
    const dishData = {
      ...dish,
      calories_value: Number(dish.calories_value) || 0,
      protein_value: Number(dish.protein_value) || 0,
      fat_value: Number(dish.fat_value) || 0,
      carbs_value: Number(dish.carbs_value) || 0,
      ingredient: dish.ingredient
        ? dish.ingredient.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
      health_condition: dish.health_condition
        ? dish.health_condition.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
      store: dish.store
        ? dish.store.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
      dietary: dish.dietary
        ? dish.dietary.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
      allergen: dish.allergen
        ? dish.allergen.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
      goal: dish.goal
        ? dish.goal.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
    };

    if (editingDish) {
      // ✅ Editing existing dish
      const { error } = await supabase
        .from("dishinfo")
        .update(dishData)
        .eq("id", editingDish.id);

      if (error) throw error;
      alert("Dish updated successfully!");
      refreshDishes();
      goBack();
    } else {
      // ✅ Add new dish
      const { error } = await supabase.from("dishinfo").insert([dishData]);
      if (error) throw error;
      alert("Dish added successfully!");
      refreshDishes();

      // ✅ Remove that dish form after saving
      setNewDishes((prev) => {
        const updated = [...prev];
        updated.splice(index, 1); // remove the form that was saved
        return updated.length > 0
          ? updated
          : [
              {
                name: "",
                description: "",
                calories_value: 0,
                protein_value: 0,
                fat_value: 0,
                carbs_value: 0,
                image_url: "",
                ingredient: "",
                store: "",
                dietary: "",
                allergen: "",
                goal: "",
                health_condition: "",
              },
            ]; // keep at least one empty form
      });
    }
  } catch (err) {
    console.error(err);
    alert("Something went wrong while saving the dish.");
  } finally {
    setUploading(false);
  }
}

function cancelDish(index) {
  if (editingDish) {
    goBack();
  } else {
    setNewDishes((prev) => {
      const copy = [...prev];
      copy[index] = {
        name: "",
        description: "",
        calories_value: 0,
        protein_value: 0,
        fat_value: 0,
        carbs_value: 0,
        image_url: "",
        ingredient: "",
        store: "",
        dietary: "",
        allergen: "",
        goal: "",
        health_condition: "",
      };
      return copy;
    });
  }
}

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 border border-green-100">
      <h2 className="text-2xl font-bold text-green-700 mb-4">
        {editingDish ? "Edit Dish" : "Add New Dish(es)"}
      </h2>

      {newDishes.map((dish, idx) => (
        <div key={idx} className="mb-6 p-4 border rounded-lg bg-gray-50">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-semibold">
              {editingDish ? `Editing: ${editingDish.name}` : `Dish #${idx + 1}`}
            </div>
            {!editingDish && (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => copyDish(idx)}
                  disabled={newDishes.length >= 20}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                >
                  <FiCopy /> Copy
                </button>
                <div className="text-xs text-gray-500">
                  {dish.image_url ? "Image ready" : "No image"}
                </div>
              </div>
            )}
          </div>

          {/* Name & Description */}
          <div className="bg-gradient-to-br from-green-50 via-white to-green-100 p-6 rounded-2xl shadow-xl border border-green-100 transition-all hover:shadow-2xl">
            {/* Grid Layout for Name and Description */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Left Side - Text Info */}
              <div className="md:col-span-2 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-green-700">
                    Dish Name
                  </label>
                  <input
                    value={dish.name}
                    onChange={(e) => handleChange(idx, "name", e.target.value)}
                    placeholder="Enter dish name"
                    className="mt-1 w-full border border-green-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-green-700">
                    Description
                  </label>
                  <textarea
                    value={dish.description}
                    onChange={(e) => handleChange(idx, "description", e.target.value)}
                    rows={3}
                    placeholder="Short description"
                    className="mt-1 w-full border border-green-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition resize-none"
                  />
                </div>
              </div>

              {/* Right Side - Image Upload */}
              <div className="space-y-3 relative">
                <label className="block text-sm font-semibold text-green-700">
                  Image
                </label>

                {/* Upload Box (if no image) */}
                {!dish.image_url ? (
                  <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-green-300 rounded-xl cursor-pointer bg-green-50 hover:bg-green-100 transition duration-300">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(idx, e)}
                      className="hidden"
                    />
                    <FiUploadCloud className="text-green-500 text-3xl mb-2" />
                    <span className="text-xs text-green-700 font-medium">
                      {uploading ? "Uploading..." : "Click to upload image"}
                    </span>
                  </label>
                ) : (
                  <div className="relative group">
                    {/* Uploaded Image Preview */}
                    <img
                      src={dish.image_url}
                      alt="preview"
                      className="w-full h-36 object-cover rounded-xl border border-green-200 shadow-md"
                    />

                    {/* Remove Button */}
                    <button
                      type="button"
                      onClick={() => handleChange(idx, "image_url", "")}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-all duration-300 scale-100 hover:scale-110"
                      title="Remove image"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                )}
              </div>


            </div>

            {/* Nutrition Inputs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 bg-white p-4 rounded-xl shadow-sm border border-green-100">
              <div>
                <label className="text-sm font-semibold text-green-700">
                  Calories
                </label>
                <input
                  type="number"
                  value={dish.calories_value}
                  onChange={(e) => handleChange(idx, "calories_value", e.target.value)}
                  className="mt-1 w-full border border-green-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-green-700">
                  Protein (g)
                </label>
                <input
                  type="number"
                  value={dish.protein_value}
                  onChange={(e) => handleChange(idx, "protein_value", e.target.value)}
                  className="mt-1 w-full border border-green-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-green-700">
                  Fat (g)
                </label>
                <input
                  type="number"
                  value={dish.fat_value}
                  onChange={(e) => handleChange(idx, "fat_value", e.target.value)}
                  className="mt-1 w-full border border-green-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-green-700">
                  Carbs (g)
                </label>
                <input
                  type="number"
                  value={dish.carbs_value}
                  onChange={(e) => handleChange(idx, "carbs_value", e.target.value)}
                  className="mt-1 w-full border border-green-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                />
              </div>
            </div>

            {/* Additional Inputs */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-green-700">
                  Ingredients
                </label>
                <input
                  value={dish.ingredient}
                  onChange={(e) => handleChange(idx, "ingredient", e.target.value)}
                  className="mt-1 w-full border border-green-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                  placeholder="e.g. pork, soy sauce, vinegar"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-green-700">
                  Health Conditions
                </label>
                <input
                  value={dish.health_condition}
                  onChange={(e) => handleChange(idx, "health_condition", e.target.value)}
                  className="mt-1 w-full border border-green-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                  placeholder="e.g. Diabetes, High blood pressure"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-green-700">Store</label>
                <input
                  value={dish.store}
                  onChange={(e) => handleChange(idx, "store", e.target.value)}
                  className="mt-1 w-full border border-green-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                  placeholder="e.g. BQ, Public Market"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-green-700">
                  Dietary
                </label>
                <input
                  value={dish.dietary}
                  onChange={(e) => handleChange(idx, "dietary", e.target.value)}
                  className="mt-1 w-full border border-green-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                  placeholder="e.g. Balanced, Keto, Low Carb, High Protein"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-green-700">
                  Allergen
                </label>
                <input
                  value={dish.allergen}
                  onChange={(e) => handleChange(idx, "allergen", e.target.value)}
                  className="mt-1 w-full border border-green-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                  placeholder="e.g. Nuts, Dairy"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-green-700">Goal</label>
                <input
                  value={dish.goal}
                  onChange={(e) => handleChange(idx, "goal", e.target.value)}
                  className="mt-1 w-full border border-green-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                  placeholder="e.g. Weight Loss, Muscle Gain"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between mt-4">
            {!editingDish && (
              <button
                onClick={addDishField}
                disabled={newDishes.length >= 20}
                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              >
                <FiPlusCircle /> Add Another Dish
              </button>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => saveDish(dish, idx)}
                disabled={uploading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                {uploading ? "Saving..." : editingDish ? "Update Dish" : "Add Dish"}
              </button>
              <button
                onClick={() => cancelDish(idx)}
                className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ------------------- DishesAdmin Component ------------------- */
export default function DishesAdmin() {
  const [dishes, setDishes] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingDish, setEditingDish] = useState(null);
  const [selectedDishes, setSelectedDishes] = useState([]);
  const [confirmDeleteAll, setConfirmDeleteAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    fetchDishes();
  }, []);

  async function fetchDishes() {
    const { data, error } = await supabase.from("dishinfo").select("*");
    if (error) console.error("Failed to fetch dishes", error);
    else setDishes(data || []);
  }

  async function deleteDish(id, image_url) {
    if (!id) return;
    if (image_url) {
      const path = image_url.split("/dish-images/dishes/")[1];
      if (path) {
        const { error } = await supabase.storage
          .from("dish-images")
          .remove([`dishes/${path}`]);
        if (error) console.error("Failed to delete image", error);
      }
    }
    const { error } = await supabase.from("dishinfo").delete().eq("id", id);
    if (error) console.error("Failed to delete dish", error);
    else fetchDishes();
  }

  async function deleteMultipleDishes() {
    if (selectedDishes.length === 0)
      return alert("No dishes selected for deletion.");
    if (!confirm(`Are you sure you want to delete ${selectedDishes.length} dish(es)?`))
      return;

    for (const dish of selectedDishes) {
      await deleteDish(dish.id, dish.image_url);
    }
    setSelectedDishes([]);
  }

  async function deleteAllDishes() {
    setConfirmDeleteAll(true);
  }

  async function confirmDeleteAllAction() {
    for (const dish of dishes) {
      await deleteDish(dish.id, dish.image_url);
    }
    setSelectedDishes([]);
    setConfirmDeleteAll(false);
  }

  function cancelDeleteAllAction() {
    setConfirmDeleteAll(false);
  }

  const dietCategories = ["Balanced", "Keto", "Low Carb", "High Protein"];

  const filteredDishes = dishes.filter((dish) => {
    const matchesCategory = categoryFilter
      ? dish.dietary?.includes(categoryFilter)
      : true;
    const matchesSearch = dish.name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  function toggleSelectDish(dish) {
    setSelectedDishes((prev) =>
      prev.some((d) => d.id === dish.id)
        ? prev.filter((d) => d.id !== dish.id)
        : [...prev, dish]
    );
  }

// ✅ Compute unique totals per dish name
const totalDishes = new Set(dishes.map((d) => d.name?.trim().toLowerCase())).size;

const dietTotals = dietCategories.map((cat) => {
  // Get all dishes belonging to this dietary category
  const uniqueDishNames = new Set(
    dishes
      .filter((d) => d.dietary?.includes(cat))
      .map((d) => d.name?.trim().toLowerCase())
  );

  return {
    name: cat,
    count: uniqueDishNames.size,
  };
});

return (
    <AdminLayout>
      {!showAddForm ? (
        <>
          {/* ✅ Full-width green header */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg shadow-md mb-4">
            <h2 className="text-3xl font-bold text-white">Manage Dishes</h2>
            <p className="text-green-100 mt-1 text-sm">
              View and manage all dishes here.
            </p>
          </div>

            {/* ✅ Stats Summary Section */}
            <div className="bg-white border border-green-100 rounded-2xl shadow-md p-5 mb-6">
              <div className="flex flex-wrap items-center justify-between gap-6">
                {/* Total Dishes */}
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-100 rounded-full shadow-sm">
                    <FiPieChart className="text-green-600" size={22} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Total Dishes</p>
                    <h3 className="text-2xl font-bold text-green-700">{totalDishes}</h3>
                  </div>
                </div>

                {/* Per Diet Totals */}
                <div className="flex flex-wrap gap-3 text-sm text-gray-700 justify-end">
                  {dietTotals.map((diet) => (
                    <div
                      key={diet.name}
                      className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-2 shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      <FiCheckCircle className="text-green-600" size={16} />
                      <span className="font-semibold text-green-700">{diet.name}:</span>
                      <span className="text-green-600 font-bold">{diet.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          {/* ✅ Filters, Search & Buttons */}
          <div className="bg-white shadow-md rounded-2xl p-6 mb-6 flex flex-wrap items-center justify-between gap-4 border border-green-100">
            {/* Search & Filter Section */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by dish name..."
                className="border border-green-200 rounded-xl px-4 py-2 w-full sm:w-64 focus:ring-2 focus:ring-green-400 focus:outline-none shadow-sm transition"
              />

              <div className="relative w-full sm:w-48">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="appearance-none border border-green-200 rounded-xl px-4 py-2 w-full bg-white text-gray-700 font-medium focus:ring-2 focus:ring-green-400 focus:border-green-400 focus:outline-none shadow-sm transition hover:border-green-300"
                >
                  <option value="">All Diets</option>
                  {dietCategories.map((cat, i) => (
                    <option key={i} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>

                {/* Custom Dropdown Icon */}
                <FiChevronDown
                  size={18}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-600 pointer-events-none"
                />
              </div>
            </div>

            {/* Action Buttons Section */}
            <div className="flex flex-wrap items-center gap-3 justify-end w-full md:w-auto">
              <button
                onClick={() => {
                  setShowAddForm(true);
                  setEditingDish(null);
                }}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-transform transform hover:-translate-y-0.5"
              >
                <FiPlusCircle size={18} />
                Add Dish
              </button>

              {selectedDishes.length > 0 && (
                <>
                  <button
                    onClick={deleteMultipleDishes}
                    className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold px-5 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-transform transform hover:-translate-y-0.5"
                  >
                    <FiTrash2 size={18} />
                    Delete Selected ({selectedDishes.length})
                  </button>

                  <button
                    onClick={deleteAllDishes}
                    className="flex items-center gap-2 bg-red-700 hover:bg-red-800 text-white font-semibold px-5 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-transform transform hover:-translate-y-0.5"
                  >
                    <FiTrash size={18} />
                    Delete All
                  </button>
                </>
              )}
            </div>
          </div>

          {/* ✅ Dish Cards */}
          {filteredDishes.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDishes.map((dish) => {
                const isSelected = selectedDishes.some((d) => d.id === dish.id);
                return (
                  <div
                    key={dish.id}
                    onClick={() => toggleSelectDish(dish)}
                    className={`bg-white rounded-2xl shadow p-4 border relative cursor-pointer transition-transform ${
                      isSelected
                        ? "border-red-500 scale-105"
                        : confirmDeleteAll
                        ? "border-red-500"
                        : ""
                    }`}
                  >
                    {dish.dietary?.length > 0 && (
                      <span className="absolute top-3 right-3 bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded">
                        {dish.dietary.join(", ")} Diet
                      </span>
                    )}

                    {dish.image_url && (
                      <img
                        src={dish.image_url}
                        alt={dish.name}
                        className="w-full h-40 object-cover rounded mb-3"
                      />
                    )}

                    <h3 className="text-lg font-bold text-gray-800">{dish.name}</h3>
                    <p className="text-sm text-gray-600">{dish.description}</p>

                    <p className="text-sm text-gray-700 mt-2">
                      {dish.calories_value} kcal | Protein: {dish.protein_value}g | Fat:{" "}
                      {dish.fat_value}g | Carbs: {dish.carbs_value}g
                    </p>

                    {dish.health_condition?.length > 0 && (
                      <p className="text-xs text-green-600 mt-2">
                        {dish.health_condition.join(", ")}
                      </p>
                    )}

                    {isSelected && (
                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingDish(dish);
                            setShowAddForm(true);
                          }}
                          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                        >
                          <FiEdit /> Edit
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-gray-500 mt-6">Nothing listed yet</p>
          )}

          {/* ✅ Confirm Delete All Modal */}
          {confirmDeleteAll && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <div className="bg-white p-6 rounded shadow-lg text-center">
                <p className="text-lg font-semibold text-red-600">
                  Are you sure you want to delete ALL dishes?
                </p>
                <div className="flex justify-center gap-4 mt-4">
                  <button
                    onClick={confirmDeleteAllAction}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                  >
                    <FiTrash /> Yes, Delete All
                  </button>
                  <button
                    onClick={cancelDeleteAllAction}
                    className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <AddDish
          goBack={() => {
            setShowAddForm(false);
            setEditingDish(null);
          }}
          refreshDishes={fetchDishes}
          editingDish={editingDish}
        />
      )}
    </AdminLayout>
  );
}