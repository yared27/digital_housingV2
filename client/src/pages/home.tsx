import Navbar from "../components/Layout/Navbar";
import Hero from "../components/Home/Hero";
import ValueProps from "@/components/Home/Features";
import PropertyShowcase from "@/components/Home/PropertyshowCase";
import CallToAction from "@/components/Home/CTA"
import Footer from "@/components/Home/footer";
const Home = () =>{

    return(
        <>
        <Navbar/>
        <Hero/>
        <ValueProps/>
        <PropertyShowcase/>
        <CallToAction/>
        <Footer/>
        </>
    )
}

export default Home