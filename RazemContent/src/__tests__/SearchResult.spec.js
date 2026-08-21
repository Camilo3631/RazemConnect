import { describe, it, expect } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import SearchResults from '@/components/SearchResults.vue';

describe('SearchResults', () => {
    it('renders the input', () => {
      const wrapper = shallowMount(SearchResults, {
        props: {
          modelValue: 'Daria'
        }
      })

      expect(wrapper.find('input').element.value).toBe('Daria')
    })

    it('emits update:modelValue when typing', async () => {
      const wrapper = shallowMount(SearchResults, {
        props: {
            modelValue: ''
        }
      })

      await wrapper.find('input').setValue('Daria')

      expect(wrapper.emitted('update:modelValue')).toEqual([
        ['Daria']
      ])
   })
})