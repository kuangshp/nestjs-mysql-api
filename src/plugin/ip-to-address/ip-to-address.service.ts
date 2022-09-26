import { Injectable } from '@nestjs/common';
import { config } from '@src/main';
import axios from 'axios';

export interface IPAddress {
  /**国家 */
  nation: string;
  /**省份 */
  province: string;
  /**城市 */
  city: string;
  /**地区 */
  district: string;
  /**行政区划代码 */
  adcode: string;
}
@Injectable()
export class IpToAddressService {
  // constructor(private readonly configService: ConfigService) {}

  public async getAddress(ip: string): Promise<IPAddress> {
    // TODO 这里使用const configService = new ConfigService()获取不到数据，只能这样获取环境变量
    // 主要是直接在实体类中使用要使用new的方式
    const lbsKey: string = config.lbsKey!;
    console.log(lbsKey, '密钥');
    const url = `https://apis.map.qq.com/ws/location/v1/ip?key=${lbsKey}&ip=${ip}`;
    const { data } = await axios.get(url);
    if (data.status === 0) {
      const {
        result: { ad_info },
      } = data || {};
      return {
        nation: ad_info.nation,
        province: ad_info.province,
        city: ad_info.city,
        district: ad_info.district,
        adcode: ad_info.adcode,
      };
    } else {
      return {
        nation: '',
        province: '',
        city: '',
        district: '',
        adcode: '',
      };
    }
  }
}
