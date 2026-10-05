import { useCallback, useEffect, useState } from 'react';
import { adminApi } from '../ui/utils/axios';

// Shared list/refresh/select/delete behaviour for the admin tables.
export function useAdminResource<T extends { id: string }>(path: string) {
    const [items, setItems] = useState<T[]>([]);
    const [selected, setSelected] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchItems = useCallback(async () => {
        // `loading` is only true for the initial load (it starts true). Re-fetches after
        // a save/delete keep the table mounted, so focus can return to the button
        // that opened the modal and the page does not flash a full-screen spinner.
        try {
            const res = await adminApi.get<T[]>(path);
            setItems(res.data);
        } catch (err) {
            setError(getErrorMessage(err, 'Could not load data. Check your connection and refresh.'));
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

    // Deletes each selected item independently so one failure does not hide the
    // others, then re-syncs the list with the server either way.
    const handleDelete = async () => {
        setError(null);
        const ids = [...selected];
        const results = await Promise.allSettled(ids.map(id => adminApi.delete(`${path}/${id}`)));
        const failedIds = ids.filter((_, i) => results[i].status === 'rejected');
        setSelected(failedIds);
        if (failedIds.length > 0) {
            const firstFailure = results.find(r => r.status === 'rejected') as PromiseRejectedResult;
            setError(
                `${failedIds.length} of ${ids.length} item(s) could not be deleted: ` +
                getErrorMessage(firstFailure.reason, 'request failed')
            );
        }
        await fetchItems();
    };

    const clearError = () => setError(null);

    return { items, selected, setSelected, loading, isRefreshing, error, clearError, fetchItems, refreshData, handleCheckbox, toggleAll, handleDelete };
}

// Extracts a human readable message from an axios-style error without using `any`.
export function getErrorMessage(err: unknown, fallback = 'Something went wrong'): string {
    const data = (err as { response?: { data?: { error?: string; details?: { message: string }[] } } })?.response?.data;
    if (data?.details?.length) return data.details.map(d => d.message).join(', ');
    return data?.error || fallback;
}
