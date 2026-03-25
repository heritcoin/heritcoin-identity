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
    lettering: "Легенда",
    description: "Описание",
    creators: "Авторы",
  },
  messages: {
    recognitionResult: "Результат распознавания",
    uploading: "Загрузка файлов на сервер...",
    recognitionFailed: "Ошибка распознавания",
    notCoin: "Не распознано как монета, возможно другой предмет",
    error: "Ошибка",
    needTwoImages: "Загрузите 2 изображения одной и той же монеты.",
    needOneMoreImage: "Загрузите ещё 1 изображение той же монеты.",
    tooManyImages: "Загрузите заново. За один запрос можно обработать только 2 изображения.",
    collectionAdviceWithValuation: "Текущая оценка составляет примерно {valuation}. Сначала сохраните состояние монеты, а затем проверьте знак монетного двора, разновидность и детали сохранности для более точной оценки.",
    collectionAdviceForCoinWithValuation: "Для {coin} текущая оценка составляет примерно {valuation}. Сначала сохраните состояние монеты, а затем проверьте знак монетного двора, разновидность и детали сохранности для более точной оценки.",
    collectionAdviceForCoin: "Для {coin} сначала сохраните состояние монеты, а затем проверьте знак монетного двора, разновидность и детали сохранности перед решением о долгосрочном хранении в коллекции.",
    collectionAdviceDefault: "Сначала сохраните состояние монеты, а затем проверьте разновидность и знак монетного двора перед решением о долгосрочном хранении в коллекции.",
  },
  prompts: {
    recognizeUsage:
      "Использование: node recognize.ts <img1> <img2> [--locale <locale>] [--token <token>]",
    resolveRequestUsage: "Использование: node resolve-request.ts [session-file]",
    missingFiles: "Пожалуйста, укажите оба файла изображений",
  },
};
