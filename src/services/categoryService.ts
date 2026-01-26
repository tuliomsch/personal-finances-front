import { api } from "../lib/api";

export interface Category {
    id: number;
    name: string;
    icon: string;
    type: 'INCOME' | 'EXPENSE';
    userId: number | null;
    parentId: number | null;
    subCategories?: Category[];
}

export interface CreateCategoryData {
    userId: number;
    name: string;
    icon: string;
    type: 'INCOME' | 'EXPENSE';
    parentId: number | null;
}

export const categoryService = {
    async getCategories(userId: number) {
        const { data } = await api.get<Category[]>(`/categories/user/${userId}`);
        return data;
    },

    async createCategory(categoryData: CreateCategoryData) {
        const { data } = await api.post<Category>('/categories', categoryData);
        return data;
    },

    async updateCategory(id: number, categoryData: Partial<CreateCategoryData>) {
        const { data } = await api.patch<Category>(`/categories/${id}`, categoryData);
        return data;
    },

    async deleteCategory(id: number) {
        const { data } = await api.delete(`/categories/${id}`);
        return data;
    }
}