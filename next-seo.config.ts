const title = process.env.CLIENT_NAME;
const description =
  "Data insights at your fingertips with a comprehensive and collaborative data platform that optimizes performance by streamlining data workflows, removing barriers that inhibit data integration, delivering robust and customizable data visualizations, and AI-driven predictive analytics.";

const SEO = {
  title,
  description,
  canonical: "https://dflux-next.vercel.app",
  openGraph: {
    type: "website",
    locale: "en_IE",
    url: "https://dflux-next.vercel.app",
    title,
    description,
    images: [
      {
        url: "",
        alt: title,
        width: 1280,
        height: 720,
      },
    ],
  },
  //   twitter: {
  //     handle: "@vihar13k",
  //     site: "@vihar13k",
  //     cardType: "summary_large_image",
  //   },
};

export default SEO;
