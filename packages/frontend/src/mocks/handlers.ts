import { http, HttpResponse } from 'msw';

export const handlers = [
  http.post('/api/auth/guest-login', () => {
    const response = {
      userId: 'randomUserId',
      usid: 'uniqueUserSessionId',
    };

    return HttpResponse.json(response, { status: 200 });
  }),

  http.post('/api/createRoom', async ({ request }) => {
    const { usid } = await request.json();

    const response = {
      gsid: 'uniqueGameSessionId',
      isHost: true,
    };

    return HttpResponse.json(response, { status: 200 });
  }),

  http.post('/api/roomJoin', async ({ request }) => {
    const { gsid, userId } = await request.json();

    const response = {
      gsid,
      isHost: userId === 'hostUserId',
      chatHistory: [
        { userId: 'user1', message: 'Hello!' },
        { userId: 'user2', message: 'Hi there!' },
      ],
    };

    return HttpResponse.json(response, { status: 200 });
  }),
];
