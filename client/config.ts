const url = process.env.NEXTAUTH_URL;

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const appConfig = {
  name: "E-commerce",
  title: "E-commerce",
  description: "",
  url,
  apiUrl,
  author: {
    name: "E-commerce",
    email: "demo@gmail.com",
    website: "www.commerce.com",
  },
  links: {
    linkedIn: "",
    github: "",
  },
};

export default appConfig;
