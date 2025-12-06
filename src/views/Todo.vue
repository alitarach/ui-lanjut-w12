<template>
  <h3>To-Do ⏳</h3>
  <form @submit.prevent="handleStoreTodo(todo)">
    <input v-model="todo.text" type="text" name="text" placeholder="" />
    <input v-model="todo.date" type="date" name="date" style="margin: 0 8px;" />
    <button :disabled="!todo.text" type="submit" style="margin: 0 8px;">Add</button>
  </form>
  <div>
    <ul>
      <li v-for="pendingTodo in pendingTodos" :key="pendingTodo.id" style="margin: 8px 0">
        <span style="margin: 0 8px;">{{ pendingTodo.text }}</span>
        <span v-if="pendingTodo.date" style="margin: 0 8px; color: #666; font-size: 0.9em;">📅 {{ formatDate(pendingTodo.date) }}</span>
        <button @click="updateTodo({ ...pendingTodo, isCompleted: true})" style="margin: 0 4px;">✅</button>
        <button @click="destroyTodo(pendingTodo.id)">❌</button>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapActions, mapState } from 'pinia';
import { useTodos } from '@/stores/todos';

export default {
  data: () => ({
    todo: {
      id: null,
      text: null,
      date: null,
      isCompleted: false
    }
  }),
  computed: {
    ...mapState(useTodos, [
      'pendingTodos',
      'completedTodos'
    ])
  },
  methods: {
    ...mapActions(useTodos, [
      'storeTodo',
      'updateTodo',
      'destroyTodo'
    ]),
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('id-ID', { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    },
    handleStoreTodo(todo) {
      this.storeTodo(todo);
      this.todo = {
        id: null,
        text: null,
        date: null,
        isCompleted: false
      };
    }
  }
}
</script>
