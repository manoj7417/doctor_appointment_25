import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";

const DoctorsLayout = ({ children }) => {
  return (
    <>
      <main>
        <Navbar />
        {children}
        <Footer />
      </main>
    </>
  );
};

export default DoctorsLayout; 