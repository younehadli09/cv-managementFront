'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, Trash2, Search } from 'lucide-react';
import Sidebar from '@/components/sidebar';

interface CV {
  id: number;
  xml_data: string;
}

interface SearchResult {
  cv_id: number;
  matches: {
    match: string;
    match_type: string;
    parent?: string;
  }[];
}

export default function Dashboard() {
  const [cvs, setCvs] = useState<CV[]>([]);
  const [selectedCv, setSelectedCv] = useState<{ id: number; html: string } | null>(null);
  const [xpath, setXpath] = useState('');
  const [filterResults, setFilterResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    fetchAllCVs();
  }, []);

  const fetchAllCVs = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/all_cvs');
      const text = await res.text();

      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'text/html');
      const rows = doc.querySelectorAll('tbody tr');

      const cvData = Array.from(rows).map((row) => {
        const id = row.querySelector('td:first-child')?.textContent;
        return {
          id: Number(id),
          xml_data: ''
        };
      });

      setCvs(cvData);
    } catch (error) {
      console.error('Error fetching CVs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewCV = async (id: number) => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/view_cv/${id}`);
      const html = await res.text();
      setSelectedCv({ id, html });
    } catch (error) {
      console.error('Error fetching CV:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCV = async (id: number) => {
    if (!confirm(`Are you sure you want to delete CV ${id}?`)) return;

    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/delete_element', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ xpath_query: `//cv[@id='${id}']` })
      });

      if (response.ok) {
        setCvs(cvs.filter((cv) => cv.id !== id));
        if (selectedCv?.id === id) setSelectedCv(null);
        alert(`CV ${id} deleted successfully`);
      } else {
        throw new Error('Failed to delete CV');
      }
    } catch (error) {
      console.error('Error deleting CV:', error);
      alert('Error deleting CV');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setSearching(true);
      const res = await fetch('http://localhost:5000/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ xpath_query: xpath })
      });

      const data = await res.json();
      setFilterResults(data.results || []);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
    <Sidebar/>
    <main className="flex-1 p-6 overflow-auto from-blue-50 to-green-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8">📄 Tableau de Bord des CV</h1>

        {/* Search */}
        <section className="mb-8 bg-white p-6 rounded-3xl shadow-lg border">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Search className="w-5 h-5 text-blue-600" />
            Recherche XPath
          </h2>
          <div className="flex flex-col sm:flex-row items-stretch gap-4">
          <input
  type="text"
  value={xpath}
  onChange={(e) => setXpath(e.target.value)}
  placeholder="Ex: //experience[@poste='Developer']"
  className="flex-1 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 
             text-gray-800 text-base font-medium placeholder-gray-400"
/>
            <button
              onClick={handleSearch}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
              disabled={searching}
            >
              {searching ? 'Recherche...' : 'Rechercher'}
            </button>
          </div>
        </section>

        {/* CV Cards */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">📁 Liste des CVs</h2>
          {loading && !cvs.length ? (
            <p className="text-center text-gray-500">Chargement des CVs...</p>
          ) : cvs.length === 0 ? (
            <p className="text-center text-gray-500">Aucun CV disponible.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {cvs.map((cv) => (
                <motion.div
                  key={cv.id}
                  whileHover={{ scale: 1.03 }}
                  className="bg-white rounded-3xl shadow-md border p-5 flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">CV #{cv.id}</h3>
                    <p className="text-sm text-gray-500">Identifiant: {cv.id}</p>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => handleViewCV(cv.id)}
                      className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition"
                    >
                      <Eye className="w-4 h-4" />
                      Voir
                    </button>
                    <button
                      onClick={() => handleDeleteCV(cv.id)}
                      className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                      Supprimer
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* CV Details */}
        {selectedCv && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-10 bg-white p-6 rounded-3xl shadow-lg border"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">🧾 Détails du CV (ID: {selectedCv.id})</h2>
              <button
                onClick={() => setSelectedCv(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✖ Fermer
              </button>
            </div>
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: selectedCv.html }}
            />
          </motion.section>
        )}

        {/* Search Results */}
        {filterResults.length > 0 && (
  <motion.section
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="mt-10 space-y-6"
  >
    <h2 className="text-xl font-semibold text-gray-800 mb-6">🔎 Résultats de Recherche</h2>
    <div className="grid gap-6">
      {filterResults.map((result, idx) => (
        <div key={idx} className="p-6 bg-white rounded-3xl shadow border">
          <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
            <span className="bg-blue-100 text-blue-800 p-2 rounded-full">
              #{result.cv_id}
            </span>
            Correspondances trouvées
          </h3>
          
          <div className="space-y-4">
            {result.matches.map((match, i) => (
              <div key={i} className="p-4 bg-gray-50 rounded-xl border">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                    {match.match_type}
                  </span>
                </div>
                
                <div className="bg-white p-3 rounded-lg border mb-3">
                  <pre className="text-gray-800 font-mono text-sm whitespace-pre-wrap break-words">
                    {match.match}
                  </pre>
                </div>
                
                {match.parent && (
                  <>
                    <p className="text-sm text-gray-500 mb-1">Contexte :</p>
                    <div className="bg-white p-3 rounded-lg border">
                      <pre className="text-gray-600 font-mono text-sm whitespace-pre-wrap break-words">
                        {match.parent}
                      </pre>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </motion.section>
)}
      </motion.div>
    </main>
  </div>
  );
}
