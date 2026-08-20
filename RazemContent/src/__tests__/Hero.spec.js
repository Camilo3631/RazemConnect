import { shallowMount } from "@vue/test-utils";
import { it ,describe, expect } from "vitest";
import Hero from "@/components/Hero.vue";

describe('Hero', () => {
    it('renders the title', () => {
      const wrapper = shallowMount(Hero)

      expect(wrapper.text()).toContain('RazemContent')
    })

    it('renders the description', () => {
     const wrapper = shallowMount(Hero)

     expect(wrapper.text()).toContain(
     'Comunicación en tiempo real, simple y segura.'
     )
   })
})

