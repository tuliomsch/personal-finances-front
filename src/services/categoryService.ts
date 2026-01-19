import { api } from "../lib/api";

interface CategoryData {
    id: number;
    name: string;
    icon: string;
    type: 'INCOME' | 'EXPENSE';
    parentId: number | null;
    subCategories?: CategoryData[];
}

export const categoryService = {
    async getCategories(userId: number) {
        const { data } = await api.get<CategoryData[]>(`/categories/user/${userId}`);
        return data;
    }
}