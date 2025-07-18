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
          pseudo: string;
          name: string;
        };
        home: {
          description: string;
          projects: string;
          title: string;
        };
        projects: {
          title: string;
          header: string;
          description: string;
          role: string;
          client: string;
        }[];
      };
    };
  }
}
