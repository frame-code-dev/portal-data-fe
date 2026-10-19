export interface Dataset {
  id: number;
  slug: string;
  title: string;
  value_label: string;
  categories: string[];
  statuses: string[];
  items_count: number;
  created_at?: string;
  updated_at?: string;
}

export interface DatasetItem {
  id: number;
  dataset_id: number;
  code: string;
  name: string;
  category: string;
  unit: string;
  date: string;
  value: number;
  status: string;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface DatasetSummary {
  dataset: Dataset;
  total_items: number;
  total_value: number;
  status_counts: Record<string, number>;
  category_counts: Record<string, number>;
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface ItemFormData {
  code: string;
  name: string;
  category: string;
  unit: string;
  date: string;
  value: number;
  status: string;
  notes: string;
}
