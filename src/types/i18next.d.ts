import "react-i18next";

declare module "react-i18next" {
  interface CustomTypeOptions {
    defaultNS: "translation";
    resources: {
      translation: {
        nav: {
          projects: string;
          about: string;
          contact: string;
        };
        common: {
          utazon: string;
          antoine_vernez: string;
        };
        home: {
          description: string;
          projects: string;
        };
      };
    };
  }
}

