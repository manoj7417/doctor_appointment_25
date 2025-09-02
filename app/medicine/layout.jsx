import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";

const Layout = ({ children }) => {
  return (
    <>
      <main>{children}</main>
    </>
  );
};

export default Layout;
