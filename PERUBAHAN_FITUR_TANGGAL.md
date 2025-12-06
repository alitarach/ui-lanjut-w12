# Dokumentasi Perubahan: Fitur Pilih Tanggal

## Ringkasan
Menambahkan fitur pemilihan tanggal pada aplikasi Todo List dengan 2 jenis tanggal:
1. **Tanggal Todo** (`date`): Tanggal yang dipilih saat membuat todo (ditampilkan di halaman Todo)
2. **Tanggal Completion** (`completedDate`): Tanggal ketika todo di-mark sebagai completed (ditampilkan di halaman Completed)

---

## File yang Diubah

### 1. `src/stores/todos.js`

#### Perubahan di Action `storeTodo` (Baris 17-18)
**Sebelum:**
```javascript
storeTodo(payload) {
  this.todos.push({ id: this.nextId++, text: payload.text, isCompleted: false })
}
```

**Sesudah:**
```javascript
storeTodo(payload) {
  this.todos.push({ id: this.nextId++, text: payload.text, date: payload.date || null, isCompleted: false })
}
```

**Penjelasan:** Menambahkan field `date` untuk menyimpan tanggal yang dipilih saat membuat todo.

---

#### Perubahan di Action `updateTodo` (Baris 20-34)
**Sebelum:**
```javascript
updateTodo(payload) {
  const index = this.todos.findIndex(item => item.id == payload.id)
  if (index != -1) {
    this.todos[index] = { ...this.todos[index], text: payload.text, isCompleted: payload.isCompleted }
  }
}
```

**Sesudah:**
```javascript
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
}
```

**Penjelasan:** 
- Menambahkan field `date` pada update
- Menambahkan logika untuk menyimpan `completedDate` (tanggal hari ini) ketika todo di-mark sebagai completed
- Format tanggal: `YYYY-MM-DD` (ISO format)

---

### 2. `src/views/Todo.vue`

#### Perubahan di Template - Form Input (Baris 3-6)
**Sebelum:**
```vue
<form @submit.prevent="storeTodo(todo)">
  <input v-model="todo.text" type="text" name="text" />
  <button :disabled="!todo.text" type="submit" style="margin: 0 8px;">Add</button>
</form>
```

**Sesudah:**
```vue
<form @submit.prevent="handleStoreTodo(todo)">
  <input v-model="todo.text" type="text" name="text" placeholder="" />
  <input v-model="todo.date" type="date" name="date" style="margin: 0 8px;" />
  <button :disabled="!todo.text" type="submit" style="margin: 0 8px;">Add</button>
</form>
```

**Penjelasan:** 
- Menambahkan input date picker (`type="date"`)
- Mengubah event handler dari `storeTodo` menjadi `handleStoreTodo`

---

#### Perubahan di Template - List Item (Baris 10-14)
**Sebelum:**
```vue
<li v-for="pendingTodo in pendingTodos" :key="pendingTodo.id" style="margin: 8px 0">
  <span style="margin: 0 8px;">{{ pendingTodo.text }}</span>
  <button @click="updateTodo({ ...pendingTodo, isCompleted: true})" style="margin: 0 4px;">✅</button>
  <button @click="destroyTodo(pendingTodo.id)">❌</button>
</li>
```

**Sesudah:**
```vue
<li v-for="pendingTodo in pendingTodos" :key="pendingTodo.id" style="margin: 8px 0">
  <span style="margin: 0 8px;">{{ pendingTodo.text }}</span>
  <span v-if="pendingTodo.date" style="margin: 0 8px; color: #666; font-size: 0.9em;">📅 {{ formatDate(pendingTodo.date) }}</span>
  <button @click="updateTodo({ ...pendingTodo, isCompleted: true})" style="margin: 0 4px;">✅</button>
  <button @click="destroyTodo(pendingTodo.id)">❌</button>
</li>
```

**Penjelasan:** Menambahkan tampilan tanggal todo (jika ada) dengan format yang sudah diformat.

---

#### Perubahan di Data (Baris 24-31)
**Sebelum:**
```javascript
data: () => ({
  todo: {
    id: null,
    text: null,
    isCompleted: false
  }
}),
```

**Sesudah:**
```javascript
data: () => ({
  todo: {
    id: null,
    text: null,
    date: null,
    isCompleted: false
  }
}),
```

**Penjelasan:** Menambahkan field `date: null` pada data todo.

---

#### Perubahan di Methods (Baris 39-63)
**Sebelum:**
```javascript
methods: {
  ...mapActions(useTodos, [
    'storeTodo',
    'updateTodo',
    'destroyTodo'
  ]),
}
```

**Sesudah:**
```javascript
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
```

**Penjelasan:** 
- Menambahkan method `formatDate()` untuk memformat tanggal ke format Indonesia (contoh: "Rab, 10 Des 2025")
- Menambahkan method `handleStoreTodo()` untuk menyimpan todo dan reset form setelah submit

---

### 3. `src/views/Completed.vue`

#### Perubahan di Template - List Item (Baris 5-9)
**Sebelum:**
```vue
<li v-for="completedTodo in completedTodos" :key="completedTodo.id" style="margin: 8px 0">
  {{ completedTodo.text }}
</li>
```

**Sesudah:**
```vue
<li v-for="completedTodo in completedTodos" :key="completedTodo.id" style="margin: 8px 0">
  {{ completedTodo.text }}
  <span v-if="completedTodo.completedDate" style="margin: 0 8px; color: #666; font-size: 0.9em;">
    📅 Selesai: {{ formatDate(completedTodo.completedDate) }}
  </span>
</li>
```

**Penjelasan:** Menambahkan tampilan tanggal completion (tanggal ketika todo di-mark sebagai completed).

---

#### Perubahan di Methods (Baris 32-42)
**Sebelum:**
```javascript
export default {
  components: {
    HeaderBar,
    FooterBar,
  },
  computed: {
    ...mapState(useTodos, [
      'completedTodos'
    ])
  }
}
```

**Sesudah:**
```javascript
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
```

**Penjelasan:** Menambahkan method `formatDate()` untuk memformat tanggal completion ke format Indonesia.

---

## Ringkasan Perubahan

### Field Baru di Todo Object:
1. `date` - Tanggal yang dipilih saat membuat todo (opsional)
2. `completedDate` - Tanggal ketika todo di-mark sebagai completed (otomatis disimpan)

### Fitur Baru:
1. ✅ Input date picker di form tambah todo
2. ✅ Tampilan tanggal todo di halaman Todo (jika ada)
3. ✅ Tampilan tanggal completion di halaman Completed (tanggal saat klik button ✅)
4. ✅ Format tanggal Indonesia (contoh: "Rab, 10 Des 2025")

### Alur Kerja:
1. User membuat todo dengan memilih tanggal (opsional) → disimpan di field `date`
2. User klik button ✅ → tanggal hari ini disimpan di field `completedDate`
3. Di halaman Completed → yang ditampilkan adalah `completedDate` (bukan `date`)

---

## Catatan Penting
- Todo yang sudah completed sebelum fitur ini ditambahkan tidak akan memiliki `completedDate`, jadi tanggal tidak akan ditampilkan
- Todo baru yang di-complete setelah fitur ini akan memiliki `completedDate` dan tanggal akan ditampilkan
- Tanggal completion selalu menggunakan tanggal hari ini saat button ✅ diklik, bukan tanggal yang dipilih saat membuat todo


