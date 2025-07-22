import { useEffect, useState } from 'react';

export default function PCPartsTable() {
  const [parts, setParts] = useState([]);
  const [form, setForm] = useState({
    id: '',
    name: '',
    brand: '',
    price: 0,
    stock: 0,
  });
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  const API_URL = 'https://computer-parts-7sj4.onrender.com/parts';

  const fetchParts = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setParts(data);
  };

  useEffect(() => {
    fetchParts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => {
      if (name === 'stock') {
        return { ...prev, stock: parseInt(value || '0', 10) };
      } else if (name === 'price') {
        return { ...prev, price: parseFloat(value || '0') };
      } else {
        return { ...prev, [name]: value };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const method = editId ? 'PUT' : 'POST';
    const url = editId ? `${API_URL}/mongo/${editId}` : API_URL;

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();

        if (Array.isArray(data.detail)) {
          const messages = data.detail.map((err) => err.msg);
          setError(messages.join(', '));
        } else {
          setError(data.detail || data.error || 'Error desconocido');
        }
        return;
      }

      setForm({ id: '', name: '', brand: '', price: 0, stock: 0 });
      setEditId(null);
      fetchParts();
    } catch {
      setError('Error de red o inesperado');
    }
  };

  const handleEdit = (part) => {
    setForm({
      id: part.id,
      name: part.name,
      brand: part.brand,
      price: part.price,
      stock: part.stock,
    });
    setEditId(part._id);
    setError('');
  };

  const handleDelete = async (id) => {
    setError('');
    try {
      const res = await fetch(`http://localhost:8000/parts/mongo/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.detail || 'Error al eliminar');
        return;
      }
      fetchParts();
    } catch {
      setError('Error de red al eliminar');
    }
  };

  const filteredParts = parts.filter((part) =>
    part.id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">PC Parts Store</h1>

      {/* Mostrar error */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
          {error.split(', ').map((msg, i) => (
            <div key={i}>{msg}</div>
          ))}
        </div>
      )}

      <form className="mb-6 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            ID del producto (único, por ejemplo: P121)
          </label>
          <input
            className="border rounded px-2 py-1 w-full"
            type="text"
            name="id"
            value={form.id}
            onChange={handleChange}
            required
            disabled={!!editId}
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Nombre del producto
          </label>
          <input
            className="border rounded px-2 py-1 w-full"
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Marca del producto
          </label>
          <input
            className="border rounded px-2 py-1 w-full"
            type="text"
            name="brand"
            value={form.brand}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1">Precio</label>
          <input
            className="border rounded px-2 py-1 w-full"
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            required
            min={0}
            step="0.01"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Stock disponible
          </label>
          <input
            className="border rounded px-2 py-1 w-full"
            type="number"
            name="stock"
            value={form.stock}
            onChange={handleChange}
            required
            min={0}
            step="1"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {editId ? 'Actualizar pieza' : 'Agregar pieza'}
        </button>
      </form>

      <input
        className="border rounded px-2 py-1 mb-4 w-full"
        type="text"
        placeholder="Buscar por ID de producto..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-2 py-1">ID</th>
            <th className="border px-2 py-1">Nombre</th>
            <th className="border px-2 py-1">Marca</th>
            <th className="border px-2 py-1">Precio</th>
            <th className="border px-2 py-1">IVA (15%)</th>
            <th className="border px-2 py-1">Total con IVA</th>
            <th className="border px-2 py-1">Stock</th>
            <th className="border px-2 py-1">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {filteredParts.map((part) => {
            const iva = part.price * 0.15;
            const totalConIVA = part.price + iva;

            return (
              <tr key={part._id} className="text-center">
                <td className="border px-2 py-1">{part.id}</td>
                <td className="border px-2 py-1">{part.name}</td>
                <td className="border px-2 py-1">{part.brand}</td>
                <td className="border px-2 py-1">${part.price.toFixed(2)}</td>
                <td className="border px-2 py-1">${iva.toFixed(2)}</td>
                <td className="border px-2 py-1">${totalConIVA.toFixed(2)}</td>
                <td className="border px-2 py-1">{part.stock}</td>
                <td className="border px-2 py-1 space-x-2">
                  <button
                    onClick={() => handleEdit(part)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(part._id)}
                    className="bg-red-600 text-white px-2 py-1 rounded"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
