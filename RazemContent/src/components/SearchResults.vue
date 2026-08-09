 <template>
  <div class="p-3 border-b border-slate-700">
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      type="text"
      placeholder="Buscar un chat..."
      class="w-full px-3 py-2 text-sm bg-slate-700 text-white placeholder-slate-400 rounded-lg border border-slate-600 focus:outline-none focus:border-blue-500"
      />
  </div>
</template>

<script setup>
defineProps({
 modelValue: {
   type: String,
   default: ''
 } 
})

defineEmits(['update:modelValue'])
</script>

