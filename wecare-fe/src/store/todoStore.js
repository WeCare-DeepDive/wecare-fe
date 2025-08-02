import { create } from 'zustand';

const useTodoStore = create((set) => ({
    todoId: null,
    setTodoId: (todoId) => set({ todoId }),
    resetTodoId: () => set({ todoId: null }),
}));

export default useTodoStore;