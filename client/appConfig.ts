const url = process.env.NEXTAUTH_URL;
const publicUrl = process.env.NEXT_PUBLIC_NEXTAUTH_URL

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const baseApiUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;



export const appConfig = {
  name: "E-commerce",
  title: "E-commerce",
  description: "",
  url,
  publicUrl,
  apiUrl,
  baseApiUrl,
  baseUrl,
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
