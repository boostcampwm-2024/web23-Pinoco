import instance from '@/apis/instance';

export async function postGuestLogin() {
  const { data } = await instance.post('/guest_login');
  return data;
}
