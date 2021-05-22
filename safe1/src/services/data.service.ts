import { dataUrl } from '@/api/url';
import HttpService from '@/services/http.service';
import { Building, Device, User } from '@/models';

class DataService {
  createUser(payload: User): Promise<User | null> {
    return HttpService.post(`${dataUrl}/createUser`, payload)
      .then(response => response.status === 200 ? response.json() : null)
      .then(json => json !== null ? json as User : null)
      .catch(err => { console.error(err); return null });
  }

  createBuilding(payload: Building): Promise<Building | null> {
    return HttpService.post(`${dataUrl}/createBuilding`, payload)
      .then(response => response.status === 200 ? response.json() : null)
      .then(json => json !== null ? json as Building : null)
      .catch(err => { console.error(err); return null });
  }

  getUserBuildings(payload: any): Promise<Building[] | null> {
    return HttpService.post(`${dataUrl}/getUserBuildings`, payload)
      .then(response => response.status === 200 ? response.json() : null)
      .then(json => json !== null ? json as Building[] : null)
      .catch(err => { console.error(err); return null });
  }

  updateDeviceProtection(payload: any): Promise<Device | null> {
    return HttpService.post(`${dataUrl}/updateDeviceProtection`, { deviceName: payload.name, protection: payload.protection })
      .then(response => response.status === 200 ? response.json() : null)
      .then(json => json !== null ? json as Device : null)
      .catch(err => { console.error(err); return null });
  }

  ping() {
    HttpService.get(`${dataUrl}/ping`)
      .then(response => response.text())
      .then(text => console.log(text))
      .catch(err => console.error(err));
  }
};

export default new DataService();