'use client';

import { useState, useEffect } from 'react';

type Package = {
  id: number;
  recipient: string;
  destination: string;
  item: string;
  quantity: string;
  sent_date: string;
};

export default function Home() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [form, setForm] = useState({ recipient: '', destination: '', item: '', quantity: '1', sent_date: '' });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ recipient: '', destination: '', item: '', quantity: '', sent_date: '' });

  const loadPackages = async () => {
    const res = await fetch('/api/packages');
    const data = await res.json();
    setPackages(data);
  };

  useEffect(() => {
    loadPackages();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/packages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setForm({ recipient: '', destination: '', item: '', quantity: '1', sent_date: '' });
    loadPackages();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this package?')) return;
    await fetch(`/api/packages?id=${id}`, { method: 'DELETE' });
    loadPackages();
  };

  const startEdit = (pkg: Package) => {
    setEditingId(pkg.id);
    setEditForm({ recipient: pkg.recipient, destination: pkg.destination, item: pkg.item, quantity: pkg.quantity || '1', sent_date: pkg.sent_date });
  };

  const saveEdit = async (id: number) => {
    await fetch('/api/packages', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...editForm, id }),
    });
    setEditingId(null);
    loadPackages();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 text-black">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">📦 Sent Packages Log</h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-8 grid grid-cols-1 md:grid-cols-6 gap-4">
          <input required placeholder="Recipient" className="border p-2 rounded" value={form.recipient} onChange={e => setForm({...form, recipient: e.target.value})} />
          <input required placeholder="Destination" className="border p-2 rounded" value={form.destination} onChange={e => setForm({...form, destination: e.target.value})} />
          <input required placeholder="Item(s)" className="border p-2 rounded" value={form.item} onChange={e => setForm({...form, item: e.target.value})} />
          <input required type="number" min="1" placeholder="Qty" className="border p-2 rounded" value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} />
          <input required type="date" className="border p-2 rounded" value={form.sent_date} onChange={e => setForm({...form, sent_date: e.target.value})} />
          <button type="submit" className="bg-green-600 text-white p-2 rounded hover:bg-green-700 font-bold">Add</button>
        </form>

        {/* Table */}
        <div className="bg-white rounded shadow overflow-hidden">
          <table className="w-full text-left border-collapse table-fixed">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3 border-b w-28">Date</th>
                <th className="p-3 border-b w-40">Recipient</th>
                <th className="p-3 border-b w-40">Destination</th>
                <th className="p-3 border-b">Item(s)</th>
                <th className="p-3 border-b w-16 text-center">Qty</th>
                <th className="p-3 border-b w-32">Actions</th>
              </tr>
            </thead>
            <tbody>
              {packages.map((pkg) => (
                <tr key={pkg.id} className="hover:bg-gray-50 align-top">
                  {editingId === pkg.id ? (
                    // EDIT MODE
                    <>
                      <td className="p-2 border-b"><input type="date" className="border p-1 rounded w-full" value={editForm.sent_date} onChange={e => setEditForm({...editForm, sent_date: e.target.value})} /></td>
                      <td className="p-2 border-b"><input className="border p-1 rounded w-full" value={editForm.recipient} onChange={e => setEditForm({...editForm, recipient: e.target.value})} /></td>
                      <td className="p-2 border-b"><input className="border p-1 rounded w-full" value={editForm.destination} onChange={e => setEditForm({...editForm, destination: e.target.value})} /></td>
                      <td className="p-2 border-b"><textarea className="border p-1 rounded w-full" rows={2} value={editForm.item} onChange={e => setEditForm({...editForm, item: e.target.value})} /></td>
                      <td className="p-2 border-b"><input type="number" min="1" className="border p-1 rounded w-full text-center" value={editForm.quantity} onChange={e => setEditForm({...editForm, quantity: e.target.value})} /></td>
                      <td className="p-2 border-b flex flex-col gap-2">
                        <button onClick={() => saveEdit(pkg.id)} className="bg-blue-600 text-white px-2 py-1 rounded text-sm hover:bg-blue-700">Save</button>
                        <button onClick={() => setEditingId(null)} className="bg-gray-400 text-white px-2 py-1 rounded text-sm hover:bg-gray-500">Cancel</button>
                      </td>
                    </>
                  ) : (
                    // VIEW MODE
                    <>
                      <td className="p-3 border-b">{pkg.sent_date}</td>
                      <td className="p-3 border-b font-medium break-words">{pkg.recipient}</td>
                      <td className="p-3 border-b break-words">{pkg.destination}</td>
                      <td className="p-3 border-b whitespace-pre-wrap break-words">{pkg.item}</td>
                      <td className="p-3 border-b text-center font-bold">{pkg.quantity || '1'}</td>
                      <td className="p-3 border-b flex flex-col gap-1">
                        <button onClick={() => startEdit(pkg)} className="text-blue-500 hover:text-blue-700 font-medium text-sm text-left">Edit</button>
                        <button onClick={() => handleDelete(pkg.id)} className="text-red-500 hover:text-red-700 font-medium text-sm text-left">Delete</button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
              {packages.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-gray-500">No packages logged yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}