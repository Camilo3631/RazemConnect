import { describe, it, expect, vi } from "vitest";
import { useRegister } from "@/composables/useRegister";


const push = vi.fn();

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push
  })
}))

describe(useRegister, () => {
  beforeEach(() => {
    vi.clearAllMocks();
    push.mockClear();
  });

  it('has the correct intial state', () => {
    const { loading, error, success } = useRegister();

    expect(loading.value).toBe(false);
    expect(error.value).toBe(null);
    expect(success.value).toBe(null);
  })

  it('register successfully and redirects to login', async () => {
    const { register, success} = useRegister();

    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ message: 'Usuario registrado exitosamente' })
    })

    await register('Camilo', 'camilo@test.com', '123456')

    expect(success.value).toBe('Usuario registrado exitosamente')
    expect(push).toHaveBeenCalledWith('/login')
  })

  it('handles register error', async () => {
    const { register, error} = useRegister()

    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      json: async () => ({ message: 'Ya existe una cuenta con ese email' })
    })

    await expect(
       register('Camilo', 'camilo@test.com', '123456')
    ).rejects.toThrow('Ya existe una cuenta con ese email')
   

    expect(error.value).toBe('Ya existe una cuenta con ese email')
    expect(push).not.toHaveBeenCalled()
  })
});
