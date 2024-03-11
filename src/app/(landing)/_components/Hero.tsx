import Image from 'next/image';
import bgHero from '../../../../public/hero-bg.jpg';
import LandingContainer from './LandingContainer';

function Hero() {
  return (
    // <div className='w-full h-[300px] sm:h-[80vh] md:h-[80vh] bg-hero bg-no-repeat bg-cover bg-right-top'>
    //   <div className='w-full h-fullopacity-15'></div>
    // </div>
    <>
      <Image
        src={bgHero}
        alt='Hero background - Person scanning bar code'
        fill
        aria-hidden
        className='object-cover opacity-80 z-0'
      />
      <section>
        <article className='z-10 relative grid grid-cols-[100px_500px_1fr] grid-rows-[200px_1fr_200px] h-[80vh] place-items-center'>
          <div className='absolute inset-0 bg-orange-700/20 rounded-xl col-start-2 col-span-1 row-start-2 row-span-1 z-30 backdrop-blur-lg'></div>
          <h1 className='text-4xl text-white font-extrabold leading-loose p-10 rounded-xl col-start-2 row-start-2 row-span-1 z-40'>
            Keep your inventory in{' '}
            <span className='bg-clip-text bg-slate-800 text-transparent'>
              check
            </span>
          </h1>
        </article>
      </section>
    </>
  );
}

export default Hero;
