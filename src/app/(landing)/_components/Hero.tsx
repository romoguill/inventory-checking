import Image from 'next/image';
import bgHero from '../../../../public/hero-bg.jpg';

import { cn } from '@/lib/utils';
import { Salsa as LogoFont } from 'next/font/google';

const logoFont = LogoFont({
  weight: '400',
  subsets: ['latin'],
});

function Hero() {
  return (
    // <div className='w-full h-[300px] sm:h-[80vh] md:h-[80vh] bg-hero bg-no-repeat bg-cover bg-right-top'>
    //   <div className='w-full h-fullopacity-15'></div>
    // </div>
    <>
      {/* Image by Tiger Lily */}
      <Image
        src={bgHero}
        alt='Hero background - Person scanning bar code'
        aria-hidden
        className='object-cover object-[top_right] opacity-80 z-0 brightness-75 h-[calc(60vh+64px)] md:h-[calc(80vh+80px)] absolute top-0'
      />
      <section className='z-10 flex flex-col justify-end relative md:grid md:grid-cols-[minmax(0,_100px)_500px_minmax(0,_1fr)] md:grid-rows-[200px_1fr_200px] h-[60vh] md:h-[80vh] md:place-items-center '>
        <div className='absolute bottom-0 h-56 w-full md:inset-0 md:h-auto bg-orange-700/30 rounded-xl col-start-2 col-span-1 row-start-2 row-span-1 z-30 backdrop-blur-lg'></div>
        <article className='px-6 pb-4 rounded-xl col-start-2 row-start-2 row-span-1 z-40 md:px-10 md:py-8'>
          <h1 className='text-4xl text-white font-extrabold leading-relaxed'>
            Keep your inventory in{' '}
            <span
              className={cn(
                'text-landing-foreground bg-landing px-2 inline-block',
                logoFont.className
              )}
            >
              check
            </span>
          </h1>
          <h2 className='text-landing font-semibold text-lg mt-4'>
            Simplify your inventory checking / stock-taking with our software,
            all in one place.
          </h2>
        </article>
      </section>
    </>
  );
}

export default Hero;
