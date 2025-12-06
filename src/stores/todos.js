import { defineStore } from "pinia"

export const useTodos = defineStore('useTodos', {
  state: () => ({
    nextId: 0,
    todos: [],
  }),
  getters: {
    pendingTodos: (state) => {
      return state.todos.filter(todo => !todo.isCompleted)
    },
    completedTodos: (state) => {
      return state.todos.filter(todo => todo.isCompleted)
    }
  },
  actions: {
    storeTodo(payload) {
      this.todos.push({ id: this.nextId++, text: payload.text, date: payload.date || null, isCompleted: false })
    },
    updateTodo(payload) {
      const index = this.todos.findIndex(item => item.id == payload.id)
      if (index != -1) {
        const updatedTodo = { 
          ...this.todos[index], 
          text: payload.text, 
          date: payload.date, 
          isCompleted: payload.isCompleted 
        }
        // Jika todo di-mark sebagai completed, simpan tanggal completion
        if (payload.isCompleted) {
          updatedTodo.completedDate = new Date().toISOString().split('T')[0]
        }
        this.todos[index] = updatedTodo
      }
    },
    destroyTodo(id) {
      const index = this.todos.findIndex(item => item.id == id)

      if (index > -1 && index < this.todos.length) {
        this.todos.splice(index, 1)
      }
    }
  },
})
