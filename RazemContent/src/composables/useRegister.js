import { ref } from 'vue';
import { useRouter } from 'vue-router';

const useRegister = () => {
  const loading = ref(false);
  const error = ref(null);
  const success = ref(null);

  const router = useRouter();

  const register = async (username, email, password) => {
   loading.value = true;
   error.value = null;
   success.value = null;

   try {
     const response = await fetch(`${import.meta.env.VITE_API_URL}/api/register`, {
       method: 'POST',
       credentials: 'include',
       headers: {
         'Content-Type':  'application/json'
      },
      body: JSON.stringify({
       username,
       email,
       password
      })
    })

    const data = await response.json()

    if (!response.ok) {
       throw new Error(data.message || 'Error al registrarse')
    }

    success.value = data.message
    router.push('/login')

    return data
  } catch (err) {
    error.value = err.message
    throw err
     } finally {
       loading.value = false;
     }
    }

  return {
   loading,
    error,
    success,
    register
   }
}


export {useRegister}





