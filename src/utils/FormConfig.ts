import fs from 'fs';
import path from 'path';

interface FormResponseConfig {
    [guildId: string]: {
        channelId: string;
    };
}

class ConfigManager {
    private static filePath = path.join(__dirname, 'FormResponseConfig.json');
    private static config: { formResponse?: FormResponseConfig } = {};

    static loadConfig(): void {
        try {
            if (fs.existsSync(this.filePath)) {
                this.config = JSON.parse(fs.readFileSync(this.filePath, 'utf8'));
            }
        } catch (error) {
            console.error('Load config error:', error);
        }
    }

    static saveConfig(): void {
        try {
            fs.writeFileSync(this.filePath, JSON.stringify(this.config, null, 2), 'utf8');
        } catch (error) {
            console.error('Save config error:', error);
        }
    }

    static getFormResponseConfig(guildId: string): string | undefined {
        return this.config.formResponse?.[guildId]?.channelId;
    }

    static setFormResponseConfig(guildId: string, channelId: string): void {
        if (!this.config.formResponse) {
            this.config.formResponse = {};
        }
        if (this.config.formResponse[guildId]) {
            console.log(`Update guildId: ${guildId} channelId: ${channelId}`);
        } else {
            console.log(`Create guildId: ${guildId} с channelId: ${channelId}`);
        }
        this.config.formResponse[guildId] = { channelId };
        this.saveConfig();
    }
}

// init
ConfigManager.loadConfig();

export { ConfigManager };
