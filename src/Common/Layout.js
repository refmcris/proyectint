import SideBar from "../Components/Dashboard/sidebar";

function Layout({ children }) {
    return (
      <div style={{ display: 'flex' }}>
        <SideBar />
        <main style={{ flexGrow: 1 }}>
          {children}
        </main>
      </div>
    );
  }
  
  export default Layout;