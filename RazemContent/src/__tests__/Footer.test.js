import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils"
import Footer from "../components/Footer.vue";

describe('Footer', () => {
    it('renders footer component', () => {
        const wrapper = mount(Footer)
        expect(wrapper.find('footer').exists()).toBe(true)
    })

    it('displays copyright text', () => {
        const wrapper = mount(Footer)
        expect(wrapper.text()).toContain('© 2026 RazemContent')
    })

    it('renders social media links', () => {
        const wrapper = mount(Footer)
        const socialLinks = wrapper.findAll('a')
        expect(socialLinks.length).toBe(2)
    })

    it ('has correct aria labels', () => {
        const wrapper = mount(Footer)
        const socialLinks = wrapper.findAll('a')
        expect(socialLinks[0].attributes('aria-label')).toBe('X')
        expect(socialLinks[1].attributes('aria-label')).toBe('Instagram')   
    })
})






