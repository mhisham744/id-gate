import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CommunicationService } from './communication.service';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/chat',
})
export class CommunicationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedUsers = new Map<string, string>(); // userId -> socketId

  constructor(private communicationService: CommunicationService) {}

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      this.connectedUsers.set(userId, client.id);
      client.join(`user:${userId}`);
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      this.connectedUsers.delete(userId);
    }
  }

  @SubscribeMessage('join_conversation')
  handleJoinConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ) {
    client.join(`conv:${data.conversationId}`);
  }

  @SubscribeMessage('leave_conversation')
  handleLeaveConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ) {
    client.leave(`conv:${data.conversationId}`);
  }

  @SubscribeMessage('send_message')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: {
      conversationId: string;
      type: string;
      content: string;
      senderType: string;
      senderDisplayName: string;
    },
  ) {
    const userId = client.handshake.query.userId as string;
    if (!userId) return;

    const message = await this.communicationService.sendMessage(userId, data.conversationId, {
      type: data.type,
      content: data.content,
      senderType: data.senderType,
      senderDisplayName: data.senderDisplayName,
    });

    // Broadcast to all participants in the conversation
    this.server.to(`conv:${data.conversationId}`).emit('new_message', message);
  }

  @SubscribeMessage('typing')
  handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string; isTyping: boolean },
  ) {
    const userId = client.handshake.query.userId as string;
    client.to(`conv:${data.conversationId}`).emit('user_typing', {
      userId,
      isTyping: data.isTyping,
    });
  }

  // Emit notification to specific user
  notifyUser(userId: string, event: string, data: any) {
    this.server.to(`user:${userId}`).emit(event, data);
  }
}
