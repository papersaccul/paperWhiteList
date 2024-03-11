import i18n from "i18n";
import { join } from "path";
import * as dotenv from 'dotenv';

dotenv.config();

i18n.configure({
  locales: [
    "en",
    "ru",
    "ua"
  ],
  directory: join(__dirname, "..", "locales"),
  defaultLocale: "en",
  retryInDefaultLocale: true,
  objectNotation: true,
  register: global,

  logWarnFn: function (msg: string) {
    console.log("Предупреждение локализации:", msg);
  },

  logErrorFn: function (msg: string) {
    console.log("Ошибка локализации:", msg);
  },

  missingKeyFn: function (locale: string, value: string) {
    console.log(`Отсутствует ключ '${value}' для локали '${locale}'`);
    return value;
  },

  mustacheConfig: {
    tags: ["{{", "}}"],
    disable: false
  }
});

i18n.setLocale(process.env.LOCALE ? process.env.LOCALE : "en");

export { i18n };
