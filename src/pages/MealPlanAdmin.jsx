import React, { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import { supabase } from "../supabaseClient";
import {
  FiPlusCircle,
  FiArrowLeft,
  FiDatabase,
  FiLayers,
  FiAlertCircle,
  FiCheckCircle, 
  FiXCircle,
} from "react-icons/fi";

export default function MealPlanAdmin() {
  const [dishes, setDishes] = useState([]);
  const [allergens, setAllergens] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState("dishes");

  const [newDish, setNewDish] = useState({
    name: "",
    default_serving: "",
    description: "",
    store_id: "",
    eating_style: "",
    steps: "",
    meal_type: "",
    goal: "",
    health_condition: "",
  });

  const [newIngredient, setNewIngredient] = useState({
    name: "",
    amount: "",
    unit: "",
    is_rice: false,
    calories: "",
    protein: "",
    carbs: "",
    fats: "",
    allergen_name: "",
  });

  const [newAllergen, setNewAllergen] = useState({
    name: "",
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  async function fetchAllData() {
    setLoading(true);
    const [dishData, allergenData, ingredientData] = await Promise.all([
      supabase.from("dishes").select("*"),
      supabase.from("allergens").select("*"),
      supabase.from("ingredients").select("*"),
    ]);

    if (!dishData.error) setDishes(dishData.data || []);
    if (!allergenData.error) setAllergens(allergenData.data || []);
    if (!ingredientData.error) setIngredients(ingredientData.data || []);
    setLoading(false);
  }

  const handleDishChange = (e) => {
    const { name, value } = e.target;
    setNewDish((prev) => ({ ...prev, [name]: value }));
  };

  const handleIngredientChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewIngredient((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAllergenChange = (e) => {
    const { name, value } = e.target;
    setNewAllergen((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Add Dish with Ingredient + Allergen logic intact
  const handleAddDish = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let allergenId = null;
      if (newIngredient.allergen_name.trim()) {
        const allergenName = newIngredient.allergen_name.trim();

        const { data: existing, error: checkError } = await supabase
          .from("allergens")
          .select("id")
          .eq("name", allergenName)
          .maybeSingle();

        if (checkError) throw checkError;

        if (existing) {
          allergenId = existing.id;
        } else {
          const { data: newAllergen, error: insertError } = await supabase
            .from("allergens")
            .insert([{ name: allergenName }])
            .select()
            .single();
          if (insertError) throw insertError;
          allergenId = newAllergen.id;
        }
      }

      const { data: dishData, error: dishError } = await supabase
        .from("dishes")
        .insert([newDish])
        .select()
        .single();
      if (dishError) throw dishError;

      const ingredientInsert = {
        name: newIngredient.name,
        amount: newIngredient.amount,
        unit: newIngredient.unit,
        is_rice: newIngredient.is_rice,
        calories: newIngredient.calories,
        protein: newIngredient.protein,
        carbs: newIngredient.carbs,
        fats: newIngredient.fats,
        allergen_id: allergenId,
        dish_id: dishData.id,
      };

      const { error: ingredientError } = await supabase
        .from("ingredients")
        .insert([ingredientInsert]);
      if (ingredientError) throw ingredientError;

      alert("✅ Dish, ingredient, and allergen added successfully!");
      fetchAllData();
      setView("dishes");
    } catch (err) {
      alert("❌ Error: " + err.message);
      console.error(err);
    }
    setLoading(false);
  };

  // ✅ Add Ingredient only
  const handleAddIngredient = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.from("ingredients").insert([newIngredient]);
      if (error) throw error;
      alert("✅ Ingredient added successfully!");
      fetchAllData();
      setView("ingredients");
    } catch (err) {
      alert("❌ Error: " + err.message);
    }
    setLoading(false);
  };

  // ✅ Add Allergen only
  const handleAddAllergen = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.from("allergens").insert([newAllergen]);
      if (error) throw error;
      alert("✅ Allergen added successfully!");
      fetchAllData();
      setView("allergens");
    } catch (err) {
      alert("❌ Error: " + err.message);
    }
    setLoading(false);
  };

  const TableCell = ({ children }) => (
    <td className="px-4 py-3 border-b border-gray-200 text-gray-700 text-sm">
      {children || "-"}
    </td>
  );

  return (
    <AdminLayout>
      {/* Green Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-3xl font-bold text-white">Meal Plan Management</h2>
        <p className="text-green-100 mt-1 text-sm">
          Manage dishes, ingredients, and allergens stored in your Supabase database.
        </p>
      </div>

      {/* White Card with Tabs */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Tabs/Navbar */}
        <div className="flex gap-3 mb-6 border-b pb-3">
          <button
            onClick={() => setView("dishes")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition ${
              view === "dishes"
                ? "bg-green-600 text-white shadow"
                : "text-green-700 hover:bg-green-100"
            }`}
          >
            <FiDatabase /> Dishes
          </button>
          <button
            onClick={() => setView("ingredients")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition ${
              view === "ingredients"
                ? "bg-green-600 text-white shadow"
                : "text-green-700 hover:bg-green-100"
            }`}
          >
            <FiLayers /> Ingredients
          </button>
          <button
            onClick={() => setView("allergens")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition ${
              view === "allergens"
                ? "bg-green-600 text-white shadow"
                : "text-green-700 hover:bg-green-100"
            }`}
          >
            <FiAlertCircle /> Allergens
          </button>
          <button
            onClick={() =>
              setView(
                view === "dishes"
                  ? "addDish"
                  : view === "ingredients"
                  ? "addIngredient"
                  : "addAllergen"
              )
            }
            className="ml-auto flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition font-medium"
          >
            <FiPlusCircle /> Add New
          </button>
        </div>

        {/* -------- Dishes Table -------- */}
        {view === "dishes" && (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg text-sm">
              <thead className="bg-green-500 text-white uppercase">
                <tr>
                  <th className="px-4 py-3 text-left">ID</th>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Default Serving</th>
                  <th className="px-4 py-3 text-left">Description</th>
                  <th className="px-4 py-3 text-left">Store ID</th>
                  <th className="px-4 py-3 text-left">Eating Style</th>
                  <th className="px-4 py-3 text-left">Steps</th>
                  <th className="px-4 py-3 text-left">Meal Type</th>
                  <th className="px-4 py-3 text-left">Goal</th>
                  <th className="px-4 py-3 text-left">Health Condition</th>
                </tr>
              </thead>
              <tbody>
                {dishes.map((d, i) => (
                  <tr
                    key={d.id}
                    className={`${
                      i % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-green-50 transition`}
                  >
                    <TableCell>{d.id}</TableCell>
                    <TableCell>{d.name}</TableCell>
                    <TableCell>{d.default_serving}</TableCell>
                    <TableCell className="max-w-[300px] truncate" title={d.description}>
                      {d.description}
                    </TableCell>
                    <TableCell>{d.store_id}</TableCell>
                    <TableCell>{d.eating_style}</TableCell>
                    <TableCell className="max-w-[300px] truncate" title={d.steps}>
                      {d.steps}
                    </TableCell>
                    <TableCell>{d.meal_type}</TableCell>
                    <TableCell>{d.goal}</TableCell>
                    <TableCell>{d.health_condition}</TableCell>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* -------- Ingredients Table -------- */}
        {view === "ingredients" && (
          <div className="overflow-x-auto mt-4 bg-white rounded-lg shadow-sm">
            <table className="min-w-full border-separate border-spacing-0">
              <thead>
                <tr className="bg-green-600 text-white text-sm uppercase">
                  <th className="px-6 py-3 text-left font-medium rounded-tl-lg">ID</th>
                  <th className="px-6 py-3 text-left font-medium">Dish ID</th>
                  <th className="px-6 py-3 text-left font-medium">Name</th>
                  <th className="px-6 py-3 text-left font-medium">Amount</th>
                  <th className="px-6 py-3 text-left font-medium">Unit</th>
                  <th className="px-6 py-3 text-left font-medium">Is Rice?</th>
                  <th className="px-6 py-3 text-left font-medium">Allergen ID</th>
                  <th className="px-6 py-3 text-left font-medium">Calories</th>
                  <th className="px-6 py-3 text-left font-medium">Protein</th>
                  <th className="px-6 py-3 text-left font-medium">Carbs</th>
                  <th className="px-6 py-3 text-left font-medium rounded-tr-lg">Fat</th>
                </tr>
              </thead>

              <tbody>
                {ingredients.map((i, index) => (
                  <tr
                    key={i.id}
                    className={`${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-green-50 transition-colors`}
                  >
                    <td className="px-6 py-2 border-b border-gray-100">{i.id}</td>
                    <td className="px-6 py-2 border-b border-gray-100">{i.dish_id}</td>
                    <td className="px-6 py-2 border-b border-gray-100">{i.name}</td>
                    <td className="px-6 py-2 border-b border-gray-100">{i.amount}</td>
                    <td className="px-6 py-2 border-b border-gray-100">{i.unit}</td>
                    <td className="px-6 py-2 border-b border-gray-100">
                      {i.is_rice ? (
                        <FiCheckCircle className="text-green-500 text-lg" />
                      ) : (
                        <FiXCircle className="text-red-500 text-lg" />
                      )}
                    </td>
                    <td className="px-6 py-2 border-b border-gray-100">
                      {i.allergen_id || "—"}
                    </td>
                    <td className="px-6 py-2 border-b border-gray-100">
                      {i.calories || 0}
                    </td>
                    <td className="px-6 py-2 border-b border-gray-100">
                      {i.protein || 0}
                    </td>
                    <td className="px-6 py-2 border-b border-gray-100">
                      {i.carbs || 0}
                    </td>
                    <td className="px-6 py-2 border-b border-gray-100">
                      {i.fat || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* -------- Allergens Table -------- */}
        {view === "allergens" && (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg">
              <thead className="bg-green-500 text-white text-sm uppercase">
                <tr>
                  <th className="px-4 py-3 text-left">ID</th>
                  <th className="px-4 py-3 text-left">Name</th>
                </tr>
              </thead>
              <tbody>
                {allergens.map((a, i) => (
                  <tr
                    key={a.id}
                    className={`${
                      i % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-green-50`}
                  >
                    <TableCell>{a.id}</TableCell>
                    <TableCell>{a.name}</TableCell>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* -------- Add Dish Form -------- */}
        {view === "addDish" && (
          <form
            onSubmit={handleAddDish}
            className="bg-white p-6 rounded-2xl shadow-md border border-green-200 max-w-3xl mx-auto mt-6"
          >
            <h3 className="text-2xl font-semibold text-green-700 mb-6 border-b border-green-100 pb-2">
              Add New Dish
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(newDish).map(([key, value]) => (
                <div key={key} className="flex flex-col">
                  <label className="text-sm font-semibold text-green-700 mb-1 capitalize">
                    {key.replace("_", " ")}
                  </label>
                  <input
                    type="text"
                    name={key}
                    value={value}
                    onChange={handleDishChange}
                    className="border border-green-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 bg-green-50 hover:bg-green-100 transition"
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-8 gap-3">
              <button
                type="button"
                onClick={() => setView("dishes")}
                className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition disabled:opacity-60"
              >
                {loading ? "Saving..." : "Save Dish"}
              </button>
            </div>
          </form>
        )}


        {/* -------- Add Ingredient Form -------- */}
        {view === "addIngredient" && (
          <form
            onSubmit={handleAddIngredient}
            className="bg-white p-6 rounded-2xl shadow-md border border-green-200 max-w-2xl mx-auto mt-6"
          >
            <h3 className="text-2xl font-semibold text-green-700 mb-6 border-b border-green-100 pb-2">
              Add New Ingredient
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(newIngredient).map(([key, value]) => (
                <div key={key} className="flex flex-col">
                  <label className="text-sm font-semibold text-green-700 mb-1 capitalize">
                    {key.replace("_", " ")}
                  </label>

                  {key === "is_rice" ? (
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="checkbox"
                        name={key}
                        checked={value}
                        onChange={handleIngredientChange}
                        className="w-5 h-5 text-green-600 border-green-400 rounded focus:ring-2 focus:ring-green-400"
                      />
                      <span className="text-sm text-gray-700">Rice-based ingredient</span>
                    </div>
                  ) : (
                    <input
                      type="text"
                      name={key}
                      value={value}
                      onChange={handleIngredientChange}
                      className="border border-green-300 rounded-lg px-3 py-2 bg-green-50 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition"
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-8 gap-3">
              <button
                type="button"
                onClick={() => setView("ingredients")}
                className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition disabled:opacity-60"
              >
                {loading ? "Saving..." : "Save Ingredient"}
              </button>
            </div>
          </form>
        )}


        {/* -------- Add Allergen Form -------- */}
        {view === "addAllergen" && (
          <form
            onSubmit={handleAddAllergen}
            className="bg-white p-6 rounded-2xl shadow-md border border-green-200 max-w-lg mx-auto mt-6"
          >
            <h3 className="text-2xl font-semibold text-green-700 mb-6 border-b border-green-100 pb-2">
              Add New Allergen
            </h3>

            <div className="flex flex-col">
              <label className="text-sm font-semibold text-green-700 mb-1">Allergen Name</label>
              <input
                type="text"
                name="name"
                value={newAllergen.name}
                onChange={handleAllergenChange}
                placeholder="Enter allergen name"
                className="border border-green-300 rounded-lg px-3 py-2 bg-green-50 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition"
              />
            </div>

            <div className="flex justify-end mt-8 gap-3">
              <button
                type="button"
                onClick={() => setView("allergens")}
                className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition disabled:opacity-60"
              >
                {loading ? "Saving..." : "Save Allergen"}
              </button>
            </div>
          </form>
        )}

      </div>
    </AdminLayout>
  );
}
