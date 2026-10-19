import React, { useCallback, useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { DatasetTabs } from '../components/DatasetTabs';
import { StatsCard } from '../components/StatsCard';
import { DataTable } from '../components/DataTable';
import { ItemModal } from '../components/ItemModal';
import { ImportModal } from '../components/ImportModal';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import { datasetService } from '../services/datasetService';
import type { Dataset, DatasetItem, DatasetSummary, ItemFormData, PaginationMeta } from '../types/dataset';
import type { User } from '../types/auth';

interface DashboardPageProps {
  user: User | null;
  onLogout: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ user, onLogout }) => {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string>('');
  const [summary, setSummary] = useState<DatasetSummary | null>(null);

  // Table State
  const [items, setItems] = useState<DatasetItem[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [search, setSearch] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  // Modals State
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DatasetItem | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<DatasetItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch initial datasets
  const fetchDatasets = async (preferredSlug?: string) => {
    try {
      const data = await datasetService.getAll();
      setDatasets(data);
      if (data.length > 0) {
        const nextSlug = preferredSlug && data.some((d) => d.slug === preferredSlug)
          ? preferredSlug
          : selectedSlug && data.some((d) => d.slug === selectedSlug)
          ? selectedSlug
          : data[0].slug;
        setSelectedSlug(nextSlug);
      }
    } catch (err) {
      console.error('Gagal mengambil daftar dataset:', err);
    }
  };

  // Fetch summary for active dataset
  const fetchSummary = useCallback(async (slug: string) => {
    if (!slug) return;
    try {
      const data = await datasetService.getSummary(slug);
      setSummary(data);
    } catch (err) {
      console.error('Gagal mengambil ringkasan dataset:', err);
    }
  }, []);

  // Fetch items for active dataset
  const fetchItems = useCallback(
    async (slug: string, targetPage = 1, currentSearch = '', currentCategory = '', currentStatus = '') => {
      if (!slug) return;
      try {
        setLoading(true);
        const res = await datasetService.getItems(slug, {
          page: targetPage,
          per_page: 15,
          search: currentSearch,
          category: currentCategory,
          status: currentStatus,
        });
        setItems(res.data);
        setPagination(res.pagination);
      } catch (err) {
        console.error('Gagal mengambil data items:', err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchDatasets();
  }, []);

  useEffect(() => {
    if (selectedSlug) {
      setPage(1);
      setSearch('');
      setCategory('');
      setStatus('');
      fetchSummary(selectedSlug);
      fetchItems(selectedSlug, 1, '', '', '');
    }
  }, [selectedSlug, fetchSummary, fetchItems]);

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
    fetchItems(selectedSlug, 1, val, category, status);
  };

  const handleCategoryChange = (val: string) => {
    setCategory(val);
    setPage(1);
    fetchItems(selectedSlug, 1, search, val, status);
  };

  const handleStatusChange = (val: string) => {
    setStatus(val);
    setPage(1);
    fetchItems(selectedSlug, 1, search, category, val);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    fetchItems(selectedSlug, newPage, search, category, status);
  };

  const handleReload = () => {
    fetchDatasets(selectedSlug);
    fetchSummary(selectedSlug);
    fetchItems(selectedSlug, page, search, category, status);
  };

  // Item Save (Create or Update)
  const handleSaveItem = async (formData: ItemFormData) => {
    if (editingItem) {
      await datasetService.updateItem(editingItem.id, formData);
    } else {
      await datasetService.createItem(selectedSlug, formData);
    }
    handleReload();
  };

  // Item Delete
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      await datasetService.deleteItem(deleteTarget.id);
      setDeleteTarget(null);
      handleReload();
    } catch (err) {
      console.error('Gagal menghapus item:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const activeDataset = datasets.find((d) => d.slug === selectedSlug) || null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar
        user={user}
        onLogout={onLogout}
        onOpenImport={() => setIsImportModalOpen(true)}
      />

      {datasets.length > 0 && (
        <DatasetTabs
          datasets={datasets}
          selectedSlug={selectedSlug}
          onSelect={(slug) => setSelectedSlug(slug)}
        />
      )}

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <StatsCard summary={summary} />

        <DataTable
          dataset={activeDataset}
          items={items}
          pagination={pagination}
          search={search}
          category={category}
          status={status}
          loading={loading}
          onSearchChange={handleSearchChange}
          onCategoryChange={handleCategoryChange}
          onStatusChange={handleStatusChange}
          onPageChange={handlePageChange}
          onReload={handleReload}
          onAddNew={() => {
            setEditingItem(null);
            setIsItemModalOpen(true);
          }}
          onEdit={(item) => {
            setEditingItem(item);
            setIsItemModalOpen(true);
          }}
          onDelete={(item) => {
            setDeleteTarget(item);
          }}
        />
      </main>

      {/* Item Modal (Create / Edit) */}
      <ItemModal
        isOpen={isItemModalOpen}
        dataset={activeDataset}
        editingItem={editingItem}
        onClose={() => setIsItemModalOpen(false)}
        onSave={handleSaveItem}
      />

      {/* Import Excel Modal */}
      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onSuccess={() => {
          setIsImportModalOpen(false);
          handleReload();
        }}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        item={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
};
