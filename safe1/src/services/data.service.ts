import { dataUrl } from '@/api/url';
import HttpService from '@/services/http.service';
import Building from '@/models/buildings';
import User from '@/models/users';

class DataService {
  createUser(payload: User): Promise<User | void> {
    return HttpService.post(`${dataUrl}/createUser`, payload)
      .then(response => response.json())
      .then(json => json as User)
      .catch(err => console.error(err));
  }

  createBuilding(payload: Building): Promise<Building | void> {
    return HttpService.post(`${dataUrl}/createBuilding`, payload)
      .then(response => response.json())
      .then(json => json as Building)
      .catch(err => console.error(err));
  }

  ping() {
    HttpService.get(`${dataUrl}/ping`)
      .then(response => response.text())
      .then(text => console.log(text))
      .catch(err => console.error(err));
  }
};

export default new DataService();