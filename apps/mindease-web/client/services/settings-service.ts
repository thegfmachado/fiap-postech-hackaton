import { HTTPService } from "@mindease/services";
import { Settings } from "@mindease/models";
import { ISettingsService } from "./settings-service.interface";
import { toast } from "@mindease/design-system/components";

export class SettingsClientService implements ISettingsService {
  constructor(
    private readonly httpService: HTTPService
  ) { }

  async getById(id: string): Promise<Settings> {
    try {
      const data = await this.httpService.get<Settings>(`/api/settings/${id}`);
      return data;
    }
    catch (err) {
      console.error("Erro ao carregar configurações:", err);
      toast.error("Erro ao carregar configurações")
      throw err;
    }
  }

  async update(id: string, data: Settings): Promise<Settings> {
    try {
      const updatedData = await this.httpService.patch<Settings>(`/api/settings/${id}`, data);
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
