import { Bed, Bath, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const properties = [
  {
    id: 1,
    title: "Luxury Villa",
    location: "Bole, Addis Abeba",
    price: "$1,200/month",
    beds: 4,
    baths: 3,
    sqft: 2200,
    image: "https://res.cloudinary.com/diw9kt7xf/image/upload/v1746101333/b3462521a30f49abcaef8d911fc771e3_qq7t4y"
  },
  {
    id: 2,
    title: "Modern Apartment",
    location: "CMC, Addis Abeba",
    price: "$950/month",
    beds: 2,
    baths: 2,
    sqft: 1200,
    image: "https://res.cloudinary.com/diw9kt7xf/image/upload/v1746125883/ab005daeada6d5a658ecfd8052e97f50_xqyqgm.jpg"
  },
  {
    id: 3,
    title: "Cozy Studio",
    location: "Piassa, Addis Abeba",
    price: "$600/month",
    beds: 1,
    baths: 1,
    sqft: 800,
    image: "https://res.cloudinary.com/diw9kt7xf/image/upload/v1746125707/6ed7a4fea194ebc4795c2c9b0455b78a_qxnnzn.jpg"
  }
];

const PropertyShowcase = () => {
  return (
    <section className='py-16 bg-gray-50 dark:bg-gray-900'>
      <div className='container px-4'>
        <h2 className='text-3xl font-bold text-center mb-4'>Featured Properties</h2>
        <p className='text-muted-foreground text-center mb-12'>Discover your perfect home today</p>
        
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {properties.map((property) => (
            <Card 
              key={property.id} 
              className='overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-all'
            >
              {/* Optimized Image */}
              <div className='relative aspect-video'>
                <img
                  src={`${property.image.replace('/upload/', '/upload/c_fill,w_800,h_600,q_auto,f_auto/')}`}
                  alt={`${property.title} in ${property.location}`}
                  className='w-full h-full object-cover'
                  loading='lazy'
                  decoding='async'
                />
                <button className='absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-white transition'>
                  <Heart className='w-5 h-5 text-gray-700' />
                </button>
              </div>
              
              <CardContent className='p-6'>
                <h3 className='text-xl font-semibold mb-1'>{property.title}</h3>
                <p className='text-muted-foreground mb-4'>{property.location}</p>
                
                <div className='flex gap-4 text-sm mb-4'>
                  <div className='flex items-center'>
                    <Bed className='w-4 h-4 mr-1.5' />
                    {property.beds}
                  </div>
                  <div className='flex items-center'>
                    <Bath className='w-4 h-4 mr-1.5' />
                    {property.baths}
                  </div>
                  <span>{property.sqft} sqft</span>
                </div>
                
                <div className='flex justify-between items-center'>
                  <span className='text-green-600 font-bold'>{property.price}</span>
                  <button  className='text-sm font-medium text-primary hover:underline'>
                    View Details
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PropertyShowcase;