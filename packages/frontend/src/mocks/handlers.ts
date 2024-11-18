import { http, HttpResponse } from 'msw';

export const handlers = [
  http.post('/api/auth/guest-login', () => {
    const response = {
      userId: 'randomUserId',
      usid: 'uniqueUserSessionId',
    };

    return HttpResponse.json(response, { status: 200 });
  }),
];
