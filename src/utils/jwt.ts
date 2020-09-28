import NodeSSO from 'node-sso';

class JWT {
  private nodeSSO: NodeSSO;
  constructor (secret: string) {
    this.nodeSSO = new NodeSSO(secret);
  }

  /**
   * @Author: 水痕
   * @Date: 2020-07-10 13:09:59
   * @LastEditors: 水痕
   * @Description: 根据用户id生成一个token
   * @param {type} 
   * @return: 
   */
  public createToken(user: string | object): string {
    return this.nodeSSO.generateToken(user);
  }

  /**
   * @Author: 水痕
   * @Date: 2020-07-10 13:12:59
   * @LastEditors: 水痕
   * @Description: 解析token返回token中的用户信息
   * @param {type} 
   * @return: 
   */
  public decodeToken(token: string): string | null {
    return this.nodeSSO.decryptToken(token);
  }

}

export const jwt = new JWT(process.env.SECRET);