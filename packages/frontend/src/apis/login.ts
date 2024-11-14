import instance from '@/apis/instance';

export async function postGuestLogin() {
  const { data } = await instance.post('/api/auth/guest-login');
  return data;
}
