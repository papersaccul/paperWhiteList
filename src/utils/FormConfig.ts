import fs from 'fs';
import path from 'path';
import { i18n } from './i18n';

interface FormResponseConfig {
    [guildId: string]: {
        channelId?: string;
        acceptRoleId?: string;
        rejectRoleId?: string;
    };
}

class ConfigManager {
    private static filePath = path.join(__dirname, '../cfg/FormResponseConfig.json');
    private static config: { formResponse?: FormResponseConfig } = {};

    static loadConfig(): void {
        try {
            if (fs.existsSync(this.filePath)) {
                this.config = JSON.parse(fs.readFileSync(this.filePath, 'utf8'));
            }
        } catch (error) {
            console.error(i18n.__("config.loadError"), error);
        }
    }

    static saveConfig(): void {
        try {
            fs.writeFileSync(this.filePath, JSON.stringify(this.config, null, 2), 'utf8');
        } catch (error) {
            console.error(i18n.__("config.saveError"), error);
        }
    }

    static getFormResponseConfig(guildId: string): { channelId?: string; acceptRoleId?: string; rejectRoleId?: string } | undefined {
        return this.config.formResponse?.[guildId];
    }

    static updateFormResponseConfig(guildId: string, configUpdate: Partial<{ channelId: string; acceptRoleId: string; rejectRoleId: string }>): void {
        if (!this.config.formResponse) {
            this.config.formResponse = {};
        }
        if (!this.config.formResponse[guildId]) {
            this.config.formResponse[guildId] = {};
        }
        this.config.formResponse[guildId] = {
            ...this.config.formResponse[guildId],
            ...configUpdate,
        };
        console.log(i18n.__("config.updateSuccess"), guildId, configUpdate);
        this.saveConfig();
    }
}

// init
ConfigManager.loadConfig();

export { ConfigManager };
