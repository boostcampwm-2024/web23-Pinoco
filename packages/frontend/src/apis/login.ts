import instance from '@/apis/instance';

export async function getGuestLogin(userId: string) {
  const { data } = await instance.get(`/auth/guest-login`, {
    params: { userId },
  });
  return data;
}
