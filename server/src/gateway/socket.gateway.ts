import { UserService } from 'src/routes/user/user.service';
import {
  WebSocketGateway,
  OnGatewayConnection,
  WebSocketServer,
  SubscribeMessage,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/routes/auth/auth.service';
import { MessageService } from 'src/routes/message/message.service';
import { UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { WsExceptionFilter } from 'src/filters/web-socket.filter';
import { MessageDto, RoomDto } from 'src/routes/message/dto/req.dto';

interface CustomSocket extends Socket {
  userId: string;
  username: string;
}

@WebSocketGateway(3001, { cors: { origin: '*' } })
@UseFilters(new WsExceptionFilter())
@UsePipes(
  new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }),
)
export class SocketGateway implements OnGatewayConnection {
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private messageService: MessageService,
  ) {}
  @WebSocketServer()
  server: Server;

  async handleConnection(client: CustomSocket) {
    const token = client.handshake.query.token as string;
    if (!token) {
      client.emit('error', 'No token provided');
      client.disconnect();
      return;
    }
    let decodedToken: any;
    try {
      decodedToken = await this.authService.validateToken(token);
    } catch (error) {
      client.emit('error', 'token expired');
      client.disconnect();
      return;
    }
    const user = await this.userService.findOne(decodedToken.id);
    if (!user) {
      client.emit('error', 'Unauthorized client connection');
      client.disconnect();
    }
    client.userId = user.id;
    client.username = user.username;
    console.log(`${client.username} connected, ID: ${client.userId}`);
  }

  handleDisconnect(client: CustomSocket) {
    console.log(
      `Client disconnected: ${client.id} (User ID: ${client.userId})`,
    );
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(client: CustomSocket, room: RoomDto): Promise<void> {
    const user = await this.userService.findOne(client.userId, ['plans']);

    const plan = user.plans.find((plan) => plan.id === room.id);
    if (!plan) {
      throw new WsException('You do not have access to this room.');
    }

    client.join(room.id);
    client.emit('joinedRoom', `Joined room: ${room.id}`);
    console.log(
      `Client ${client.id} (User ID: ${client.userId}) joined room ${room.id}`,
    );
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(client: CustomSocket, room: RoomDto): void {
    client.leave(room.id);
    console.log(
      `Client ${client.id} (User ID: ${client.userId}) left room ${room.id}`,
    );
  }

  @SubscribeMessage('whoIsOnline')
  handleWhoIsOnline(client: CustomSocket, room: RoomDto): void {
    const clientsInRoom = this.server.sockets.adapter.rooms.get(room.id);
    if (clientsInRoom) {
      const clientIds = Array.from(clientsInRoom).map((clientId) => {
        const socket = this.server.sockets.sockets.get(
          clientId,
        ) as CustomSocket;
        return {
          socketId: clientId,
          userId: socket?.userId,
          username: socket?.username,
        };
      });

      // Use reduce to filter out duplicate elements
      const filteredClientIds = clientIds.reduce((acc, client) => {
        const exists = acc.some(
          (item) =>
            item.userId === client.userId && item.username === client.username,
        );
        if (!exists) {
          acc.push(client);
        }
        return acc;
      }, []);

      client.emit('onlineUsers', filteredClientIds);
    } else {
      client.emit('onlineUsers', []);
    }
  }

  @SubscribeMessage('message')
  async handleMessage(client: CustomSocket, data: MessageDto): Promise<void> {
    if (!client.rooms.has(data.roomId)) {
      client.emit('error', 'You are not in the specified room');
      return;
    }
    try {
      await this.messageService.addMessage(
        client.userId,
        data.roomId,
        data.content,
      );
      // emit message\
      const message = {
        userId: client.userId,
        username: client.username,
        content: data.content,
        roomId: data.roomId,
        timestamp: new Date(),
      };
      console.log(data.content);
      this.server.to(data.roomId).emit('message', message);
    } catch (error) {
      client.emit('error', 'unexpected error');
      client.disconnect();
      console.log(error);
      return;
    }
  }
}
