import { Socket } from 'socket.io';
import { ISignalingLogType, ILogData } from '@/types/signaling.types';

const icons = {
  [ISignalingLogType.offer]: '📢',
  [ISignalingLogType.answer]: '🔗',
  [ISignalingLogType.candidate]: '🔍',
  [ISignalingLogType.joined]: '👥',
  [ISignalingLogType.left]: '👋',
  [ISignalingLogType.error]: '❌',
  [ISignalingLogType.createRoom]: '🎮',
  [ISignalingLogType.joinRoom]: '🚪',
};

export const formatLogMessage = (logData: ILogData) => {
  const prefix = logData.isClient ? '[Client]' : '[Server]';
  const icon = icons[logData.type as keyof typeof icons] || '❓';
  return logData.gsid
    ? `${prefix}[${icon}] ${logData.type}: from ${logData.from} to ${logData.to} (room: ${logData.gsid})`
    : `${prefix}[${icon}] ${logData.type}: from ${logData.from} to ${logData.to}`;
};

const handleLog = (socket: Socket, logData: ILogData) => {
  // 서버 자체 로그
  const serverLog = () => {
    console.log(formatLogMessage({ ...logData, isClient: false }));
  };

  // 클라이언트 로그 수신
  socket.on('client_log', () => {
    console.log(formatLogMessage(logData));
  });

  return serverLog;
};

export default handleLog;
