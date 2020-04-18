/*
 * @Description: 购物车同步的websocket通讯
 * @Author: 水痕
 * @Github: https://github.com/kuangshp
 * @Email: 332904234@qq.com
 * @Company: 
 * @Date: 2020-02-04 14:25:02
 * @LastEditors: 水痕
 * @LastEditTime: 2020-04-13 08:21:24
 * @FilePath: /order-mysql-api/src/gateway/cart/cart.gateway.ts
 */
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({ namespace: 'api/v1/cart' })
export class CartGateway {
  @WebSocketServer() wss: Server;

  @SubscribeMessage('addCart')
  handleMessage(_client: Socket, room: string): void {
    this.wss.emit('changeCard', room);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, room: string): void {
    client.join(room);
    console.log(room, '加入房间');
    client.emit('joinedRoom', room);
  }

  @SubscribeMessage('leaveRoom')
  handleRoomLeave(client: Socket, room: string): void {
    client.leave(room);
    client.emit('leftRoom', room);
  }
}
