import { Context } from './context';
import LoadingPage from './global/loading';
import { clsx, pathname, React, ReactDOM } from './imports';
import routes from './routes';

async function rootRender(rootDOM: HTMLElement) {
  const root = ReactDOM.createRoot(rootDOM);
  try {
    const jsxAppPath = rootDOM?.dataset.reactApp;
    const pageData = rootDOM?.dataset.pageData;
    const App = routes[jsxAppPath as string]
    if (App && App.render) {
      console.log("App:", App)
      App.render();
    } else {
      const Loading: React.ReactNode = <LoadingPage className="h-[calc(100vh-160px)] w-full flex items-center justify-center p-0 m-0" />
      root.render(
        Loading
      );
      root.render(
        <Context pageData={pageData} rootDOM={rootDOM}>
          <App />
        </Context>
      );
    }
  } catch (error) {
    console.log("ERROR", error);
    root.render(
      <div className="relative h-full">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[560px] w-full leading-[1.1] px-[15px] pt-[110px] md:pl-[160px] md:pt-0 md:pr-0">
          <div className={clsx("absolute left-0 top-0 inline-block w-[110px] h-[110px] md:w-[140px] md:h-[140px] bg-cover", "bg-[url('" + pathname("/images/emoji.png") + "')]")}></div>
          <h1 className="font-[Nunito] text-[65px] font-[700] mt-0 mb-[10px] text-[#151723] uppercase">404</h1>
          <h2 className="font-[Nunito] text-[21px] font-[400] m-0 uppercase text-[#151723]">Oops! Page Not Be Found</h2>
          <p className="font-[Nunito] font-[400] text-[#999fa5]">Sorry but the page you are looking for does not exist, have been removed. name changed or is temporarily unavailable</p>
          <a href={pathname("/")} className="font-[Nunito] text-[#388dbc] rounded-[40px] font-[700] inline-block">Back to homepage</a>
        </div>
      </div>
    )
  }
}

async function renderNav() {
  const { render: navBarRender } = await import("./global/header")
  navBarRender();
}

async function renderAdminNav() {
  const { render: adminNavbarRender } = await import("./admin/header")
  adminNavbarRender();
}

async function renderSidebar() {
  const { render: sidebarRender } = await import("./admin/sidebar")
  sidebarRender();
}

const renderApp = (containerId: string = "root", withNav: boolean = false, navOnly: boolean = false, withAdminSidebar: boolean = false) => {
  if (withAdminSidebar) {
    if (withNav) {
      renderAdminNav()
    }
    renderSidebar();
  } else {
    if (withNav) {
      renderNav();
    }
  }
  if (!navOnly) {
    const rootDOM = document.getElementById(containerId);
    if (rootDOM) {
      rootRender(rootDOM as HTMLElement)
    } else {
      rootRender(document.body)
    }
  }
};

// Expose the render function globally

(window as any).ReactApp = { renderApp };
