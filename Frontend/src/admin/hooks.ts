import { useCallback, useEffect, useState } from 'react';
import { adminApi } from '../ui/utils/axios';

// Shared list/refresh/select/delete behaviour for the admin tables.
export function useAdminResource<T extends { id: string }>(path: string) {
    const [items, setItems] = useState<T[]>([]);
    const [selected, setSelected] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchItems = useCallback(async () => {
        try {
            setLoading(true);
            const res = await adminApi.get<T[]>(path);
            setItems(res.data);
        } catch (err) {
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    }, [path]);

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    const refreshData = async () => {
        setIsRefreshing(true);
        await fetchItems();
        setTimeout(() => setIsRefreshing(false), 500);
    };

    const handleCheckbox = (id: string) => {
        setSelected(prev => (prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]));
    };

    const toggleAll = (visibleIds: string[]) => {
        setSelected(selected.length === visibleIds.length ? [] : visibleIds);
    };

    const handleDelete = async () => {
        try {
            await Promise.all(selected.map(id => adminApi.delete(`${path}/${id}`)));
            setSelected([]);
            fetchItems();
        } catch (err) {
            console.error('Delete error:', err);
        }
    };

    return { items, selected, setSelected, loading, isRefreshing, fetchItems, refreshData, handleCheckbox, toggleAll, handleDelete };
}

// Extracts a human readable message from an axios-style error without using `any`.
export function getErrorMessage(err: unknown, fallback = 'Something went wrong'): string {
    const data = (err as { response?: { data?: { error?: string; details?: { message: string }[] } } })?.response?.data;
    if (data?.details?.length) return data.details.map(d => d.message).join(', ');
    return data?.error || fallback;
}
