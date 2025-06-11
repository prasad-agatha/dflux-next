// react
import React, { FC } from "react";
// appprops for next
// import { AppProps /*, AppContext */ } from "next/app";
// site Layout
import { SiteLayout } from "layouts";
// seo
import { DefaultSeo } from "next-seo";
// seo config
import SEO from "../next-seo.config";
// styles across the project
import "styles/App.scss";

const MyApp: FC = (props: any) => {
  return (
    <React.Fragment>
      <SiteLayout>
        <DefaultSeo {...SEO} />
        <props.Component {...props.pageProps} />
      </SiteLayout>
    </React.Fragment>
  );
};

export default MyApp;
