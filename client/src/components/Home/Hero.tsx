import {Button} from "@/components/ui/button";
import {useNavigate} from "react-router-dom";
import classNames from 'classnames';

const Hero = ()=>{

    return(

        <div className="relative bg-[url('/homeImage.png')] bg-cover bg-center w-full overflow-hidden min-h-screen">
         {/* <div className="absolute inset-0 bg-black/10"></div> */}
         
      <div className="relative z-10 flex flex-col h-screen items-center justify-center text-white">
        <div className="text-center">
       <h1 className="text-4xl font-bold md:text-6xl "> welcome to  Digital housing</h1>
        <p className="text-xl  mt-4">
            Find your perfect home with ease. Explore the best rental properties in your city
        </p>
        <Button className=" mt-8 px-6 py-3 bg-blue-600 text-white  hover:bg-blue-700 ">Explor now </Button>
        </div>
        </div>
        </div>

    )
}

export default Hero