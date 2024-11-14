import instance from '@/apis/instance';

export const postGuestLogin = async () => {
  const { data } = await instance.post('/guest_login');
  return data;
};
