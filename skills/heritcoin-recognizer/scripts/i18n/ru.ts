import type { LocaleContent } from "./en.ts";

export const ru: LocaleContent = {
  labels: {
    valuation: "Оценка",
    name: "Название",
    year: "Год",
    region: "Страна/Регион",
    denomination: "Номинал",
    mintage: "Тираж",
    krauseNumber: "Номер Krause",
    material: "Материал",
    diameter: "Диаметр",
    thickness: "Толщина",
    weight: "Вес",
    obverse: "Аверс",
    reverse: "Реверс",
    details: "Подробности",
    collectionAdvice: "Совет по коллекционированию",
  },
  messages: {
    recognitionResult: "Результат распознавания",
    uploading: "Загрузка файлов на сервер...",
    uploadComplete: "Загрузка файлов завершена",
    recognitionFailed: "Ошибка распознавания",
    notCoin: "Не распознано как монета, возможно другой предмет",
    error: "Ошибка",
    collectionAdviceWithValuation: "Используйте текущую оценку только как быстрый ориентир и в первую очередь сохраняйте состояние монеты, прежде чем принимать решение о долгосрочном хранении в коллекции.",
    collectionAdviceDefault: "Сначала сохраните состояние монеты, а затем проверьте разновидность и знак монетного двора перед решением о долгосрочном хранении в коллекции.",
  },
  prompts: {
    usage: "Использование: node recognize.ts <img1> <img2> [token] [locale]",
    missingFiles: "Пожалуйста, укажите оба файла изображений",
  },
};
