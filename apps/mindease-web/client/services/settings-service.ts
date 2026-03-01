import { HTTPService } from "@mindease/services";
import { UserSettings } from "@mindease/models";
import { ISettingsService } from "./settings-service.interface";
import { toast } from "@mindease/design-system/components";

export class SettingsClientService implements ISettingsService {
  constructor(
    private readonly httpService: HTTPService
  ) { }

  async getById(id: string): Promise<UserSettings> {
    try {
      const data = await this.httpService.get<UserSettings>(`/api/settings/${id}`);
      return data;
    }
    catch (err) {
      console.error("Erro ao carregar configurações:", err);
      toast.error("Erro ao carregar configurações")
      throw err;
    }
  }

  async update(id: string, data: UserSettings): Promise<UserSettings> {
    try {
      const updatedData = await this.httpService.patch<UserSettings>(`/api/settings/${id}`, data);
      toast.success("Configurações atualizadas com sucesso")
      return updatedData;
    }
    catch (err) {
      console.error("Erro ao atualizar configurações:", err);
      toast.error("Erro ao atualizar configurações")
      throw err;
    }
  }
}
