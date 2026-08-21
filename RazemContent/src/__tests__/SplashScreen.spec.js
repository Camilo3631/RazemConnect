import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import SplashScreen from "@/components/SplashScreen.vue";

describe('SplashScreen', () => {
  it('renders corrctly', () => {
    const wrapper = shallowMount(SplashScreen)

    expect(wrapper.find('img').exists()).toBe(true)
    expect(wrapper.find('img').attributes('alt')).toBe('principal')
    expect(wrapper.text()).toContain('RazemConnect')
  })
})