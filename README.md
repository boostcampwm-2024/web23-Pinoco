<div align="center">
<img src="https://github.com/user-attachments/assets/28d2325e-817d-476a-83a5-405ecba0e0b7" width="200" height="200" alt="Pinoco Logo">
  
<h3>🤥 피노코인가, 제페토인가? 실시간 화상 통화로 진행하는 라이어 게임</h3>
<p>#WebRTC #OpenVidu #NestJS #OAuth2.0</p>
<a href="https://www.pinoco.shop/">Pinoco</a>
<br>
<br>

<div align="center">
    <img src="https://img.shields.io/badge/NestJS-E0234E?logo=NestJS&logoColor=white">
    <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white">
    <img src="https://img.shields.io/badge/MySQL-4479A1?logo=MySQL&logoColor=white"/>   
    <img src="https://img.shields.io/badge/OpenVidu-FF5722?logo=WebRTC&logoColor=white"> 
    <br>
    <img src="https://img.shields.io/badge/React-61DAFB?logo=React&logoColor=white">
    <img src="https://img.shields.io/badge/TailwindCSS-06B6D4?logo=tailwindcss&logoColor=white">
    <img src="https://img.shields.io/badge/WebRTC-333333?logo=WebRTC&logoColor=white">
    <img src="https://img.shields.io/badge/Docker-2496ED?logo=Docker&logoColor=white"> 
    <img src="https://img.shields.io/badge/NGINX-009639?logo=Nginx&logoColor=white"> 
</div>
<br>
</div>

---

# 🪴 프로젝트 개요

**Pinoco(피노코)** 는 참가자들이 실시간 화상 통화를 통해 “피노코(라이어)”를 추리하는 웹 게임 애플리케이션 입니다. **WebRTC**와 **OpenVidu**을 활용하여 참가자가 서로의 얼굴과 목소리를 듣고 피노코를 추리하며 게임을 즐길 수 있습니다 🕹️

---

# 🔎 주요 기능

### 📹 실시간 화상 게임

- WebRTC를 통해 원활한 실시간 화상 채팅 기능을 제공합니다.
- 참가자들은 서로의 화면을 보면서 게임에 몰입할 수 있습니다.

### 🔑 로그인 및 방 관리

- 회원 및 비회원 모두 방 생성/참가 기능을 통해 게임을 즐길 수 있습니다.

### 💬 실시간 채팅

- 게임 중 실시간 채팅이 가능하며, 필요한 경우 텍스트로도 소통할 수 있습니다.

### 🤹🏻 게임 진행 관리

- 게임이 진행되는 동안 라운드 관리, 투표, 결과 화면 등 다양한 요소를 통해 몰입감을 제공합니다.

---

# 📺 스크린샷 및 시연(미완)

### 👋 랜딩 페이지(로그인)

![스크린샷 2024-11-13 오후 5 51 06](https://github.com/user-attachments/assets/0b8b2ae2-83eb-4ba2-bade-ba5922203656)



### 🚪로비 페이지(게임 생성 및 참가)

![스크린샷 2024-11-13 오후 5 51 11](https://github.com/user-attachments/assets/6b90746b-d9f6-4857-b357-4d5c7b7a5a6c)

![스크린샷 2024-11-13 오후 5 51 19](https://github.com/user-attachments/assets/c11b10cb-3e30-45e4-9de1-e84ad29439c8)


### 🎮 게임 페이지

![스크린샷 2024-11-13 오후 5 51 36](https://github.com/user-attachments/assets/11a9d058-add1-4235-bbad-5f52ccd7b5d1)



# 🗂️ 프로젝트 구조

```js
└── 📁pinoco
    └── 📁.github
    └── 📁packages
        └── 📁backend
            └── 📁gameserver
                └── 📁src
                    └── 📁game
                        └── game.controller.ts
                        └── game.module.ts
                        └── game.service.ts
                    └── app.controller.ts
                    └── app.module.ts
                    └── app.service.ts
                    └── main.ts
                └── package.json
                └── README.md
            └── package.json
        └── 📁frontend
            └── 📁src
                └── 📁components
                    └── 📁common
                        └── Button.tsx
                        └── Modal.tsx
                    └── 📁gamePage
                        └── LeftGameSection.tsx
                        └── RightGameSection.tsx
                        └── VideoStream.tsx
                    └── 📁landingPage
                        └── OAuthLoginButton.tsx
                    └── 📁layout
                        └── Layout.tsx
                    └── 📁lobbyPage
                        └── RoomCreationButton.tsx
                └── 📁hooks
                    └── useMediaStream.ts
                    └── useModal.ts
                └── 📁pages
                    └── 📁gamePage
                        └── index.tsx
                    └── 📁landingPage
                        └── index.tsx
                    └── 📁lobbyPage
                        └── index.tsx
                └── 📁routes
                    └── router.tsx
                └── 📁states
                    └── 📁mutations
                    └── 📁store
                └── 📁utils
                └── App.tsx
                └── main.tsx
            └── package.json
            └── README.md
    └── .gitignore
    └── .eslintrc.js
    └── .prettierrc
    └── package.json
    └── README.md
    └── tsconfig.base.json
```

---

# 🤼 팀원 소개

|                                                        김태윤                                                        |                                                        민경준                                                        |                                                         이찬                                                         |                                                        한영준                                                        |
| :------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------: |
| <img src="https://github.com/user-attachments/assets/168b4e02-f4c7-4be0-b572-f0ec9dcc09e9" width="120" height="120"> | <img src="https://github.com/user-attachments/assets/42cd6c8a-7ab1-4630-86c6-b4f25f5812a5" width="120" height="120"> | <img src="https://github.com/user-attachments/assets/3bc958ec-4303-4559-b20e-465fe1776e17" width="120" height="120"> | <img src="https://github.com/user-attachments/assets/a0c2bfa9-7894-4b3b-9f69-474894008180" width="120" height="120"> |
|                                                     **Frontend**                                                     |                                                     **Backend**                                                      |                                                     **Frontend**                                                     |                                                     **Frontend**                                                     |
|                                      [@Cllaude99](https://github.com/Cllaude99)                                      |                                          [@mssak](https://github.com/mssak)                                          |                                 [@today-is-first](https://github.com/today-is-first)                                 |                                  [@zizonyoungjun](https://github.com/zizonyoungjun)                                  |

---

# 🤝 협업 전략

- [브랜치 전략](https://lush-collision-539.notion.site/Git-Branch-130b0f9caa69814f95dbebfc2a63ea41?pvs=4)
- [컨벤션](https://lush-collision-539.notion.site/Convention-130b0f9caa69813a9a0ef87bb207203b?pvs=4)
- [그라운드 룰](https://lush-collision-539.notion.site/130b0f9caa6981159bf8dab49f4981df?pvs=4)

---

# 📙 Pinoco(피노코) 게임 규칙

### 게임 규칙

1. **주제 및 제시어 설정**
   - 주제는 모든 참가자에게 공개되며, 제페토에게는 주제에 관련된 제시어가 제공됩니다.
   - 피노코는 제시어를 알지 못한 채 자신이 피노코임을 통보받습니다.
2. **턴 진행**
   - 각 참가자는 본인의 턴에 30초 동안 주제에 맞는 제시어에 대한 설명을 하여 자신이 제페토임을 증명하려고 합니다.
   - 피노코는 제시어를 알지 못하므로 다른 참가자들의 설명을 바탕으로 제시어를 추론하여 최대한 자연스럽게 설명을 시도합니다.
3. **투표**
   - 라운드가 끝나면 60초 동안 투표가 진행되며, 참가자들은 피노코가 누구인지 토론할 수 있습니다.
   - 각 참가자는 피노코라고 생각하는 사람에게 투표합니다.
4. **승리 조건**
   - 남은 인원이 2명이 될 때까지 제페토들이 피노코를 찾아내지 못하면 **피노코 승리**로 게임이 종료됩니다.
   - 제페토가 투표를 통해 피노코를 찾아내면 **피노코에게 최후의 기회**가 주어집니다.
     - 이때, 피노코는 제시어를 추측하여 정답을 타이핑으로 입력할 수 있습니다.
     - 피노코가 정답을 맞히면 **피노코 승리**이고, 맞히지 못하면 **제페토 승리**입니다.


---

# 🎨 와이어프레임

[Pinoco 와이어프레임 보기](https://www.figma.com/design/P48gH3lKlbN1tQ4oFeKzxP/Pinoco?node-id=0-1&t=nB2kZ5zjVasQxAIw-1)

---

<a href="https://lush-collision-539.notion.site/Pinoco-12fb0f9caa698078bcc1eeb19b3a301c?pvs=4">🤥 Team Pinoco 노션</a>
