import instance from '@/apis/instance';

export async function postGuestLogin() {
  const { data } = await instance.get('/auth/guest-login');
  return data;
}
