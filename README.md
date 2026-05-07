# SwampGame Client

Telegram Mini App (TMA) frontend for SwampGame -- a multiplayer card game played inside Telegram.

## Links

- Bot: [@cryptoswampbot](https://t.me/cryptoswampbot)
- Backend repo: [ASVolokitin/swampgame_server](https://github.com/ASVolokitin/swampgame_server)



## Stack

- **React 19** + TypeScript, Vite, Tailwind CSS v4
- **Redux Toolkit** for state management
- **STOMP over SockJS** for real-time game and lobby events
- **Telegram Apps SDK** for TMA integration
- **Bun** as package manager

## Features

- Browse and create game lobbies
- Real-time lobby waiting room and in-game table via WebSocket
- Leaderboard per game
- Friends list and friend requests
- User profiles with Telegram profile photos
- In-game shop

## Getting Started

```bash
bun install
bun run dev
```

### Environment Variables

Copy `.env.development` and adjust as needed:

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | REST API base URL |
| `VITE_API_WS_URL` | WebSocket endpoint |

## Scripts

| Command | Description |
|---|---|
| `bun run dev` | Start dev server |
| `bun run build` | Type-check and build for production |
| `bun run lint` | Run ESLint |
| `bun run preview` | Preview production build |
