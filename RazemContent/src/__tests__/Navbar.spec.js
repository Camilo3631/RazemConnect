import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { createRouter, createWebHistory } from "vue-router";
import Navbar from '../components/Navbar.vue'


const router = createRouter({
    history: createWebHistory(),
    routes: [
       { path: '/', component: { template: '<div>Home</div>' } },
       { path: '/login', component: { template: '<div>Login</div>'} },
       { path: '/register', component: { template: '<div>Register</div>'} }
    ]
})

describe('Navbar', () => {
    it ('renders navbar component', () => {
       const wrapper = mount(Navbar, {
         global: {
            plugins: [router]
         }
       })
       expect(wrapper.find('nav').exists()).toBe(true)
    })

    it('menu is closed by default', () => {
        const wrapper = mount(Navbar, {
          global: {
            plugins: [router]
          }
       })
       expect(wrapper.find('.absolute').exists()).toBe(false)
    })

    it ('opens menu on button click', async () => {
        const wrapper = mount(Navbar, {
            global: {
                plugins: [router]
            }
        })
        await wrapper.find('button').trigger('click')
        expect(wrapper.find('.absolute').exists()).toBe(true)
    })

    it ('closes menu when clicking login link', async () => {
        const wrapper = mount(Navbar, {
            global: {
                plugins: [router]
            }
        })
        await wrapper.find('button').trigger('click')
        expect(wrapper.find('.absolute').exists()).toBe(true)
        const loginLink = wrapper.find('a[href="/login"]')
        await loginLink.trigger('click')
        expect(wrapper.find('.absolute').exists()).toBe(false)
    })

     it('displays login and register links', async () => {
        const wrapper = mount(Navbar, {
            global: {
                plugins: [router]
            }
        }) 
        await wrapper.find('button').trigger('click')
        expect(wrapper.text()).toContain('Iniciar sesión')
        expect(wrapper.text()).toContain('Crear cuenta')     
    })
})




