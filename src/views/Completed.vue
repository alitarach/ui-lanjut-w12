<template>
    <h3>Completed ✅</h3>
    <div>
      <ul>
        <li v-for="completedTodo in completedTodos" :key="completedTodo.id" style="margin: 8px 0">
          {{ completedTodo.text }}
          <span v-if="completedTodo.completedDate" style="margin: 0 8px; color: #666; font-size: 0.9em;">
            📅 Selesai: {{ formatDate(completedTodo.completedDate) }}
          </span>
        </li>
      </ul>
    </div>
</template>

<script>
import { mapState } from 'pinia';
import { useTodos } from '@/stores/todos';

import HeaderBar from '@/components/Header.vue';
import FooterBar from '@/components/Footer.vue';

export default {
  components: {
    HeaderBar,
    FooterBar,
  },
  computed: {
    ...mapState(useTodos, [
      'completedTodos'
    ])
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('id-ID', { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  }
}
</script>
